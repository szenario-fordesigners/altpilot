<?php

namespace szenario\craftaltpilot\console\controllers;

use Craft;
use craft\console\Controller;
use yii\console\ExitCode;

/**
 * Generate controller
 */
class GenerateController extends Controller
{

    public function options($actionID): array
    {
        $options = parent::options($actionID);
        switch ($actionID) {
            case 'index':
                // $options[] = '...';
                break;
        }
        return $options;
    }

    /**
     * alt-pilot/alt-pilot-console command
     */
    public function actionIndex(): int
    {
        $this->success("TODO: list all possible commands here");
        return ExitCode::OK;
    }

    // TODO:
    // single asset by id
    // all assets without alt text
    // all assets, even those with alt text
    // statistics for all assets
    // don't forget multi site support
}
