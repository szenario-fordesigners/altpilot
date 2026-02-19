<?php

namespace szenario\craftaltpilot\console\controllers;

use yii\console\ExitCode;

/**
 * All controller
 */
class AllController extends BaseAssetController
{
    /**
     * @var bool Whether to exclude assets with manually set alt text.
     */
    public bool $excludeManual = false;

    public function options($actionID): array
    {
        $options = parent::options($actionID);
        $options[] = 'excludeManual';
        return $options;
    }

    /**
     * Generate alt text for all assets, even those with existing alt text
     */
    public function actionIndex(): int
    {
        $message = 'This will overwrite existing alt texts for ALL assets in the configured volumes.';
        if ($this->excludeManual) {
            $message .= ' Assets with manually set alt text will be skipped.';
        }
        $message .= ' Are you sure you want to continue?';

        if (!$this->confirm($message, false)) {
            $this->stdout("Operation cancelled.\n");
            return ExitCode::OK;
        }

        $this->processAssets(false, $this->excludeManual);
        return ExitCode::OK;
    }
}
