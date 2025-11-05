<?php

namespace szenario\craftaltpilot\controllers;

use Craft;
use craft\web\Controller;
use yii\web\Response;

/**
 * Alt Pilot Controller controller
 */
class AltPilotControllerController extends Controller
{
    public $defaultAction = 'index';
    protected array|int|bool $allowAnonymous = self::ALLOW_ANONYMOUS_NEVER;

    /**
     * alt-pilot/alt-pilot-controller action
     */
    public function actionIndex(): Response
    {
        // ...
    }
}
