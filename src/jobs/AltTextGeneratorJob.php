<?php

namespace szenario\craftaltpilot\jobs;

use Craft;
use craft\elements\Asset;
use craft\queue\BaseJob;
use Exception;

/**
 * Alt Text Generator queue job
 */
class AltTextGeneratorJob extends BaseJob
{
    public Asset $asset;

    public function execute($queue): void
    {
        $plugin = \szenario\craftaltpilot\AltPilot::getInstance();
        $altTextGenerator = $plugin->altTextGenerator;

        try {
            $altText = $altTextGenerator->generateAltTextForAsset($this->asset);

            $this->asset->alt = $altText;

            if (!Craft::$app->elements->saveElement($this->asset, true)) {
                throw new Exception('Failed to save alt text for asset: ' . ($this->asset->filename ?? ('Asset #' . $this->asset->id)));
            }

            Craft::info(sprintf('Alt text saved for %s on site ID: %d', $this->asset->filename ?? $this->asset->id, $this->asset->siteId ?? 0), 'alt-pilot');
        } catch (Exception $e) {
            Craft::error(sprintf('Error generating alt text for %s on site ID: %s - %s', $this->asset->filename ?? $this->asset->id, $this->asset->siteId ?? 'N/A', $e->getMessage()), 'alt-pilot');
            throw $e;
        }
    }

    protected function defaultDescription(): ?string
    {
        return Craft::t('alt-pilot', '[Asset ID: {id} | Site ID: {siteId}] AltPilot: Generating alt text for {asset}', [
            'id' => $this->asset->id,
            'siteId' => $this->asset->siteId,
            'asset' => $this->asset->filename,
        ]);
    }
}
