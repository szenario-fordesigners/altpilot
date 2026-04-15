<?php

namespace szenario\craftaltpilot\services\ui;

use yii\base\Component;
use craft\elements\Asset;
use craft\helpers\UrlHelper;

/**
 * Resolves image src URLs to Craft Asset records for the frontend overlay.
 *
 * Used by both the OverlayController (client-side / cache-safe mode)
 * and can be called directly for server-side rendering if needed.
 */
class ImageReverseLookupService extends Component
{
    /**
     * Resolve a batch of image sources to their corresponding Craft Assets.
     *
     * @param array<int, array{src: string, alt: string|null}> $images
     * @return array<int, array{src: string, type: string, url: string, alt: string|null, assetId: int|null, searchFilename: string|null}>
     */
    public function resolveImages(array $images): array
    {
        $lookupCache = [];
        $results = [];

        foreach ($images as $image) {
            $src = $image['src'] ?? '';
            $alt = $image['alt'] ?? null;

            if ($src === '') {
                continue;
            }

            $filename = basename((string) parse_url($src, PHP_URL_PATH));
            if ($filename === '') {
                continue;
            }

            $cacheKey = $filename . '::' . $alt;
            if (!isset($lookupCache[$cacheKey])) {
                $lookupCache[$cacheKey] = $this->resolveAssetUrl($filename, $alt, $src);
            }

            $result = $lookupCache[$cacheKey];
            if ($result !== null) {
                $result['src'] = $src;
                $results[] = $result;
            }
        }

        return $results;
    }

    /**
     * Try to match a filename to exactly one Craft Asset. Disambiguation strategy:
     * 1. Exact filename match → use it if unique
     * 2. Strip transform suffixes (_800x600, _thumb, etc.) and retry
     * 3. Multiple candidates → compare URL paths, then fall back to alt text matching
     * 4. No unique match → return a "search" result linking to the asset index
     */
    private function resolveAssetUrl(string $filename, ?string $altText, ?string $src = null): ?array
    {
        $candidates = Asset::find()->filename($filename)->all();

        if (empty($candidates)) {
            $cleanName = preg_replace('/(_\d+x\d+|_thumb|_transform)(?=\.[a-z0-9]+$)/i', '', $filename);

            if ($cleanName !== $filename) {
                $candidates = Asset::find()->filename($cleanName)->all();
                if (!empty($candidates)) {
                    $filename = $cleanName;
                }
            }
        }

        // Detect Craft transform directory passing changed extensions (e.g. .png to .jpg)
        // Matches typical transform paths like: /_archivehero/17628/filename.jpg
        if (empty($candidates) && $src !== null) {
            $srcPath = parse_url($src, PHP_URL_PATH);
            // Captures both the potential transform handle/folder (group 1) and the filename (group 2)
            if (is_string($srcPath) && preg_match('/\/_([^\/]+)\/(?:[^\/]+\/)?([^\/]+)$/', $srcPath, $matches)) {
                $potentialHandle = $matches[1];
                $matchedFilename = $matches[2];

                // Verify if the matched directory name is a registered transform handle in Craft
                $isTransform = \Craft::$app->getImageTransforms()->getTransformByHandle($potentialHandle) !== null;

                // If not a named handle, it might be an inline transform like "_800x600_crop"
                if (!$isTransform && preg_match('/^\d+x\d+/', $potentialHandle)) {
                    $isTransform = true;
                }

                if ($isTransform) {
                    $baseName = pathinfo($matchedFilename, PATHINFO_FILENAME);

                    $fallbackCandidates = Asset::find()->filename($baseName . '.*')->all();
                    if (!empty($fallbackCandidates)) {
                        $candidates = $fallbackCandidates;
                        $filename = $baseName; // Strip it down for the fallback search filename returned to UI
                    }
                }
            }
        }

        $targetAssetId = null;

        if (count($candidates) === 1) {
            $targetAssetId = $candidates[0]->id;
        } elseif (count($candidates) > 1) {
            if ($src) {
                $srcPath = parse_url($src, PHP_URL_PATH);
                $pathMatches = array_filter($candidates, function ($asset) use ($srcPath) {
                    try {
                        $assetUrl = $asset->getUrl();
                        if (!$assetUrl) {
                            return false;
                        }
                        return parse_url($assetUrl, PHP_URL_PATH) === $srcPath;
                    } catch (\Throwable $e) {
                        return false;
                    }
                });

                if (count($pathMatches) === 1) {
                    $targetAssetId = reset($pathMatches)->id;
                }
            }

            if (!$targetAssetId && !empty($altText)) {
                $filtered = array_filter($candidates, function ($asset) use ($altText) {
                    return trim($asset->alt) === trim($altText);
                });

                if (count($filtered) === 1) {
                    $targetAssetId = reset($filtered)->id;
                }
            }
        }

        if ($targetAssetId) {
            $asset = Asset::find()
                ->id($targetAssetId)
                ->siteId('*')
                ->one();

            return [
                'type' => 'direct',
                'url' => UrlHelper::cpUrl('altpilot', ['query' => 'id:' . $targetAssetId]),
                'alt' => $asset ? (string) $asset->alt : null,
                'assetId' => (int) $targetAssetId,
                'searchFilename' => $filename,
            ];
        }

        return [
            'type' => 'search',
            'url' => UrlHelper::cpUrl('assets', ['search' => 'filename:"' . $filename . '"']),
            'alt' => null,
            'assetId' => null,
            'searchFilename' => $filename,
        ];
    }
}
