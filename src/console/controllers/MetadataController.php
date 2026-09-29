<?php

namespace szenario\craftaltpilot\console\controllers;

use Craft;
use craft\console\Controller;
use craft\db\Query;
use craft\db\Table;
use craft\elements\Asset;
use craft\helpers\Console;
use craft\helpers\StringHelper;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\behaviors\AltPilotMetadata;
use szenario\craftaltpilot\helpers\SettingsHelper;
use szenario\craftaltpilot\services\assets\DatabaseService;
use yii\console\ExitCode;
use yii\db\Connection;
use yii\db\Expression;

/**
 * Console commands for the `altpilot_metadata` table.
 *
 * - actionBackfill(): reconciles the table to the live image assets in the
 *   configured volumes by inserting missing rows, and (by default) queues alt
 *   text generation for them. Writes by default; pass --dryRun to preview.
 */
class MetadataController extends Controller
{
    /**
     * @var int Number of sample IDs to show.
     */
    public $limit = 20;

    /**
     * @var int|null Narrow the run to a single (configured) volume ID.
     */
    public $volumeId = null;

    /**
     * @var int|null Narrow the run to a single site ID.
     */
    public $siteId = null;

    /**
     * @var bool Preview only — report what would change, write nothing.
     */
    public $dryRun = false;

    /**
     * @var bool Queue alt text generation for newly-tracked missing images.
     */
    public $generate = true;

    /**
     * @var int[] Volume IDs the current run is scoped to (config ∩ --volumeId).
     */
    private array $scopeVolumeIds = [];

    public function options($actionID): array
    {
        $options = parent::options($actionID);

        if ($actionID === 'backfill') {
            $options[] = 'limit';
            $options[] = 'volumeId';
            $options[] = 'siteId';
            $options[] = 'dryRun';
            $options[] = 'generate';
        }

        return $options;
    }

    /**
     * Backfill missing metadata rows so the table matches the live image assets,
     * then (by default) queue alt text generation for the newly-tracked images.
     *
     * Writes by default. Pass --dryRun to preview what would change without
     * touching anything. Safe to re-run: inserts are idempotent upserts and job
     * creation is de-duplicated against the queue.
     */
    public function actionBackfill(): int
    {
        $this->resolveScope();

        if ($this->scopeVolumeIds === []) {
            $this->stderr("No volumes in scope (none configured, or --volumeId is outside them). Nothing to backfill.\n", Console::FG_RED);
            return ExitCode::CONFIG;
        }

        $dryRun = $this->dryRun;

        $this->stdout('AltPilot Metadata Backfill' . ($dryRun ? ' (DRY RUN)' : '') . "\n", Console::BOLD);
        $this->stdout("----------------------------------------\n");
        $this->stdout('Scope:         volumes ' . $this->idList($this->scopeVolumeIds)
            . ', site ' . ($this->siteId !== null ? (int) $this->siteId : 'all') . "\n");
        $this->stdout('Mode:          ' . ($dryRun ? 'dry run (no changes)' : 'COMMIT (writing changes)') . "\n");
        $this->stdout('Auto-generate: ' . ($this->generate ? 'yes' : 'no') . "\n\n");

        $missing = $this->backfillMissingRows($dryRun);

        $verb = $dryRun ? 'Would insert' : 'Inserted';
        $this->stdout('Pairs missing a metadata row: ' . $missing['total'] . "\n", Console::BOLD);
        $this->stdout('  ' . $verb . ' ' . $missing['insertedMissing'] . " as MISSING (no alt text yet)\n");
        $this->stdout('  ' . $verb . ' ' . $missing['insertedManual'] . " as MANUAL (already have alt text)\n");

        foreach ($missing['sample'] as $row) {
            $hasAlt = trim((string) $row['alt']) !== '';
            $this->stdout('    - assetId=' . (int) $row['assetId'] . ' siteId=' . (int) $row['siteId']
                . ($hasAlt ? ' (has alt -> manual)' : '') . "\n");
        }
        if ($missing['total'] > count($missing['sample'])) {
            $this->stdout('    ... and ' . ($missing['total'] - count($missing['sample'])) . " more (raise --limit)\n");
        }
        $this->stdout("\n");

        if ($this->generate) {
            $queue = $this->queueGeneration($missing['missingTargets'], $dryRun);
            $this->stdout("Alt text generation:\n", Console::BOLD);
            if ($dryRun) {
                $this->stdout('  Would queue ' . $queue['attempted'] . " generation job(s) for the newly-tracked missing images.\n\n");
            } else {
                $this->stdout('  Queued ' . $queue['queued'] . ', skipped ' . $queue['skipped']
                    . ' (already pending), errors ' . $queue['errors'] . ".\n\n");
            }
        } else {
            $this->stdout("Alt text generation: skipped (--generate=0).\n\n");
        }

        if ($dryRun) {
            $this->stdout("DRY RUN — nothing was changed. Re-run without --dryRun to apply.\n", Console::FG_YELLOW);
        } else {
            $this->success('Backfill complete.');
            if ($this->generate) {
                $this->stdout("\nRun the queued jobs with:\n");
                $this->stdout("  php craft queue/run --verbose\n", Console::FG_CYAN);
            }
        }

        return ExitCode::OK;
    }

    private function resolveScope(): void
    {
        $configuredVolumeIds = SettingsHelper::normalizeVolumeIds(
            AltPilot::getInstance()->getSettings()->volumeIDs ?? []
        );

        $this->scopeVolumeIds = $this->volumeId !== null
            ? array_values(array_intersect($configuredVolumeIds, [(int) $this->volumeId]))
            : $configuredVolumeIds;
    }

    /**
     * Configured image asset/site pairs that have no metadata row.
     * Caller must ensure $this->scopeVolumeIds is non-empty.
     */
    private function missingPairsQuery(): Query
    {
        $metadataExists = (new Query())
            ->from(DatabaseService::TABLE_NAME)
            ->where('[[assetId]] = [[assets_sites.assetId]]')
            ->andWhere('[[siteId]] = [[assets_sites.siteId]]');

        $query = (new Query())
            ->from(['assets_sites' => Table::ASSETS_SITES])
            ->innerJoin(['assets' => Table::ASSETS], '[[assets.id]] = [[assets_sites.assetId]]')
            ->innerJoin(['elements' => Table::ELEMENTS], '[[elements.id]] = [[assets_sites.assetId]]')
            ->where(['assets.kind' => Asset::KIND_IMAGE])
            ->andWhere(['elements.dateDeleted' => null])
            ->andWhere(['assets.volumeId' => $this->scopeVolumeIds])
            ->andWhere(['not exists', $metadataExists]);

        if ($this->siteId !== null) {
            $query->andWhere(['assets_sites.siteId' => (int) $this->siteId]);
        }

        return $query;
    }

    /**
     * Insert a metadata row for every configured image pair that lacks one.
     * Status is derived from the asset's actual alt text (the same rule install
     * uses): non-empty => manual, empty => missing.
     *
     * @return array{total:int, insertedMissing:int, insertedManual:int,
     *               missingTargets:array<int,array{assetId:int,siteId:int}>,
     *               sample:array<int,array<string,mixed>>}
     */
    private function backfillMissingRows(bool $dryRun): array
    {
        $db = Craft::$app->getDb();

        $rows = $this->missingPairsQuery()
            ->select([
                'assetId' => 'assets_sites.assetId',
                'siteId' => 'assets_sites.siteId',
                'volumeId' => 'assets.volumeId',
                'alt' => 'assets_sites.alt',
            ])
            ->all($db);

        $missingTargets = [];
        $insertedMissing = 0;
        $insertedManual = 0;

        foreach ($rows as $row) {
            $hasAlt = trim((string) $row['alt']) !== '';
            $status = $hasAlt ? AltPilotMetadata::STATUS_MANUAL : AltPilotMetadata::STATUS_MISSING;

            if ($hasAlt) {
                $insertedManual++;
            } else {
                $insertedMissing++;
                $missingTargets[] = ['assetId' => (int) $row['assetId'], 'siteId' => (int) $row['siteId']];
            }

            if (!$dryRun) {
                $this->insertMetadataRow($db, (int) $row['assetId'], (int) $row['siteId'], (int) $row['volumeId'], $status);
            }
        }

        return [
            'total' => count($rows),
            'insertedMissing' => $insertedMissing,
            'insertedManual' => $insertedManual,
            'missingTargets' => $missingTargets,
            'sample' => array_slice($rows, 0, $this->limit),
        ];
    }

    /**
     * Idempotent upsert of a single metadata row. Pure DB bookkeeping — does not
     * load or save the asset element (so it can't trip the Craft asset save path).
     * Mirrors DatabaseService::insertSingleAsset() but works from scalar values.
     */
    private function insertMetadataRow(Connection $db, int $assetId, int $siteId, int $volumeId, int $status): void
    {
        $now = new Expression('NOW()');

        $db->createCommand()->upsert(
            DatabaseService::TABLE_NAME,
            [
                'assetId' => $assetId,
                'siteId' => $siteId,
                'volumeId' => $volumeId,
                'status' => $status,
                'dateCreated' => $now,
                'dateUpdated' => $now,
                'uid' => StringHelper::UUID(),
            ],
            [
                'status' => $status,
                'volumeId' => $volumeId,
                'dateUpdated' => $now,
            ]
        )->execute();
    }

    /**
     * Queue alt text generation for the given asset/site targets, de-duplicated
     * against the existing queue. No-op (counts only) in dry-run mode.
     *
     * @param array<int,array{assetId:int,siteId:int}> $targets
     * @return array{attempted:int, queued:int, skipped:int, errors:int}
     */
    private function queueGeneration(array $targets, bool $dryRun): array
    {
        $result = ['attempted' => count($targets), 'queued' => 0, 'skipped' => 0, 'errors' => 0];

        if ($dryRun || $targets === []) {
            return $result;
        }

        $queueService = AltPilot::getInstance()->queueService;
        $pendingJobIndex = $queueService->buildPendingJobIndex();

        foreach ($targets as $target) {
            $asset = Craft::$app->getAssets()->getAssetById($target['assetId'], $target['siteId']);
            if ($asset === null) {
                $result['errors']++;
                continue;
            }

            $jobResult = $queueService->safelyCreateJob($asset, $pendingJobIndex);
            match ($jobResult['status']) {
                'success' => $result['queued']++,
                'warning' => $result['skipped']++,
                default => $result['errors']++,
            };
        }

        return $result;
    }

    /**
     * @param int[] $ids
     */
    private function idList(array $ids): string
    {
        return $ids === [] ? '(none)' : implode(', ', $ids);
    }
}
