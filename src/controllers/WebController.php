<?php

namespace szenario\craftaltpilot\controllers;

use Craft;
use craft\web\Controller;
use yii\web\Response;
use szenario\craftaltpilot\AltPilot;
use Throwable;

/**
 * Alt Pilot Web controller
 */
class WebController extends Controller
{
    public $defaultAction = 'queue';
    protected array|int|bool $allowAnonymous = self::ALLOW_ANONYMOUS_NEVER;

    /**
     * alt-pilot/alt-pilot-web action
     */
    public function actionQueue(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $assetId = $this->request->getRequiredBodyParam('assetID');

        // validate and convert the assetId to an integer
        $assetId = filter_var($assetId, FILTER_VALIDATE_INT);
        if ($assetId === false) {
            return $this->asJson([
                'error' => 'Asset ID must be a valid integer',
            ]);
        }

        $asset = Craft::$app->assets->getAssetById($assetId);
        if (!$asset) {
            return $this->asJson([
                'error' => 'Asset not found',
            ]);
        }

        Craft::info('Queuing alt text generation for asset ID: ' . $assetId, "alt-pilot");


        AltPilot::getInstance()->queueService->safelyCreateJob($asset);

        Craft::info('Alt text generation queued for asset ID: ' . $assetId, "alt-pilot");

        return $this->asJson([
            'success' => true,
            'assetId' => $assetId,
            'message' => 'Alt text generation has been queued',
        ]);
    }
}
