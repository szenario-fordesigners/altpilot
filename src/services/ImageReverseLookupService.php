<?php

namespace szenario\craftaltpilot\services;

use Craft;
use yii\base\Component;
use craft\events\TemplateEvent;
use craft\elements\User;
use DOMDocument;
use craft\elements\Asset;
use craft\helpers\UrlHelper;
use craft\web\View;

/**
 * Image Reverse Lookup Service service
 */
class ImageReverseLookupService extends Component
{
    public function getImageControlPanelUrl(TemplateEvent $event)
    {
        if (!$this->shouldShow()) {
            return null;
        }

        $html = $event->output;
        if (empty($html)) {
            return;
        }

        // this lets us handle errors gracefully
        libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        $dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        $modified = false;
        $images = $dom->getElementsByTagName('img');

        // Cache results to save DB queries on loops
        $lookupCache = [];

        for ($i = $images->length - 1; $i >= 0; $i--) {
            $img = $images->item($i);
            $src = $img->getAttribute('src');
            $currentAlt = $img->getAttribute('alt');

            if (!$src)
                continue;

            // 1. Get Filename
            $filename = basename(parse_url($src, PHP_URL_PATH));

            // Check Cache
            $cacheKey = $filename . '::' . $currentAlt;
            if (isset($lookupCache[$cacheKey])) {
                $result = $lookupCache[$cacheKey];
            } else {
                // Run the lookup logic
                $result = $this->resolveAssetUrl($filename, $currentAlt);
                $lookupCache[$cacheKey] = $result;
            }

            // 2. ONLY Add Attributes (No Wrappers!)
            if ($result) {
                $modified = true;

                // Prefer the resolved asset alt text when available
                $altText = $result['alt'] ?? $currentAlt;

                // We attach the data payload directly to the image
                $img->setAttribute('data-cp-check-enabled', 'true');
                $img->setAttribute('data-cp-edit-url', $result['url']);
                $img->setAttribute('data-cp-edit-type', $result['type']); // 'direct' or 'search'
                $img->setAttribute('data-cp-alt-text', $altText);
            }
        }

        if ($modified) {
            // Render the overlay template
            $globalOverlayHtml = $this->renderPluginTemplate(
                'alt-pilot/_image-overlay.twig',
            );

            $body = $dom->getElementsByTagName('body')->item(0);
            if ($body) {
                // Parse the rendered HTML into a DOM we can safely import
                $overlayDom = new DOMDocument();
                $overlayDom->loadHTML(mb_convert_encoding($globalOverlayHtml, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

                // Append each top-level node into the main document body
                foreach ($overlayDom->childNodes as $node) {
                    // Only import element nodes (ignore text/doctype)
                    if ($node->nodeType !== XML_ELEMENT_NODE) {
                        continue;
                    }
                    $imported = $dom->importNode($node, true);
                    $body->appendChild($imported);
                }

                $event->output = $dom->saveHTML();
            }

        }
        libxml_clear_errors();
    }

    /**
     * Render a plugin template while temporarily switching to the CP template mode.
     */
    private function renderPluginTemplate(string $template, array $variables = []): string
    {
        $view = Craft::$app->getView();
        $oldMode = $view->getTemplateMode();
        $view->setTemplateMode(View::TEMPLATE_MODE_CP);

        try {
            return $view->renderTemplate($template, $variables);
        } finally {
            $view->setTemplateMode($oldMode);
        }
    }

    private function shouldShow()
    {
        $currentUser = Craft::$app->getUser()->getIdentity();

        if (!$currentUser) {
            return false;
        }

        /** @var User $currentUser */

        $request = Craft::$app->getRequest();
        return (
            $currentUser &&
            $currentUser->can('accessCp') &&
            // TODO: add alt pilot permissions here
            !$request->getIsConsoleRequest() &&
            !$request->getIsCpRequest() &&
            !$request->getIsPreview() &&
            !$request->getIsLivePreview() &&
            $request->getIsSiteRequest()
        );
    }

    private function resolveAssetUrl($filename, $altText)
    {
        // A. Try Exact Filename Match
        $candidates = Asset::find()->filename($filename)->all();

        // B. If no results, try stripping transform suffixes (e.g. image_500x500.jpg -> image.jpg)
        if (empty($candidates)) {
            // Regex to strip _300x300 or _thumb at the end of the name
            $cleanName = preg_replace('/(_\d+x\d+|_thumb|_transform)(?=\.[a-z0-9]+$)/i', '', $filename);

            if ($cleanName !== $filename) {
                $candidates = Asset::find()->filename($cleanName)->all();
                // If we found candidates with the clean name, update filename for the Search Fallback later
                if (!empty($candidates)) {
                    $filename = $cleanName;
                }
            }
        }

        $targetAssetId = null;

        // C. Logic: Filter Candidates
        if (count($candidates) === 1) {
            // Perfect: Only one file exists with this name.
            $targetAssetId = $candidates[0]->id;
        } elseif (count($candidates) > 1) {
            // Ambiguous: Multiple files. Try to filter by Alt Text.
            if (!empty($altText)) {
                $filtered = array_filter($candidates, function ($asset) use ($altText) {
                    return trim($asset->alt) === trim($altText);
                });

                // If filtering leaves us with exactly 1, we win.
                if (count($filtered) === 1) {
                    $targetAssetId = reset($filtered)->id;
                }
            }
        }

        // D. Generate URL
        if ($targetAssetId) {
            // Fetch the asset to get its stored alt text
            $asset = Asset::find()
                ->id($targetAssetId)
                ->siteId('*')
                ->one();

            $assetAlt = $asset ? (string) $asset->alt : null;
            return [
                'type' => 'direct',
                'url' => UrlHelper::cpUrl('assets/edit/' . $targetAssetId),
                'alt' => $assetAlt,
            ];
        } else {
            // Fallback: Link to Assets Index with "filename:image.jpg" search
            // We use quotes around filename to handle spaces strictly
            return [
                'type' => 'search',
                'url' => UrlHelper::cpUrl('assets', ['search' => 'filename:"' . $filename . '"']),
                'alt' => null,
            ];
        }
    }

}
