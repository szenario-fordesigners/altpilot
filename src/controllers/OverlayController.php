<?php

namespace szenario\craftaltpilot\controllers;

use Craft;
use craft\helpers\UrlHelper;
use craft\web\Controller;
use szenario\craftaltpilot\AltPilot;
use yii\web\Response;

/**
 * Lightweight API for the client-side image overlay.
 *
 * Single endpoint: POST resolve-images
 * – Returns authenticated:false for anonymous visitors (the JS exits silently)
 * – Returns resolved asset data for all submitted image srcs
 */
class OverlayController extends Controller
{
    protected array|int|bool $allowAnonymous = ['resolve-images'];

    public function beforeAction($action): bool
    {
        // CSRF is disabled because the script may be served from a static
        // cache where no server-side token was injected. Auth is validated
        // inside the action via permission check.
        $this->enableCsrfValidation = false;

        if (!parent::beforeAction($action)) {
            return false;
        }

        $this->requireAcceptsJson();

        return true;
    }

    /**
     * POST /actions/altpilot/overlay/resolve-images
     *
     * Accepts: { "images": [ { "src": "...", "alt": "..." }, ... ] }
     * Returns: { "authenticated": true, "cpUrl": "...", "images": [ ... ] }
     * Or authenticated:false if the user is not logged in / lacks permission.
     */
    public function actionResolveImages(): Response
    {
        $this->requirePostRequest();

        $settings = AltPilot::getInstance()->getSettings();

        if (!$settings->showImageOverlay ||
            !Craft::$app->getUser()->checkPermission('accessPlugin-altpilot')
        ) {
            return $this->asJson(['authenticated' => false]);
        }

        $images = $this->request->getBodyParam('images', []);
        if (!is_array($images)) {
            $images = [];
        }

        $resolved = AltPilot::getInstance()
            ->imageReverseLookupService
            ->resolveImages($images);

        return $this->asJson([
            'authenticated' => true,
            'cpUrl' => UrlHelper::cpUrl('altpilot'),
            'btnPosition' => $settings->pageReviewButtonPosition ?? 'top-right',
            'images' => $resolved,
        ]);
    }
}
