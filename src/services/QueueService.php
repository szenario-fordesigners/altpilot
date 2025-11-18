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
    public function safelyCreateJob(Asset $asset): array
    {
        // check if a job for this asset is already in the queue
        $jobs = Craft::$app->getQueue()->getJobInfo();
        foreach ($jobs as $job) {
            Craft::info('Job: ' . print_r($job, true), 'alt-pilot');

            // Extract asset ID and site ID from job description
            $description = $job['description'] ?? '';
            if (preg_match('/\[Asset ID: (\d+)\s+\|\s+Site ID: (\d+)\]/', $description, $matches)) {
                $jobAssetId = (int) $matches[1];
                $jobSiteId = (int) $matches[2];

                if ($jobAssetId === $asset->id && $jobSiteId === $asset->siteId) {
                    $message = sprintf('Job for %s on site ID: %d already in queue, skipping', $asset->filename ?? $asset->id, $asset->siteId);
                    Craft::info($message, 'alt-pilot');
                    return ['status' => "warning", 'message' => $message];
                }
                continue;
            }
        }

        try {
            $job = new \szenario\craftaltpilot\jobs\AltTextGenerator([
                'asset' => $asset,
            ]);
            Craft::$app->getQueue()->push($job);
            return ['status' => "success", 'message' => 'Job created for asset ID: ' . $asset->id . ' on site ID: ' . $asset->siteId];
        } catch (\Exception $e) {
            Craft::error(sprintf('Error creating job for asset ID: %d on site ID: %d - %s', $asset->id, $asset->siteId, $e->getMessage()), 'alt-pilot');
            return ['status' => "error", 'message' => 'Error creating job for asset ID: ' . $asset->id . ' on site ID: ' . $asset->siteId . ' - ' . $e->getMessage()];
        }
    }
}
