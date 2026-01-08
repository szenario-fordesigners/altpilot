<?php

namespace szenario\craftaltpilot\console\controllers;

use yii\console\ExitCode;

/**
 * Missing controller
 */
class MissingController extends BaseAssetController
{
    /**
     * Generate alt text for all assets without alt text
     */
    public function actionIndex(): int
    {
        $this->processAssets(true);
        return ExitCode::OK;
    }
}
