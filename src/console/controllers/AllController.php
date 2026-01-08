<?php

namespace szenario\craftaltpilot\console\controllers;

use yii\console\ExitCode;

/**
 * All controller
 */
class AllController extends BaseAssetController
{
    /**
     * Generate alt text for all assets, even those with existing alt text
     */
    public function actionIndex(): int
    {
        if (!$this->confirm('This will overwrite existing alt texts for ALL assets in the configured volumes. Are you sure you want to continue?', false)) {
            $this->stdout("Operation cancelled.\n");
            return ExitCode::OK;
        }

        $this->processAssets(false);
        return ExitCode::OK;
    }
}
