<?php

namespace szenario\craftaltpilot\services\assets;

use Craft;
use craft\db\Query;
use craft\db\Table;
use craft\elements\Asset;
use craft\elements\db\AssetQuery;
use craft\helpers\StringHelper;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\behaviors\AltPilotMetadata;
use craft\fieldlayoutelements\assets\AltField;
use craft\models\FieldLayoutTab;
use szenario\craftaltpilot\helpers\SettingsHelper;
use Throwable;
use yii\base\Component;
use yii\db\Expression;
use yii\db\Connection;

/**
 * Manages the `altpilot_metadata` table — a denormalized index that tracks
 * every image asset's alt text status (missing / AI-generated / manual) per site.
 *
 * This table exists so the plugin can efficiently query status counts and filter
 * assets by status without scanning every asset's alt field across all sites.
 *
 * The table is populated on install, updated when volumes change in settings,
 * and kept in sync via the AltPilotMetadata behavior (afterSave/afterDelete).
 */
class DatabaseService extends Component
{
    public const TABLE_NAME = '{{%altpilot_metadata}}';

    /**
     * Populate the metadata table with all image assets from the configured volumes.
     * Called once on plugin install. Ensures each volume has the native Alt field
     * enabled, then scans all sites and inserts a metadata row per asset+site pair.
     */
    public function initializeDatabase(): void
    {
        $db = Craft::$app->getDb();

        if (!$db->tableExists(self::TABLE_NAME)) {
            Craft::warning('Cannot initialize AltPilot metadata: table not found.', 'altpilot');
            return;
        }

        $settings = AltPilot::getInstance()->getSettings();
        $volumeIds = SettingsHelper::normalizeVolumeIds($settings->volumeIDs ?? []);

        if ($volumeIds === []) {
            Craft::info('Skipping AltPilot metadata initialization: no volumes selected.', 'altpilot');
            return;
        }

        foreach ($volumeIds as $volumeId) {
            $this->ensureAltFieldForVolume((int) $volumeId);
        }

        $sites = Craft::$app->getSites()->getAllSites();
        $batchSize = 250;
        foreach ($sites as $site) {
            $siteId = (int) $site->id;
            $query = Asset::find()
                ->siteId($siteId)
                ->kind('image')
                ->volumeId($volumeIds)
                ->trashed(false)
                ->limit(null);

            foreach ($query->batch($batchSize) as $assetBatch) {
                /** @var Asset[] $assetBatch */
                $this->syncAssets($db, $assetBatch);
            }
        }
    }

    public function insertSingleAsset(Connection $db, Asset $asset, ?int $status = null): void
    {
        $status ??= $this->determineInitialStatus($asset);

        $now = new Expression('NOW()');

        try {
            $db->createCommand()->upsert(
                self::TABLE_NAME,
                [
                    'assetId' => $asset->id,
                    'siteId' => $asset->siteId,
                    'volumeId' => $asset->volumeId,
                    'status' => $status,
                    'dateCreated' => $now,
                    'dateUpdated' => $now,
                    'uid' => StringHelper::UUID(),
                ],
                [
                    'status' => $status,
                    'dateUpdated' => $now,
                    'volumeId' => $asset->volumeId,
                ]
            )->execute();
        } catch (Throwable $exception) {
            Craft::error(
                sprintf(
                    'Failed to initialize metadata for asset %d (site %d): %s',
                    $asset->id,
                    $asset->siteId,
                    $exception->getMessage()
                ),
                'altpilot'
            );
        }
    }

    /**
     * Bring the metadata rows for these assets in line with their alt text.
     *
     * Missing rows are batch-inserted. Existing rows keep their status, because
     * AI-generated vs. manual can't be rebuilt from the alt text; only
     * contradictions are corrected: empty alt → MISSING, alt text on a MISSING
     * row → MANUAL. A stale volumeId is updated too.
     *
     * @param Asset[] $assets
     */
    private function syncAssets(Connection $db, array $assets): void
    {
        if ($assets === []) {
            return;
        }

        $existing = [];
        $existingRows = (new Query())
            ->select(['assetId', 'siteId', 'volumeId', 'status'])
            ->from(self::TABLE_NAME)
            ->where(['assetId' => array_unique(array_map(static fn(Asset $asset) => (int) $asset->id, $assets))])
            ->all($db);
        foreach ($existingRows as $row) {
            $existing[$row['assetId'] . '-' . $row['siteId']] = $row;
        }

        $rows = [];
        $newAssets = [];
        foreach ($assets as $asset) {
            $status = $this->determineInitialStatus($asset);
            $row = $existing[$asset->id . '-' . $asset->siteId] ?? null;

            if ($row === null) {
                $newAssets[] = $asset;
                $rows[] = [
                    'assetId' => (int) $asset->id,
                    'siteId' => (int) $asset->siteId,
                    'volumeId' => (int) $asset->volumeId,
                    'status' => $status,
                    'dateCreated' => new Expression('NOW()'),
                    'dateUpdated' => new Expression('NOW()'),
                    'uid' => StringHelper::UUID(),
                ];
                continue;
            }

            $oldStatus = (int) $row['status'];
            if ($status === AltPilotMetadata::STATUS_MANUAL && $oldStatus !== AltPilotMetadata::STATUS_MISSING) {
                $status = $oldStatus;
            }

            if ($status !== $oldStatus || (int) $row['volumeId'] !== (int) $asset->volumeId) {
                $this->insertSingleAsset($db, $asset, $status);
            }
        }

        if ($rows === []) {
            return;
        }

        $columns = array_keys($rows[0]);
        $values = array_map(static fn(array $row) => array_values($row), $rows);

        try {
            $db->createCommand()
                ->batchInsert(self::TABLE_NAME, $columns, $values)
                ->execute();
        } catch (Throwable $exception) {
            Craft::error('Batch metadata insert failed: ' . $exception->getMessage(), 'altpilot');
            foreach ($newAssets as $asset) {
                $this->insertSingleAsset($db, $asset);
            }
        }
    }

    /**
     * React to volume selection changes in the plugin settings.
     * Syncs metadata rows for newly added volumes. Rows of removed volumes are
     * kept (queries ignore unconfigured volumes), so re-adding a volume doesn't
     * turn its AI-generated statuses into MANUAL.
     */
    public function handleVolumesChange(array $oldVolumeIds, array $newVolumeIds): void
    {
        $addedVolumes = array_values(array_diff($newVolumeIds, $oldVolumeIds));

        if ($addedVolumes !== []) {
            Craft::info('Volumes added: ' . implode(', ', $addedVolumes), 'altpilot');

            // During a project config apply, the volume config comes from the YAML,
            // which the source environment already updated. Saving volumes here would
            // throw when admin changes are disabled (read-only project config).
            if (!Craft::$app->getProjectConfig()->getIsApplyingExternalChanges()) {
                foreach ($addedVolumes as $volumeId) {
                    $this->ensureAltFieldForVolume((int) $volumeId);
                }
            }

            $db = Craft::$app->getDb();
            $query = Asset::find()
                ->siteId('*')
                ->kind('image')
                ->volumeId($addedVolumes)
                ->trashed(false);

            $processedBatchCount = 0;
            $processedAssetCount = 0;
            foreach ($query->batch(200) as $batch) {
                /** @var Asset[] $batch */
                $processedBatchCount++;
                $processedAssetCount += count($batch);
                $this->syncAssets($db, $batch);
            }

            Craft::info(
                'Finished processing added volumes. Batches: ' . $processedBatchCount . ', assets: ' . $processedAssetCount . '.',
                'altpilot'
            );
        }
    }

    public function deleteMetadataForSite(int $siteId): void
    {
        try {
            $result = Craft::$app->getDb()
                ->createCommand()
                ->delete(self::TABLE_NAME, ['siteId' => $siteId])
                ->execute();

            Craft::info('Deleted ' . $result . ' metadata rows for site ' . $siteId, 'altpilot');
        } catch (Throwable $exception) {
            Craft::error(
                sprintf('Failed to delete metadata for site %d: %s', $siteId, $exception->getMessage()),
                'altpilot'
            );
        }
    }

    public function deleteMetadataForVolume(int $volumeId): void
    {
        try {
            $result = Craft::$app->getDb()
                ->createCommand()
                ->delete(self::TABLE_NAME, ['volumeId' => $volumeId])
                ->execute();

            Craft::info('Deleted ' . $result . ' metadata rows for volume ' . $volumeId, 'altpilot');
        } catch (Throwable $exception) {
            Craft::error(
                sprintf('Failed to delete metadata for volume %d: %s', $volumeId, $exception->getMessage()),
                'altpilot'
            );
        }
    }

    /**
     * Returns aggregate counts from the metadata table.
     *
     * Metadata is the status source of truth. Counts are scoped to rows that
     * still point at live image assets in the configured volumes.
     *
     * @return array{counts: array<int,int>, total: int}
     */
    public function getStatusCounts(): array
    {
        $rows = $this->createMetadataStatusQuery()
            ->select(['metadata.status', 'count' => 'COUNT(*)'])
            ->groupBy(['metadata.status'])
            ->all();

        $counts = [
            AltPilotMetadata::STATUS_MISSING => 0,
            AltPilotMetadata::STATUS_AI_GENERATED => 0,
            AltPilotMetadata::STATUS_MANUAL => 0,
        ];

        $total = 0;

        foreach ($rows as $row) {
            $status = (int) $row['status'];
            $count = (int) $row['count'];
            if (isset($counts[$status])) {
                $counts[$status] = $count;
                $total += $count;
            }
        }

        return [
            'counts' => $counts,
            'total' => $total,
        ];
    }

    public function createAssetStatusQuery(string $filter = 'all', ?string $orderBy = null): AssetQuery
    {
        $settings = AltPilot::getInstance()->getSettings();
        $volumeIds = SettingsHelper::normalizeVolumeIds($settings->volumeIDs ?? []);

        $query = Asset::find()
            ->kind('image')
            ->siteId('*');

        if ($orderBy !== null) {
            $query->orderBy($orderBy);
        }

        // An empty array matches nothing (AssetQuery::beforePrepare()).
        $query->volumeId($volumeIds);

        $this->applyStatusFilter($query, $filter);

        return $query;
    }

    private function applyStatusFilter(AssetQuery $query, string $filter): void
    {
        if ($filter === 'missing') {
            $query->andWhere(['exists', $this->metadataExistsQuery(AltPilotMetadata::STATUS_MISSING)]);
        } elseif ($filter === 'manual') {
            $query->andWhere(['exists', $this->metadataExistsQuery(AltPilotMetadata::STATUS_MANUAL)]);
        } elseif ($filter === 'ai-generated') {
            $query->andWhere(['exists', $this->metadataExistsQuery(AltPilotMetadata::STATUS_AI_GENERATED)]);
        } else {
            $query->andWhere(['exists', $this->metadataExistsQuery()]);
        }
    }

    private function metadataExistsQuery(?int $status = null): Query
    {
        $query = (new Query())
            ->select('assetId')
            ->from(self::TABLE_NAME)
            ->where('[[assetId]] = [[elements.id]]')
            ->andWhere('[[volumeId]] = [[assets.volumeId]]');

        if ($status !== null) {
            $query->andWhere(['status' => $status]);
        }

        return $query;
    }

    /**
     * Returns distinct totals used by the dashboard widget.
     *
     * @return array{imageTotal: int, languageTotal: int}
     */
    public function getWidgetTotals(): array
    {
        $metadataQuery = $this->createMetadataStatusQuery();

        return [
            'imageTotal' => (int) (clone $metadataQuery)->count('DISTINCT [[metadata.assetId]]'),
            'languageTotal' => (int) (clone $metadataQuery)->count('DISTINCT [[metadata.siteId]]'),
        ];
    }

    private function createMetadataStatusQuery(): Query
    {
        $settings = AltPilot::getInstance()->getSettings();
        $volumeIds = SettingsHelper::normalizeVolumeIds($settings->volumeIDs ?? []);

        $query = (new Query())
            ->from(['metadata' => self::TABLE_NAME])
            ->innerJoin(['assets' => Table::ASSETS], '[[assets.id]] = [[metadata.assetId]]')
            ->innerJoin(['elements' => Table::ELEMENTS], '[[elements.id]] = [[metadata.assetId]]')
            ->where(['assets.kind' => Asset::KIND_IMAGE])
            ->andWhere(['elements.dateDeleted' => null])
            ->andWhere('[[metadata.volumeId]] = [[assets.volumeId]]')
            // An empty IN () matches nothing.
            ->andWhere(['assets.volumeId' => $volumeIds]);

        return $query;
    }

    /**
     * Make sure Craft's native Alt field is present in the volume's field layout
     * and that alt text is translated per-language. Without this, assets in the
     * volume wouldn't have an alt field to write generated text into.
     */
    private function ensureAltFieldForVolume(int $volumeId): void
    {
        $volumesService = Craft::$app->getVolumes();
        $volume = $volumesService->getVolumeById($volumeId);

        if ($volume === null) {
            Craft::warning('Unable to ensure alt field for unknown volume ' . $volumeId, 'altpilot');
            return;
        }

        $fieldLayout = $volume->getFieldLayout();
        $tabs = $fieldLayout->getTabs();

        if ($tabs === []) {
            $tabs[] = new FieldLayoutTab([
                'layout' => $fieldLayout,
                'name' => Craft::t('app', 'Content'),
                'elements' => [],
            ]);
            $fieldLayout->setTabs($tabs);
        }

        $hasAltField = false;
        foreach ($tabs as $tab) {
            foreach ($tab->getElements() as $element) {
                if ($element instanceof AltField) {
                    $hasAltField = true;
                    break 2;
                }
            }
        }

        $isDirty = false;

        if (!$hasAltField) {
            $elements = $tabs[0]->getElements();
            $elements[] = new AltField();
            $tabs[0]->setElements($elements);
            $fieldLayout->setTabs($tabs);
            $volume->setFieldLayout($fieldLayout);
            $isDirty = true;
        }

        if ($volume->altTranslationMethod !== 'language') {
            $volume->altTranslationMethod = 'language';
            $isDirty = true;
        }

        if ($isDirty) {
            if (!$volumesService->saveVolume($volume)) {
                Craft::error('Failed to save volume ' . $volumeId . ' while ensuring alt field.', 'altpilot');
            } else {
                Craft::info('Ensured alt field is enabled for volume successfully: ' . $volumeId, 'altpilot');
            }
        }
    }

    private function determineInitialStatus(Asset $asset): int
    {
        return AltPilotMetadata::statusForAlt($asset->alt);
    }
}
