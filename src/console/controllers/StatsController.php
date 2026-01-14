<?php

namespace szenario\craftaltpilot\console\controllers;

use craft\console\Controller;
use craft\helpers\Console;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\behaviors\AltPilotMetadata;
use yii\console\ExitCode;

/**
 * Stats controller
 */
class StatsController extends Controller
{
    /**
     * Show statistics for all assets
     */
    public function actionIndex(): int
    {
        $statusService = AltPilot::getInstance()->statusService;
        $queueService = AltPilot::getInstance()->queueService;

        $counts = $statusService->getStatusCounts();
        $pendingJobs = $queueService->getPendingAltPilotJobCount();

        $this->stdout("AltPilot Statistics:\n", Console::BOLD);
        $this->stdout("Total Assets in Metadata: " . $counts['total'] . "\n");
        foreach ($counts['counts'] as $status => $count) {
            $label = match ($status) {
                AltPilotMetadata::STATUS_AI_GENERATED => 'AI Generated',
                AltPilotMetadata::STATUS_MANUAL => 'Manual',
                AltPilotMetadata::STATUS_MISSING => 'Missing',
                default => 'Unknown',
            };
            $this->stdout("  - $label: $count\n");
        }

        $this->stdout("\nPending Jobs: $pendingJobs\n", Console::FG_CYAN);

        return ExitCode::OK;
    }
}
