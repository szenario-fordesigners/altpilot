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

        $assetIdParam = $this->request->getRequiredBodyParam('assetID');

        // validate and convert the assetId to an integer
        $assetId = filter_var($assetIdParam, FILTER_VALIDATE_INT);
        if ($assetId === false) {
            return $this->asJson([
                'error' => 'Asset ID must be a valid integer',
            ]);
        }

        $siteResolution = $this->resolveSiteId();
        if ($siteResolution['error'] !== null) {
            return $this->asJson([
                'error' => $siteResolution['error'],
            ]);
        }
        $siteId = $siteResolution['siteId'];

        $asset = Craft::$app->assets->getAssetById($assetId, $siteId);
        if (!$asset) {
            return $this->asJson([
                'error' => 'Asset not found for the requested site',
            ]);
        }

        Craft::info(sprintf('Queuing alt text generation for asset ID: %d on site ID: %d', $assetId, $siteId), "alt-pilot");


        $result = AltPilot::getInstance()->queueService->safelyCreateJob($asset);

        Craft::info(sprintf('Alt text generation queued for asset ID: %d on site ID: %d', $assetId, $siteId), "alt-pilot");

        return $this->asJson([
            'status' => $result['status'],
            'message' => $result['message'],
        ]);
    }

    private function resolveSiteId(): array
    {
        $siteIdParam = $this->request->getBodyParam('siteId');

        if ($siteIdParam !== null) {
            $siteId = filter_var($siteIdParam, FILTER_VALIDATE_INT);
            if ($siteId === false) {
                return [
                    'siteId' => null,
                    'error' => 'Site ID must be a valid integer',
                ];
            }

            if (Craft::$app->getSites()->getSiteById($siteId) === null) {
                return [
                    'siteId' => null,
                    'error' => 'Site not found',
                ];
            }

            return [
                'siteId' => $siteId,
                'error' => null,
            ];
        }

        $currentSite = Craft::$app->getSites()->getCurrentSite();
        if ($currentSite !== null) {
            return [
                'siteId' => (int) $currentSite->id,
                'error' => null,
            ];
        }

        $primarySite = Craft::$app->getSites()->getPrimarySite();
        if ($primarySite !== null) {
            return [
                'siteId' => (int) $primarySite->id,
                'error' => null,
            ];
        }

        return [
            'siteId' => null,
            'error' => 'Unable to determine site context for the request',
        ];
    }

    public function actionSetAltTextChecked(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $assetIdParam = $this->request->getRequiredBodyParam('assetID');
        $altTextCheckedParam = $this->request->getRequiredBodyParam('altTextChecked');

        $assetId = filter_var($assetIdParam, FILTER_VALIDATE_INT);
        if ($assetId === false) {
            return $this->asJson([
                'status' => 'error',
                'message' => 'Asset ID must be a valid integer',
            ]);
        }

        $altTextChecked = filter_var($altTextCheckedParam, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        if ($altTextChecked == null) {
            return $this->asJson([
                'status' => 'error',
                'message' => 'Alt text checked status must be a valid boolean',
            ]);
        }

        $asset = Craft::$app->assets->getAssetById($assetId);
        if (!$asset) {
            return $this->asJson([
                'status' => 'error',
                'message' => 'Asset not found',
            ]);
        }

        $asset->getBehavior('altTextChecked')->setAltTextChecked($altTextChecked);
        if (!Craft::$app->elements->saveElement($asset)) {
            return $this->asJson([
                'error' => 'Failed to save asset',
            ]);
        }

        return $this->asJson([
            'status' => 'success',
            'message' => 'Alt text checked status set for ' . $asset->filename ?? $asset->id,
        ]);
    }
}
