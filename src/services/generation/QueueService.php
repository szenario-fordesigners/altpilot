<?php

namespace szenario\craftaltpilot\services\generation;

use Craft;
use craft\elements\Asset;
use craft\queue\Queue as CraftQueue;
use yii\base\Component;
use szenario\craftaltpilot\behaviors\AltPilotMetadata;
use yii\helpers\StringHelper;

/**
 * Manages alt text generation jobs in the Craft queue.
 *
 * Handles creating jobs (with deduplication), querying job status for the
 * frontend polling endpoint, and mapping Craft queue statuses to API responses.
 */
class QueueService extends Component
{
    /**
     * Create a queue job for the given asset, unless one is already pending/running.
     * Returns an array with 'status' (success|warning|error), 'message', and 'jobId'.
     *
     * For bulk loops, pass a `$pendingJobIndex` built once via buildPendingJobIndex().
     * The index is updated in place as new jobs are pushed, so callers reuse it across
     * the whole batch instead of re-querying the queue on every iteration.
     */
    public function safelyCreateJob(Asset $asset, ?array &$pendingJobIndex = null): array
    {
        $siteLanguageCode = $this->getSiteLanguageCode($asset->siteId);
        $displayFilename = $this->getDisplayFilename($asset);

        // check if an openai key is set
        $settings = \szenario\craftaltpilot\AltPilot::getInstance()->getSettings();
        if (empty($settings->openAiApiKey)) {
            return ['status' => "error", 'message' => 'AltPilot OpenAI API key is not set', 'jobId' => null];
        }

        if ($pendingJobIndex === null) {
            $pendingJobIndex = $this->buildPendingJobIndex();
        }

        $dedupKey = $this->buildAssetKey($asset->id, $asset->siteId);
        $existing = $pendingJobIndex[$dedupKey] ?? null;

        if ($existing !== null) {
            if ($this->isFailedJob($existing)) {
                // Allow retry of a previously-failed job by falling through to push.
                Craft::info(sprintf('Existing job for %s on site ID: %d is failed, allowing new job creation', $asset->filename ?? $asset->id, $asset->siteId), 'altpilot');
            } else {
                $message = sprintf('Job for %s (%s) already in queue, skipping', $displayFilename, $siteLanguageCode);
                Craft::info($message, 'altpilot');
                return [
                    'status' => "warning",
                    'message' => $message,
                    'jobId' => (string) ($existing['id'] ?? ''),
                ];
            }
        }

        try {
            $job = new \szenario\craftaltpilot\jobs\AltTextGeneratorJob([
                'assetId' => $asset->id,
                'siteId' => $asset->siteId,
                'filename' => $asset->filename ?? '',
            ]);
            $jobId = Craft::$app->getQueue()->push($job);

            // Reflect the newly-pushed job so the next iteration in a bulk loop dedupes against it.
            $pendingJobIndex[$dedupKey] = [
                'id' => $jobId,
                'status' => CraftQueue::STATUS_WAITING,
            ];

            return [
                'status' => "success",
                'message' => 'Job created for ' . $displayFilename . ' (' . $siteLanguageCode . ')',
                'jobId' => (string) $jobId,
            ];
        } catch (\Exception $e) {
            Craft::error(sprintf('Error creating job for asset ID: %d on site ID: %d - %s', $asset->id, $asset->siteId, $e->getMessage()), 'altpilot');
            return [
                'status' => "error",
                'message' => 'Error creating job for ' . $displayFilename . ' (' . $siteLanguageCode . ') - ' . $e->getMessage(),
                'jobId' => null,
            ];
        }
    }

    /**
     * Build a flat assetId:siteId → job map of currently-queued AltPilot jobs, used
     * by safelyCreateJob() for deduplication. Call once before a bulk loop to avoid
     * re-querying the entire queue table on every insert.
     *
     * When multiple jobs exist for the same (asset, site), the non-failed one wins
     * so a stale failure doesn't shadow a fresh retry.
     */
    public function buildPendingJobIndex(): array
    {
        $jobs = Craft::$app->getQueue()->getJobInfo();
        $index = [];

        foreach ($jobs as $job) {
            $description = (string) ($job['description'] ?? '');
            if (!preg_match('/\[Asset ID: (\d+)\s+\|\s+Site ID: (\d+)\]/', $description, $matches)) {
                continue;
            }

            $key = $this->buildAssetKey((int) $matches[1], (int) $matches[2]);
            $existing = $index[$key] ?? null;
            if ($existing === null || ($this->isFailedJob($existing) && !$this->isFailedJob($job))) {
                $index[$key] = $job;
            }
        }

        return $index;
    }

    private function isFailedJob(array $job): bool
    {
        $status = $job['status'] ?? null;
        return is_numeric($status) && (int) $status === CraftQueue::STATUS_FAILED;
    }

    /** Count AltPilot jobs that haven't finished yet (used by the dashboard widget). */
    public function getPendingAltPilotJobCount(): int
    {
        $jobs = Craft::$app->getQueue()->getJobInfo();
        $jobs = array_filter($jobs, fn($job) => $job['status'] !== CraftQueue::STATUS_DONE);
        $jobs = array_filter($jobs, fn($job) => str_contains($job['description'] ?? '', 'AltPilot'));
        return count($jobs);
    }

    /**
     * Count AltPilot jobs in the queue grouped by mapped status (waiting/running/failed/finished/unknown).
     * Statuses with zero jobs are omitted from the result.
     */
    public function getAltPilotJobStatusCounts(): array
    {
        $jobs = Craft::$app->getQueue()->getJobInfo();
        $counts = [];

        foreach ($jobs as $job) {
            if (!str_contains($job['description'] ?? '', 'AltPilot')) {
                continue;
            }
            $status = $this->mapJobStatus($job['status'] ?? null);
            $counts[$status] = ($counts[$status] ?? 0) + 1;
        }

        return $counts;
    }

    /**
     * Given a list of asset+site pairs, return each one's queue job status.
     * Used by the frontend to poll for completion after triggering generation.
     * If no job is found, checks whether the asset exists and returns 'finished' or 'missing'.
     *
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
                $status = $this->mapJobStatus($job['status'] ?? null);

                // For failed jobs, prioritize the error field which contains the actual error message
                // For other statuses, use progressLabel or description
                if ($status === 'failed') {
                    $message = $job['error'] ?? $job['progressLabel'] ?? $job['description'] ?? null;
                } else {
                    $message = $job['progressLabel'] ?? $job['description'] ?? null;
                }

                // Extract error information for failed jobs
                $errorInfo = null;
                if ($status === 'failed') {
                    $errorInfo = $this->extractErrorInfo($job, $message);
                    // Use the extracted error message if available
                    if ($errorInfo !== null && isset($errorInfo['message'])) {
                        $message = $errorInfo['message'];
                    }
                }

                $result = [
                    'assetId' => $assetId,
                    'siteId' => $siteId,
                    'jobId' => (string) ($job['id'] ?? ''),
                    'status' => $status,
                    'message' => $message,
                    'progress' => $job['progress'] ?? null,
                ];

                // Add error information if available
                if ($errorInfo !== null) {
                    $result['error'] = $errorInfo;
                }

                if ($status === 'finished') {
                    $asset = Craft::$app->assets->getAssetById($assetId, $siteId);
                    if ($asset) {
                        $result['asset'] = AltPilotMetadata::formatAssetForApi($asset);
                    }
                }

                $results[] = $result;
                continue;
            }

            $asset = Craft::$app->assets->getAssetById($assetId, $siteId);
            $results[] = [
                'assetId' => $assetId,
                'siteId' => $siteId,
                'status' => $asset ? 'finished' : 'missing',
                'asset' => $asset ? AltPilotMetadata::formatAssetForApi($asset) : null,
                'message' => $asset ? 'Alt text updated' : 'Asset could not be found',
            ];
        }

        return $results;
    }

    /**
     * Build a lookup index of all queue jobs keyed by "assetId:siteId".
     * Parses the asset/site IDs from the job description string (set by AltTextGeneratorJob).
     * Also stores a fallback key without siteId for loose matching.
     */
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

    /** Look up a job by exact assetId+siteId, falling back to assetId-only match. */
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

    /** Convert Craft's numeric queue status constants to human-readable strings for the API. */
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

    /** Get the base language code (e.g. "en", "de") for a site, used in log/status messages. */
    private function getSiteLanguageCode(?int $siteId): string
    {
        if ($siteId === null) {
            return 'unknown';
        }

        $site = Craft::$app->sites->getSiteById($siteId);
        if ($site === null || empty($site->language)) {
            return 'unknown';
        }

        $language = (string) $site->language;
        $baseLanguage = preg_split('/[-_]/', $language)[0] ?? $language;

        return strtolower($baseLanguage);
    }

    /** Truncate the filename for use in queue descriptions and user-facing messages. */
    private function getDisplayFilename(Asset $asset): string
    {
        $filename = trim((string) ($asset->filename ?? ''));
        if ($filename === '') {
            $filename = 'asset #' . (string) $asset->id;
        }

        return StringHelper::truncate($filename, 45, '...');
    }

    /**
     * Extract error information from a failed job, including OpenAI-specific error codes
     *
     * @param array $job The job information array
     * @param string|null $message The error message
     * @return array|null Error information with code, type, and user-friendly message
     */
    private function extractErrorInfo(array $job, ?string $message): ?array
    {
        if ($message === null) {
            return null;
        }

        // Try to extract OpenAI error code from message
        // Format: "message [OPENAI_ERROR_CODE:error_code]"
        if (preg_match('/\[OPENAI_ERROR_CODE:([^\]]+)\]/', $message, $matches)) {
            $errorCode = $matches[1];
            // Remove the error code marker from the message
            $cleanMessage = preg_replace('/\s*\[OPENAI_ERROR_CODE:[^\]]+\]\s*/', '', $message);

            return [
                'code' => $errorCode,
                'type' => 'openai_error',
                'message' => $cleanMessage,
            ];
        }

        // Return generic error info if no specific pattern matches
        return [
            'code' => 'unknown',
            'type' => 'generic_error',
            'message' => $message,
        ];
    }
}
