<?php

namespace szenario\craftaltpilot\controllers;

use Craft;
use craft\web\Controller;
use yii\web\Response;

/**
 * Alt Pilot Web controller
 */
class AltPilotWebController extends Controller
{
    public $defaultAction = 'index';
    protected array|int|bool $allowAnonymous = self::ALLOW_ANONYMOUS_NEVER;

    /**
     * alt-pilot/alt-pilot-web action
     */
    public function actionIndex(): Response
    {
        // get the asset id from the request query parameter assetID
        $assetId = Craft::$app->request->getQueryParam('assetID');
        if (!$assetId) {
            return $this->asJson([
                'error' => 'Asset ID is required',
            ]);
        }

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

        Craft::info('Starting alt text generation for asset ID: ' . $assetId, "alt-pilot");

        $altPilot = \szenario\craftaltpilot\AltPilot::getInstance();
        $altText = $altPilot->altPilotService->generateAltText($asset);

        Craft::info('Alt text generated for asset ID: ' . $assetId, "alt-pilot");
        Craft::info('Alt text: ' . $altText, "alt-pilot");

        return $this->asJson([
            'success' => true,
            'assetId' => $assetId,
            'altText' => $altText,
        ]);
    }
}
