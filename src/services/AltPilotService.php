<?php

namespace szenario\craftaltpilot\services;

use Craft;
use yii\base\Component;

/**
 * Alt Pilot Service service
 */
class AltPilotService extends Component
{
    public function generateAltText(\craft\elements\Asset $asset, ?string $prompt = null, array $additionalOptions = []): string
    {
        $plugin = \szenario\craftaltpilot\AltPilot::getInstance();
        $openAiService = $plugin->openAiService;
        return $openAiService->generateAltText($this->getAssetUrl($asset), $prompt, $additionalOptions);
    }

    /**
     * Get the public URL for a Craft Asset
     *
     * @param \craft\elements\Asset $asset The Craft Asset element
     * @return string The public URL of the asset
     * @throws \Exception
     */
    public function getAssetUrl(\craft\elements\Asset $asset): string
    {
        $url = $asset->getUrl();

        if ($url === null) {
            throw new \Exception('Asset does not have a public URL. Make sure the asset is accessible.');
        }

        // Ensure we have a full URL (add base URL if needed)
        if (strpos($url, 'http') !== 0) {
            $baseUrl = Craft::getAlias('@web');
            $url = rtrim($baseUrl, '/') . '/' . ltrim($url, '/');
        }

        return $url;
    }
}
