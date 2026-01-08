<?php

namespace szenario\craftaltpilot\console\controllers;

use craft\console\Controller;
use craft\elements\Asset;
use craft\helpers\Console;
use szenario\craftaltpilot\AltPilot;

/**
 * Base controller for asset operations
 */
abstract class BaseAssetController extends Controller
{
    /**
     * @var int|null The site ID to target (optional)
     */
    public $siteId;

    public function options($actionID): array
    {
        $options = parent::options($actionID);
        $options[] = 'siteId';
        return $options;
    }

    protected function processAssets(bool $onlyMissing): void
    {
        $settings = AltPilot::getInstance()->getSettings();
        $volumeIds = $settings->volumeIDs;

        if (empty($volumeIds)) {
            $this->stderr("No volumes configured in AltPilot settings.\n", Console::FG_RED);
            return;
        }

        $query = Asset::find()
            ->volumeId($volumeIds)
            ->kind('image')
            ->limit(null);

        if ($this->siteId) {
            $query->siteId($this->siteId);
        } else {
            $query->siteId('*');
        }

        $count = 0;
        $total = $query->count();

        $this->stdout("Scanning $total assets...\n");

        // Batch processing to avoid memory issues
        foreach ($query->batch(100) as $assets) {
            foreach ($assets as $asset) {
                if ($onlyMissing && !empty($asset->alt)) {
                    continue;
                }

                $this->queueJob($asset);
                $count++;
            }
        }

        $this->success("Queued $count assets for generation.");

        $this->stdout("\nIMPORTANT:\n", Console::BOLD);
        $this->stdout("The jobs have been added to the queue. If you have a cron job set up to run the queue, they will process automatically.\n");
        $this->stdout("Otherwise, run the following command to process them manually:\n\n");
        $this->stdout("  php craft queue/run --verbose\n\n", Console::FG_CYAN);
    }

    protected function queueJob(Asset $asset): void
    {
        $result = AltPilot::getInstance()->queueService->safelyCreateJob($asset);

        if ($result['status'] === 'success') {
            $this->stdout("  [OK] Asset {$asset->id} (Site: {$asset->siteId})\n");
        } elseif ($result['status'] === 'warning') {
            $this->stdout("  [SKIP] Asset {$asset->id} (Site: {$asset->siteId}): {$result['message']}\n", Console::FG_YELLOW);
        } else {
            $this->stderr("  [ERR] Asset {$asset->id} (Site: {$asset->siteId}): {$result['message']}\n", Console::FG_RED);
        }
    }
}
