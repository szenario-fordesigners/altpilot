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
        $this->stdout("\nAltPilot Console Commands\n", Console::BOLD);
        $this->stdout("-------------------------\n\n", Console::FG_CYAN);

        $this->stdout("altpilot/all [--siteId=<id>] [--exclude-manual]\n", Console::FG_CYAN);
        $this->stdout("  Regenerate alt text for all assets (overwrites existing); optionally skip manually set alt text.\n\n");

        $this->stdout("altpilot/missing [--siteId=<id>]\n", Console::FG_CYAN);
        $this->stdout("  Generate alt text only for assets that are currently missing it.\n\n");

        $this->stdout("altpilot/asset <assetId> [--siteId=<id>]\n", Console::FG_CYAN);
        $this->stdout("  Generate alt text for one specific asset.\n\n");

        $this->stdout("altpilot/stats\n", Console::FG_CYAN);
        $this->stdout("  Display generation status counts and queue overview.\n");

        return ExitCode::OK;
    }
}
