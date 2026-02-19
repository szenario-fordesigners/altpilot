<?php

namespace szenario\craftaltpilot\services\generation;

use Craft;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\services\assets\ImageUtilityService;
use szenario\craftaltpilot\services\infrastructure\UrlReachabilityChecker;
use yii\base\Component;

/**
 * Alt Text Generator service
 */
class AltTextGenerator extends Component
{
    private ?ImageUtilityService $imageUtilityService = null;
    private ?UrlReachabilityChecker $urlReachabilityChecker = null;

    /**
     * Generate alt text for an asset (synchronous)
     *
     * @param \craft\elements\Asset $asset The asset to generate alt text for
     * @return string The generated alt text
     */
    public function generateAltTextForAsset(\craft\elements\Asset $asset): string
    {
        $plugin = AltPilot::getInstance();
        $openAiService = $plugin->openAiService;
        $urlReachabilityChecker = $this->getUrlReachabilityChecker();
        $imageUtilityService = $this->getImageUtilityService();
        $sitesService = Craft::$app->getSites();

        /** @var \craft\models\Site|null $site */
        $site = null;
        if ($asset->siteId !== null) {
            $site = $sitesService->getSiteById((int) $asset->siteId);
        }

        if ($site === null) {
            $site = $sitesService->getPrimarySite();
        }

        // Try to get public URL first (cheaper, faster)
        // Transform logic is handled internally by getAssetPublicUrl()
        $publicUrl = $imageUtilityService->getAssetPublicUrl($asset);

        if ($publicUrl !== null) {
            // Check if the URL is actually reachable from the internet
            if ($urlReachabilityChecker->isReachable($publicUrl)) {
                return $openAiService->generateAltTextForImage($publicUrl, $asset, $site);
            }

            Craft::info('Public URL exists but is not reachable, falling back to base64 encoding for asset: ' . $asset->id, "altpilot");
        } else {
            Craft::info('No public URL available, falling back to base64 encoding for asset: ' . $asset->id, "altpilot");
        }

        // Fall back to base64 encoding if no public URL available or not reachable
        // Transform logic is handled internally by assetToBase64()
        $base64Image = $imageUtilityService->assetToBase64($asset);
        return $openAiService->generateAltTextForImage($base64Image, $asset, $site);
    }

    private function getImageUtilityService(): ImageUtilityService
    {
        if ($this->imageUtilityService === null) {
            $this->imageUtilityService = new ImageUtilityService();
        }

        return $this->imageUtilityService;
    }

    private function getUrlReachabilityChecker(): UrlReachabilityChecker
    {
        if ($this->urlReachabilityChecker === null) {
            $this->urlReachabilityChecker = new UrlReachabilityChecker();
        }

        return $this->urlReachabilityChecker;
    }
}
