<?php

namespace szenario\craftaltpilot\jobs;

use Craft;
use craft\elements\Asset;
use craft\queue\BaseJob;
use Exception;

/**
 * Alt Text Generator queue job
 */
class AltTextGenerator extends BaseJob
{
    public Asset $asset;
    public ?string $prompt = null;

    public function execute($queue): void
    {
        $plugin = \szenario\craftaltpilot\AltPilot::getInstance();
        $altPilotService = $plugin->altPilotService;

        try {
            $altText = $altPilotService->generateAltText($this->asset, $this->prompt);

            $this->asset->alt = $altText;

            if (!Craft::$app->elements->saveElement($this->asset, true)) {
                throw new Exception('Failed to save alt text for asset: ' . $this->asset->filename);
            }

            Craft::info('Alt text saved for asset: ' . $this->asset->id, 'alt-pilot');
        } catch (Exception $e) {
            Craft::error('Error generating alt text for asset ' . $this->asset->id . ': ' . $e->getMessage(), 'alt-pilot');
            throw $e;
        }
    }

    protected function defaultDescription(): ?string
    {
        if ($this->asset === null) {
            return Craft::t('alt-pilot', 'Generating alt text');
        }

        $assetName = $this->asset->filename ?? 'Asset #' . $this->asset->id;

        return Craft::t('alt-pilot', '[Asset ID: {id}] Generating alt text for {asset}', [
            'id' => $this->asset->id,
            'asset' => $assetName,
        ]);
    }
}
