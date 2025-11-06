<?php

namespace szenario\craftaltpilot\services;

use Craft;
use yii\base\Component;

/**
 * Alt Pilot Service service
 */
class AltPilotService extends Component
{
    /**
     * Queue alt text generation for an asset
     *
     * @param \craft\elements\Asset $asset The asset to generate alt text for
     * @param string|null $prompt Optional custom prompt
     * @param array $additionalOptions Additional options for OpenAI
     * @return void
     */
    public function queueAltTextGeneration(\craft\elements\Asset $asset, ?string $prompt = null, array $additionalOptions = []): void
    {
        $job = new \szenario\craftaltpilot\jobs\AltTextGenerator();
        $job->asset = $asset;
        $job->prompt = $prompt;
        $job->additionalOptions = $additionalOptions;

        Craft::$app->getQueue()->push($job);

        Craft::info('Queued alt text generation for asset: ' . $asset->id, 'alt-pilot');
    }

    /**
     * Generate alt text for an asset (synchronous)
     *
     * @param \craft\elements\Asset $asset The asset to generate alt text for
     * @param string|null $prompt Optional custom prompt
     * @param array $additionalOptions Additional options for OpenAI
     * @return string The generated alt text
     */
    public function generateAltText(\craft\elements\Asset $asset, ?string $prompt = null, array $additionalOptions = []): string
    {
        // Validate asset meets OpenAI requirements
        $this->validateAssetForOpenAI($asset);

        $plugin = \szenario\craftaltpilot\AltPilot::getInstance();
        $openAiService = $plugin->openAiService;
        $urlReachabilityChecker = $plugin->urlReachabilityChecker;

        // Try to get public URL first (cheaper, faster)
        $publicUrl = $this->getAssetPublicUrl($asset);

        if ($publicUrl !== null) {
            // Check if the URL is actually reachable from the internet
            if ($urlReachabilityChecker->isReachable($publicUrl)) {
                Craft::info('Using public URL for asset: ' . $asset->id, "alt-pilot");
                return $openAiService->generateAltText($publicUrl, $prompt, $additionalOptions);
            }

            Craft::info('Public URL exists but is not reachable, falling back to base64 encoding for asset: ' . $asset->id, "alt-pilot");
        } else {
            Craft::info('No public URL available, falling back to base64 encoding for asset: ' . $asset->id, "alt-pilot");
        }

        // Fall back to base64 encoding if no public URL available or not reachable
        $base64Image = $this->assetToBase64($asset);
        return $openAiService->generateAltText($base64Image, $prompt, $additionalOptions);
    }

    /**
     * Validate that an asset meets OpenAI API requirements
     *
     * @param \craft\elements\Asset $asset The Craft Asset element
     * @throws \Exception If asset doesn't meet requirements
     */
    public function validateAssetForOpenAI(\craft\elements\Asset $asset): void
    {
        $path = $asset->getCopyOfFile();

        if ($path === null || !file_exists($path)) {
            throw new \Exception('Asset file not found or not accessible.');
        }

        // Check file size (50 MB limit)
        $fileSize = filesize($path);
        $maxSize = 50 * 1024 * 1024; // 50 MB in bytes
        if ($fileSize > $maxSize) {
            throw new \Exception('Image file size exceeds OpenAI limit of 50 MB. Current size: ' . round($fileSize / 1024 / 1024, 2) . ' MB');
        }

        // Check supported file types
        $extension = strtolower($asset->getExtension());
        $supportedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

        if (!in_array($extension, $supportedExtensions)) {
            throw new \Exception('Image file type not supported by OpenAI. Supported types: PNG, JPEG, WEBP, and non-animated GIF. Current type: ' . strtoupper($extension));
        }

        // Check if GIF is animated
        if ($extension === 'gif') {
            if ($this->isAnimatedGif($path)) {
                throw new \Exception('Animated GIFs are not supported by OpenAI. Please use a non-animated GIF.');
            }
        }
    }

    /**
     * Check if a GIF file is animated
     *
     * @param string $filePath Path to the GIF file
     * @return bool True if animated, false otherwise
     */
    private function isAnimatedGif(string $filePath): bool
    {
        $fileContents = file_get_contents($filePath);
        if ($fileContents === false) {
            return false;
        }

        // Animated GIFs contain multiple image descriptors
        // Look for the image separator (0x2C) which appears before each frame
        // A single-frame GIF will have only one image separator after the header
        $imageSeparator = "\x2C";
        $count = substr_count($fileContents, $imageSeparator);

        // If there's more than one image separator, it's likely animated
        // But we need to account for the first one which is always present
        return $count > 1;
    }

    /**
     * Get the public URL for a Craft Asset if available
     *
     * @param \craft\elements\Asset $asset The Craft Asset element
     * @return string|null The public URL if available, null otherwise
     */
    public function getAssetPublicUrl(\craft\elements\Asset $asset): ?string
    {
        // Check if the volume/filesystem has URLs enabled
        $volume = $asset->getVolume();
        if ($volume === null) {
            return null;
        }

        // Check filesystem hasUrls
        $fs = $volume->getFs();
        if ($fs === null || !$fs->hasUrls) {
            return null;
        }

        // Try to get the URL
        $url = $asset->getUrl();
        if ($url === null) {
            return null;
        }

        // Ensure we have a full URL (add base URL if needed)
        if (strpos($url, 'http') !== 0) {
            $baseUrl = Craft::getAlias('@web');
            if ($baseUrl === false) {
                return null;
            }
            $url = rtrim($baseUrl, '/') . '/' . ltrim($url, '/');
        }

        // Verify it's a valid URL format
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return null;
        }

        return $url;
    }

    /**
     * Convert a Craft Asset to base64 data URL
     *
     * @param \craft\elements\Asset $asset The Craft Asset element
     * @return string Base64 data URL
     * @throws \Exception
     */
    public function assetToBase64(\craft\elements\Asset $asset): string
    {
        $path = $asset->getCopyOfFile();

        if ($path === null || !file_exists($path)) {
            throw new \Exception('Asset file not found or not accessible.');
        }

        $mimeType = $asset->getMimeType();
        if ($mimeType === null) {
            // Try to detect from file extension
            $extension = $asset->getExtension();
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
                'svg' => 'image/svg+xml',
            ];
            $mimeType = $mimeTypes[strtolower($extension)] ?? 'image/jpeg';
        }

        $imageData = file_get_contents($path);
        if ($imageData === false) {
            throw new \Exception('Could not read asset file.');
        }

        $base64 = base64_encode($imageData);
        return "data:{$mimeType};base64,{$base64}";
    }
}
