<?php

namespace szenario\craftaltpilot\services;

use Craft;
use craft\elements\Asset;
use craft\helpers\StringHelper;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\behaviors\AltPilotMetadata;
use Throwable;
use yii\base\Component;
use yii\db\Expression;
use \yii\db\Connection;

/**
 * Handles metadata table orchestration.
 */
class DatabaseService extends Component
{
    public const TABLE_NAME = '{{%altpilot_metadata}}';

    /**
     * Populate the metadata table with all assets from the selected volumes.
     */
    public function initializeDatabase(): void
    {
        $db = Craft::$app->getDb();

        if (!$db->tableExists(self::TABLE_NAME)) {
            Craft::warning('Cannot initialize AltPilot metadata: table not found.', 'alt-pilot');
            return;
        }

        $settings = AltPilot::getInstance()->getSettings();
        $volumeIds = $settings->volumeIDs;

        if ($volumeIds === []) {
            Craft::info('Skipping AltPilot metadata initialization: no volumes selected.', 'alt-pilot');
            return;
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
                $this->insertMultipleAssets($db, $assetBatch);
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
                'alt-pilot'
            );
        }
    }

    private function insertMultipleAssets(Connection $db, array $assets): void
    {
        $rows = [];
        foreach ($assets as $asset) {
            $rows[] = [
                'assetId' => (int) $asset->id,
                'siteId' => (int) $asset->siteId,
                'volumeId' => (int) $asset->volumeId,
                'status' => $this->determineInitialStatus($asset),
                'dateCreated' => new Expression('NOW()'),
                'dateUpdated' => new Expression('NOW()'),
                'uid' => StringHelper::UUID(),
            ];
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
            Craft::error('Batch metadata insert failed: ' . $exception->getMessage(), 'alt-pilot');
            foreach ($assets as $asset) {
                if ($asset instanceof Asset) {
                    $this->insertSingleAsset($db, $asset);
                }
            }
        }
    }

    public function handleVolumesChange(array $oldVolumeIds, array $newVolumeIds): void
    {
        // we need to find out if a volume has been added or removed
        $addedVolumes = array_diff($newVolumeIds, $oldVolumeIds);
        $removedVolumes = array_diff($oldVolumeIds, $newVolumeIds);

        $db = Craft::$app->getDb();

        if ($addedVolumes !== []) {
            Craft::info('Volumes added: ' . implode(', ', $addedVolumes), 'alt-pilot');


        }

        if ($removedVolumes !== []) {
            Craft::info('Volumes removed: ' . implode(', ', $removedVolumes), 'alt-pilot');
            // $db->createCommand()->delete(self::TABLE_NAME, ['volumeId' => $removedVolumes])->execute();
        }
    }

    /**
     * Remove metadata rows for the given asset ID.
     */
    public function deleteMetadataForAsset(int $assetId): void
    {
        try {
            $result = Craft::$app->getDb()
                ->createCommand()
                ->delete(self::TABLE_NAME, ['assetId' => $assetId])
                ->execute();

            Craft::info('Deleted ' . $result . ' metadata rows for asset ' . $assetId, 'alt-pilot');
        } catch (Throwable $exception) {
            Craft::error(
                sprintf('Failed to delete metadata for asset %d: %s', $assetId, $exception->getMessage()),
                'alt-pilot'
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

            Craft::info('Deleted ' . $result . ' metadata rows for site ' . $siteId, 'alt-pilot');
        } catch (Throwable $exception) {
            Craft::error(
                sprintf('Failed to delete metadata for site %d: %s', $siteId, $exception->getMessage()),
                'alt-pilot'
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

            Craft::info('Deleted ' . $result . ' metadata rows for volume ' . $volumeId, 'alt-pilot');
        } catch (Throwable $exception) {
            Craft::error(
                sprintf('Failed to delete metadata for volume %d: %s', $volumeId, $exception->getMessage()),
                'alt-pilot'
            );
        }
    }


    private function determineInitialStatus(Asset $asset): int
    {
        return trim((string) $asset->alt) !== ''
            ? AltPilotMetadata::STATUS_MANUAL
            : AltPilotMetadata::STATUS_MISSING;
    }
}
