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
    public ?Asset $asset = null;
    public ?string $prompt = null;
    public array $additionalOptions = [];

    public function execute($queue): void
    {
        if ($this->asset === null) {
            Craft::error('Asset is required for alt text generation', 'alt-pilot');
            return;
        }

        $plugin = \szenario\craftaltpilot\AltPilot::getInstance();
        $altPilotService = $plugin->altPilotService;

        try {
            // Generate the alt text (saving will be added later)
            $altText = $altPilotService->generateAltText($this->asset, $this->prompt, $this->additionalOptions);

            Craft::info('Alt text generated for asset: ' . $this->asset->id . ' - ' . $altText, 'alt-pilot');

            if (empty($altText)) {
                throw new Exception('Empty alt text generated for asset: ' . $this->asset->filename);
            }

            $this->asset->altText = $altText;

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

        return Craft::t('alt-pilot', 'Generating alt text for {asset}', [
            'asset' => $assetName,
        ]);
    }
}
