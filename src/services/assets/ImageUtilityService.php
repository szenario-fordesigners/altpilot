<?php

namespace szenario\craftaltpilot\services\assets;

use Craft;
use craft\elements\Asset;
use craft\image\Raster;
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
     * If a transform is needed (resize and/or format conversion), converts a local
     * copy of the file to JPG and encodes that. No HTTP request is made, so this works on
     * sites the server can't reach at its own public URL (basic auth, IP allowlists, split DNS).
     * If no transform is needed, uses Craft's built-in getDataUrl().
     *
     * Throws if format conversion is required but fails
     * (we can't safely fall back to the original bytes of an unsupported format).
     */
    public function assetToBase64(Asset $asset): string
    {
        $transform = $this->buildTransform($asset);
        if ($transform === null) {
            return $asset->getDataUrl();
        }

        $path = null;
        $jpgPath = null;

        try {
            $path = $asset->getCopyOfFile();
            $jpgPath = $path . '.jpg';

            /** @var Raster $image */
            $image = Craft::$app->getImages()->loadImage($path, rasterize: true, svgSize: self::MAX_DIMENSION);
            // First frame only for animated GIFs; white fill so transparent pixels don't turn black in the JPG
            $image->disableAnimation()
                ->scaleToFitAndFill($transform->width, $transform->height, '#ffffff', upscale: false)
                ->saveAs($jpgPath);

            return 'data:image/jpeg;base64,' . base64_encode((string) file_get_contents($jpgPath));
        } catch (\Throwable $e) {
            $reason = $e->getMessage() . ($e->getPrevious() !== null ? ' (' . $e->getPrevious()->getMessage() . ')' : '');

            // Resize only: the original is a supported format, so send it full-size rather than fail
            if ($transform->format !== 'jpg') {
                Craft::warning('Could not resize asset ' . $asset->id . ', sending original: ' . $reason, 'altpilot');
                return $asset->getDataUrl();
            }

            throw new \Exception('Could not transform asset ' . $asset->id . ' into an OpenAI-supported format: ' . $reason, 0, $e);
        } finally {
            foreach ([$path, $jpgPath] as $file) {
                if ($file !== null && is_file($file)) {
                    @unlink($file);
                }
            }
        }
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

    /**
     * A GIF is animated if it has more than one Graphic Control Extension block (0x21 0xF9 0x04), one per frame.
     * ponytail: heuristic — GCE is technically optional per frame; parse the frame table if a real GIF slips through.
     */
    private function isAnimatedGif(string $filePath): bool
    {
        $contents = file_get_contents($filePath);
        if ($contents === false) {
            return false;
        }
        return substr_count($contents, "\x21\xF9\x04") > 1;
    }
}
