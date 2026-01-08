<?php

namespace szenario\craftaltpilot\console\controllers;

use craft\console\Controller;
use yii\console\ExitCode;
use yii\helpers\Console;

/**
 * Default controller
 */
class DefaultController extends Controller
{
    /**
     * List all possible commands
     */
    public function actionIndex(): int
    {
        $this->stdout("AltPilot Console Commands:\n", Console::BOLD);
        $this->stdout("- alt-pilot/asset <assetId> [--siteId=<id>]: Generates alt text for a specific asset.\n");
        $this->stdout("- alt-pilot/missing [--siteId=<id>]: Generates alt text for all assets that are missing it.\n");
        $this->stdout("- alt-pilot/all [--siteId=<id>]: Regenerates alt text for all assets (overwrites existing).\n");
        $this->stdout("- alt-pilot/stats: Displays generation statistics and queue status.\n");

        return ExitCode::OK;
    }
}
