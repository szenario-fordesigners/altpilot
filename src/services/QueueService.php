<?php

namespace szenario\craftaltpilot\services;

use Craft;
use craft\elements\Asset;
use craft\queue\Queue as CraftQueue;
use yii\base\Component;

/**
 * Queue Service service
 */
class QueueService extends Component
{
    public function safelyCreateJob(Asset $asset): array
    {
        // check if an openai key is set
        $settings = \szenario\craftaltpilot\AltPilot::getInstance()->getSettings();
        if (empty($settings->openAiApiKey)) {
            return ['status' => "error", 'message' => 'AltPilot OpenAI API key is not set', 'jobId' => null];
        }


        // check if a job for this asset is already in the queue
        $jobs = Craft::$app->getQueue()->getJobInfo();
        foreach ($jobs as $job) {
            Craft::info('Job: ' . print_r($job, true), 'alt-pilot');

            // Extract asset ID and site ID from job description (Site ID might be missing)
            $description = $job['description'] ?? '';
            if (preg_match('/\[Asset ID: (\d+)(?:\s+\|\s+Site ID: (\d+))?\]/', $description, $matches)) {
                $jobAssetId = (int) $matches[1];
                $jobSiteId = isset($matches[2]) ? (int) $matches[2] : $asset->siteId;

                if ($jobAssetId === $asset->id && $jobSiteId === $asset->siteId) {
                    $message = sprintf('Job for %s on site ID: %d already in queue, skipping', $asset->filename ?? $asset->id, $asset->siteId);
                    Craft::info($message, 'alt-pilot');
                    return [
                        'status' => "warning",
                        'message' => $message,
                        'jobId' => (string) ($job['id'] ?? ''),
                    ];
                }
                continue;
            }
        }

        try {
            $job = new \szenario\craftaltpilot\jobs\AltTextGenerator([
                'asset' => $asset,
            ]);
            $jobId = Craft::$app->getQueue()->push($job);
            return [
                'status' => "success",
                'message' => 'Job created for asset ID: ' . $asset->id . ' on site ID: ' . $asset->siteId,
                'jobId' => (string) $jobId,
            ];
        } catch (\Exception $e) {
            Craft::error(sprintf('Error creating job for asset ID: %d on site ID: %d - %s', $asset->id, $asset->siteId, $e->getMessage()), 'alt-pilot');
            return [
                'status' => "error",
                'message' => 'Error creating job for asset ID: ' . $asset->id . ' on site ID: ' . $asset->siteId . ' - ' . $e->getMessage(),
                'jobId' => null,
            ];
        }
    }

    /**
     * @param array<int, array{assetId:int, siteId: int|null}> $assetsToCheck
     */
    public function getJobStatuses(array $assetsToCheck): array
    {
        $indexedJobs = $this->indexJobsByAsset();
        $results = [];

        foreach ($assetsToCheck as $assetMeta) {
            $assetId = (int) $assetMeta['assetId'];
            $siteId = $assetMeta['siteId'] ?? null;

            $job = $this->findJobForAsset($indexedJobs, $assetId, $siteId);
            if ($job !== null) {
                $results[] = [
                    'assetId' => $assetId,
                    'siteId' => $siteId,
                    'jobId' => (string) ($job['id'] ?? ''),
                    'status' => $this->mapJobStatus($job['status'] ?? null),
                    'message' => $job['progressLabel'] ?? $job['description'] ?? null,
                    'progress' => $job['progress'] ?? null,
                ];
                continue;
            }

            $asset = Craft::$app->assets->getAssetById($assetId, $siteId);
            $results[] = [
                'assetId' => $assetId,
                'siteId' => $siteId,
                'status' => $asset ? 'finished' : 'missing',
                'asset' => $asset ? $asset->toArray([], [], true) : null,
                'message' => $asset ? 'Alt text updated' : 'Asset could not be found',
            ];
        }

        return $results;
    }

    private function indexJobsByAsset(): array
    {
        $jobs = Craft::$app->getQueue()->getJobInfo();
        $indexed = [];

        foreach ($jobs as $job) {
            $description = (string) ($job['description'] ?? '');
            if (preg_match('/\[Asset ID: (\d+)(?:\s+\|\s+Site ID: (\d+))?\]/', $description, $matches)) {
                $assetId = (int) $matches[1];
                $siteId = isset($matches[2]) ? (int) $matches[2] : null;

                $exactKey = $this->buildAssetKey($assetId, $siteId);
                $indexed[$exactKey] = $job;

                $fallbackKey = $this->buildAssetKey($assetId, null);
                if (!isset($indexed[$fallbackKey])) {
                    $indexed[$fallbackKey] = $job;
                }
            }
        }

        return $indexed;
    }

    private function findJobForAsset(array $jobsIndex, int $assetId, ?int $siteId): ?array
    {
        $exactKey = $this->buildAssetKey($assetId, $siteId);
        if (isset($jobsIndex[$exactKey])) {
            return $jobsIndex[$exactKey];
        }

        $fallbackKey = $this->buildAssetKey($assetId, null);
        return $jobsIndex[$fallbackKey] ?? null;
    }

    private function buildAssetKey(int $assetId, ?int $siteId): string
    {
        return $assetId . ':' . ($siteId ?? 'default');
    }

    private function mapJobStatus(mixed $status): string
    {
        $statusInt = is_numeric($status) ? (int) $status : null;

        return match ($statusInt) {
            CraftQueue::STATUS_WAITING => 'waiting',
            CraftQueue::STATUS_RESERVED => 'running',
            CraftQueue::STATUS_DONE => 'finished',
            CraftQueue::STATUS_FAILED => 'failed',
            default => 'unknown',
        };
    }
}
