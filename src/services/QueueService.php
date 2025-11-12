<?php

namespace szenario\craftaltpilot\services;

use Craft;
use yii\base\Component;
use craft\elements\Asset;

/**
 * Queue Service service
 */
class QueueService extends Component
{
    public function safelyCreateJob(Asset $asset, bool $force = false): void
    {
        // check if a job for this asset is already in the queue
        $jobs = Craft::$app->getQueue()->getJobInfo();
        foreach ($jobs as $job) {
            Craft::info('Job: ' . print_r($job, true), 'alt-pilot');

            // Extract asset ID from job description
            $description = $job['description'] ?? '';
            if (preg_match('/\[Asset ID: (\d+)\]/', $description, $matches)) {
                $jobAssetId = (int) $matches[1];
                if ($jobAssetId === $asset->id) {
                    Craft::info('Job for asset ID: ' . $asset->id . ' already in queue, skipping', 'alt-pilot');
                    return;
                }
            }
        }

        try {
            $job = new \szenario\craftaltpilot\jobs\AltTextGenerator([
                'asset' => $asset
            ]);
            Craft::$app->getQueue()->push($job);
        } catch (\Exception $e) {
            Craft::error('Error creating job for asset ID: ' . $asset->id . ' - ' . $e->getMessage(), 'alt-pilot');
        }
    }
}
