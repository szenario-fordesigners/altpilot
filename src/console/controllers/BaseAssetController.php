<?php

namespace szenario\craftaltpilot\console\controllers;

use craft\console\Controller;
use craft\elements\Asset;
use craft\helpers\Console;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\behaviors\AltPilotMetadata;

/**
 * Shared logic for the CLI commands that queue alt text generation.
 * Subclasses only need to build the asset query and call processAssets().
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

    protected function processAssets(bool $onlyMissing, bool $excludeManual = false): void
    {
        $settings = AltPilot::getInstance()->getSettings();
        $volumeIds = $settings->volumeIDs;

        if (empty($volumeIds)) {
            $this->stderr("No volumes configured in AltPilot settings.\n", Console::FG_RED);
            return;
        }

        $openAiApiKey = $settings->openAiApiKey;
        if ($openAiApiKey === '') {
            $this->stderr("No OpenAI API key configured in AltPilot settings.\n", Console::FG_RED);
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

        $total = $query->count();

        $this->stdout("Scanning $total assets...\n");

        $queued = 0;
        $skipped = 0;
        $processed = 0;
        $errors = [];

        Console::startProgress(0, $total, 'Queueing: ', false);

        foreach ($query->batch(100) as $assets) {
            foreach ($assets as $asset) {
                $processed++;

                if ($onlyMissing && !empty($asset->alt)) {
                    $skipped++;
                    Console::updateProgress($processed, $total);
                    continue;
                }

                if ($excludeManual) {
                    $behavior = $asset->getBehavior('altPilotMetadata');
                    if ($behavior instanceof AltPilotMetadata && $behavior->getStatus() === AltPilotMetadata::STATUS_MANUAL) {
                        $skipped++;
                        Console::updateProgress($processed, $total);
                        continue;
                    }
                }

                $result = AltPilot::getInstance()->queueService->safelyCreateJob($asset);

                if ($result['status'] === 'success') {
                    $queued++;
                } elseif ($result['status'] === 'warning') {
                    $skipped++;
                } else {
                    $errors[] = "Asset {$asset->id} (Site: {$asset->siteId}): {$result['message']}";
                }

                Console::updateProgress($processed, $total);
            }
        }

        Console::endProgress();

        $this->success("Queued $queued assets for generation. Skipped: $skipped. Errors: " . count($errors) . '.');

        if (!empty($errors)) {
            $this->stdout("\nErrors:\n", Console::FG_RED);
            foreach ($errors as $error) {
                $this->stdout("  - $error\n", Console::FG_RED);
            }
        }

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
