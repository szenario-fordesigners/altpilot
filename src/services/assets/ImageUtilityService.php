<?php

namespace szenario\craftaltpilot\services\assets;

use Craft;
use craft\elements\Asset;
use craft\models\ImageTransform;
use yii\base\Component;

/**
 * Prepares Craft assets for the OpenAI Vision API.
 *
 * Responsibilities:
 * - Determine if an asset can be sent via public URL or needs base64 encoding
 * - Resize images that exceed OpenAI's recommended dimensions
 * - Convert unsupported formats (SVG, animated GIF, etc.) to JPG
 */
class ImageUtilityService extends Component
{
    private const OPENAI_SUPPORTED_MIME_TYPES = [
        'image/png',
        'image/jpeg',
        'image/webp',
        'image/gif',
    ];

    /** OpenAI's "low detail" mode tiles at 512px; 1024 is a safe ceiling for quality vs. cost */
    private const MAX_DIMENSION = 1024;

    /**
     * Get a publicly-accessible URL for the asset, with resize transform applied if needed.
     * Returns null if the filesystem has no URLs or the format needs conversion
     * (in which case the caller should use assetToBase64 instead).
     */
    public function getAssetPublicUrl(Asset $asset): ?string
    {
        $volume = $asset->getVolume();
        $fs = $volume?->getFs();
        if ($fs === null || !$fs->hasUrls) {
            return null;
        }

        // Format conversion needs base64 path — can't rely on URL for unsupported formats
        if ($this->needsFormatConversion($asset)) {
            return null;
        }

        return $asset->getUrl($this->buildTransform($asset), true);
    }

    /**
     * Convert an asset to a base64 data URI suitable for the OpenAI API.
     *
     * If a transform is needed (resize and/or format conversion), fetches the
     * transformed image via its internal URL and encodes it. If no transform
     * is needed, uses Craft's built-in getDataUrl().
     *
     * Throws if format conversion is required but the transform URL can't be fetched
     * (we can't safely fall back to the original bytes of an unsupported format).
     */
    public function assetToBase64(Asset $asset): string
    {
        $needsConversion = $this->needsFormatConversion($asset);
        $transform = $this->buildTransform($asset);

        if ($transform !== null) {
            $url = $asset->getUrl($transform);
            if ($url !== null) {
                $data = @file_get_contents($url);
                if ($data !== false) {
                    $mime = ($transform->format === 'jpg') ? 'image/jpeg' : $asset->getMimeType();
                    return "data:{$mime};base64," . base64_encode($data);
                }
            }
        }

        if ($needsConversion) {
            throw new \Exception('Could not transform asset ' . $asset->id . ' into an OpenAI-supported format.');
        }

        return $asset->getDataUrl();
    }

    /**
     * Build a single transform handling both resize and format conversion as needed.
     */
    private function buildTransform(Asset $asset): ?ImageTransform
    {
        $needsResize = false;
        $width = $asset->getWidth();
        $height = $asset->getHeight();
        $transformWidth = null;
        $transformHeight = null;

        if ($width !== null && $height !== null && ($width > self::MAX_DIMENSION || $height > self::MAX_DIMENSION)) {
            $needsResize = true;
            if ($width > $height) {
                $transformWidth = self::MAX_DIMENSION;
            } else {
                $transformHeight = self::MAX_DIMENSION;
            }
        }

        $needsConversion = $this->needsFormatConversion($asset);

        if (!$needsResize && !$needsConversion) {
            return null;
        }

        $config = ['mode' => 'fit', 'upscale' => false];

        if ($needsResize) {
            $config['width'] = $transformWidth;
            $config['height'] = $transformHeight;
        }

        if ($needsConversion) {
            $config['format'] = 'jpg';
        }

        return new ImageTransform($config);
    }

    /**
     * Check if the asset's format is unsupported by OpenAI and needs JPG conversion.
     * SVGs, TIFFs, etc. always need conversion. Animated GIFs also need conversion
     * because OpenAI's vision endpoint doesn't handle multi-frame images.
     */
    private function needsFormatConversion(Asset $asset): bool
    {
        $mimeType = strtolower((string) $asset->getMimeType());
        $extension = strtolower((string) $asset->getExtension());

        if (!in_array($mimeType, self::OPENAI_SUPPORTED_MIME_TYPES, true)) {
            return true;
        }

        if ($mimeType === 'image/gif' || $extension === 'gif') {
            $path = $asset->getCopyOfFile();
            if ($path !== null && file_exists($path) && $this->isAnimatedGif($path)) {
                return true;
            }
        }

        return false;
    }

    /** A GIF is animated if it contains more than one image separator byte (0x2C). */
    private function isAnimatedGif(string $filePath): bool
    {
        $contents = file_get_contents($filePath);
        if ($contents === false) {
            return false;
        }
        return substr_count($contents, "\x2C") > 1;
    }
}
