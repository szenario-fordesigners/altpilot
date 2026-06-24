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
        $databaseService = AltPilot::getInstance()->databaseService;
        $queueService = AltPilot::getInstance()->queueService;

        $counts = $databaseService->getStatusCounts();
        $jobCounts = $queueService->getAltPilotJobStatusCounts();

        $this->stdout("AltPilot Statistics:\n", Console::BOLD);
        $this->stdout("Total Alt Texts: " . $counts['total'] . "\n");
        foreach ($counts['counts'] as $status => $count) {
            $label = match ($status) {
                AltPilotMetadata::STATUS_AI_GENERATED => 'AI Generated',
                AltPilotMetadata::STATUS_MANUAL => 'Manual',
                AltPilotMetadata::STATUS_MISSING => 'Missing',
                default => 'Unknown',
            };
            $this->stdout("  - $label: $count\n");
        }

        $pendingTotal = ($jobCounts['waiting'] ?? 0) + ($jobCounts['running'] ?? 0) + ($jobCounts['failed'] ?? 0);
        $this->stdout("\nJobs in Queue: $pendingTotal\n", Console::FG_CYAN);
        foreach (['waiting', 'running', 'failed'] as $status) {
            if (($jobCounts[$status] ?? 0) > 0) {
                $this->stdout("  - " . ucfirst($status) . ": {$jobCounts[$status]}\n");
            }
        }

        return ExitCode::OK;
    }
}
