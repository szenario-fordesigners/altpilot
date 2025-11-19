<?php

namespace szenario\craftaltpilot\services;

use Craft;
use yii\base\Component;

/**
 * Alt Text Generator service
 */
class AltTextGenerator extends Component
{
    /**
     * Generate alt text for an asset (synchronous)
     *
     * @param \craft\elements\Asset $asset The asset to generate alt text for
     * @return string The generated alt text
     */
    public function generateAltText(\craft\elements\Asset $asset): string
    {
        $plugin = \szenario\craftaltpilot\AltPilot::getInstance();
        $openAiService = $plugin->openAiService;
        $urlReachabilityChecker = $plugin->urlReachabilityChecker;
        $imageUtilityService = $plugin->imageUtilityService;

        // Try to get public URL first (cheaper, faster)
        // Transform logic is handled internally by getAssetPublicUrl()
        $publicUrl = $imageUtilityService->getAssetPublicUrl($asset);

        if ($publicUrl !== null) {
            // Check if the URL is actually reachable from the internet
            if ($urlReachabilityChecker->isReachable($publicUrl)) {
                return $openAiService->generateAltText($publicUrl);
            }

            Craft::info('Public URL exists but is not reachable, falling back to base64 encoding for asset: ' . $asset->id, "alt-pilot");
        } else {
            Craft::info('No public URL available, falling back to base64 encoding for asset: ' . $asset->id, "alt-pilot");
        }

        // Fall back to base64 encoding if no public URL available or not reachable
        // Transform logic is handled internally by assetToBase64()
        $base64Image = $imageUtilityService->assetToBase64($asset);
        return $openAiService->generateAltText($base64Image);
    }
}
