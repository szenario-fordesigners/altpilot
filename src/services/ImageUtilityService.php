<?php

namespace szenario\craftaltpilot\services;

use Craft;
use yii\base\Component;

/**
 * Image Utility Service service
 */
class ImageUtilityService extends Component
{
    /**
     * Check if a GIF file is animated
     *
     * @param string $filePath Path to the GIF file
     * @return bool True if animated, false otherwise
     */
    public function isAnimatedGif(string $filePath): bool
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

        // Get combined transform (size + format if needed) - function determines internally
        $transform = $this->getCombinedTransform($asset);

        // Try to get the URL
        $url = $asset->getUrl($transform, true);
        return $url;
    }

    /**
     * Get an image transform that fits the image to max 1500px on the longer side
     *
     * @param \craft\elements\Asset $asset The Craft Asset element
     * @return \craft\models\ImageTransform|null The transform or null if not needed
     */
    public function getSizeTransform(\craft\elements\Asset $asset): ?\craft\models\ImageTransform
    {
        $width = $asset->getWidth();
        $height = $asset->getHeight();

        // If dimensions are not available, return null
        if ($width === null || $height === null) {
            Craft::debug('Size transform skipped for asset ' . $asset->id . ': dimensions not available', 'alt-pilot');
            return null;
        }

        $maxSize = 1024;

        // Check if image exceeds max size on either side
        if ($width <= $maxSize && $height <= $maxSize) {
            Craft::debug('Size transform not needed for asset ' . $asset->id . ': dimensions (' . $width . 'x' . $height . ') are within limit', 'alt-pilot');
            return null;
        }

        // Calculate dimensions to fit max 1500px on the longer side
        if ($width > $height) {
            // Landscape: fit width to maxSize
            $transformWidth = $maxSize;
            $transformHeight = null;
            Craft::debug('Size transform needed for asset ' . $asset->id . ': landscape image (' . $width . 'x' . $height . ') will be resized to width ' . $maxSize, 'alt-pilot');
        } else {
            // Portrait or square: fit height to maxSize
            $transformWidth = null;
            $transformHeight = $maxSize;
            Craft::debug('Size transform needed for asset ' . $asset->id . ': portrait/square image (' . $width . 'x' . $height . ') will be resized to height ' . $maxSize, 'alt-pilot');
        }

        // Create a transform that fits the image without upscaling
        $transform = new \craft\models\ImageTransform([
            'width' => $transformWidth,
            'height' => $transformHeight,
            'mode' => 'fit',
            'upscale' => false,
        ]);

        return $transform;
    }

    public function getFormatTransform(\craft\elements\Asset $asset): ?\craft\models\ImageTransform
    {
        $mimeType = $asset->getMimeType();
        $extension = strtolower($asset->getExtension());

        // Supported MIME types by OpenAI
        $supportedMimeTypes = [
            'image/png',
            'image/jpeg',
            'image/webp',
            'image/gif',
        ];

        $needsTransform = false;

        // Check MIME type first
        if (!in_array($mimeType, $supportedMimeTypes)) {
            $needsTransform = true;
        }

        // Check if GIF is animated (animated GIFs are not supported)
        if ($mimeType === 'image/gif' || $extension === 'gif') {
            $path = $asset->getCopyOfFile();
            if ($path !== null && file_exists($path) && $this->isAnimatedGif($path)) {
                $needsTransform = true;
            }
        }

        // check for svg transforms
        if ($mimeType === 'image/svg+xml' && !Craft::$app->getConfig()->getGeneral()->transformSvgs) {
            throw new \Exception('SVGs are not supported by the OpenAI API and transformSvgs is disabled.');
        }

        if ($needsTransform) {
            return new \craft\models\ImageTransform([
                'format' => 'jpg',
                'mode' => 'fit',
                'upscale' => false,
            ]);
        }

        return null;
    }

    /**
     * Get a combined transform for size and format if needed
     *
     * @param \craft\elements\Asset $asset The Craft Asset element
     * @return \craft\models\ImageTransform|null The combined transform or null if not needed
     */
    public function getCombinedTransform(\craft\elements\Asset $asset): ?\craft\models\ImageTransform
    {
        $sizeTransform = $this->getSizeTransform($asset);
        $formatTransform = $this->getFormatTransform($asset);

        // If we need both transforms, combine them
        if ($sizeTransform !== null && $formatTransform !== null) {
            Craft::debug('Combined transform (size + format) will be applied to asset ' . $asset->id, 'alt-pilot');
            return new \craft\models\ImageTransform([
                'width' => $sizeTransform->width,
                'height' => $sizeTransform->height,
                'format' => $formatTransform->format,
                'mode' => 'fit',
                'upscale' => false,
            ]);
        }


        Craft::debug('Applying ' . $sizeTransform ? 'sizeTransform' : 'formatTransform' . ' to asset ' . $asset->id, 'alt-pilot');

        // Return whichever transform is needed
        return $sizeTransform ?? $formatTransform;
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
        // Get combined transform (size + format if needed) - function determines internally
        $transform = $this->getCombinedTransform($asset);

        // If we need to transform, get the transformed file via URL
        if ($transform !== null) {
            $transformUrl = $asset->getUrl($transform);

            if ($transformUrl !== null) {
                // Download the transformed image
                $imageData = @file_get_contents($transformUrl);
                if ($imageData !== false) {
                    // Determine MIME type based on transform
                    if (isset($transform->format) && $transform->format === 'jpg') {
                        $mimeType = 'image/jpeg';
                    } else {
                        // Use original MIME type if format wasn't changed
                        $mimeType = $asset->getMimeType();
                    }
                    $base64 = base64_encode($imageData);
                    return "data:{$mimeType};base64,{$base64}";
                }
            }
        }

        // If we didn't transform, get the original mime type using consistent method
        Craft::debug('Using original image for base64 encoding of asset ' . $asset->id . ' (no transform needed)', 'alt-pilot');
        return $asset->getDataUrl();
    }
}
