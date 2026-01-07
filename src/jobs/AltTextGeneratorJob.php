<?php

namespace szenario\craftaltpilot\jobs;

use Craft;
use craft\elements\Asset;
use craft\queue\BaseJob;
use Exception;
use szenario\craftaltpilot\behaviors\AltPilotMetadata;
use szenario\craftaltpilot\exceptions\OpenAiErrorException;

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

            $behavior = $this->asset->getBehavior('altPilotMetadata');
            if ($behavior instanceof AltPilotMetadata) {
                $behavior->setStatus(AltPilotMetadata::STATUS_AI_GENERATED);
            }

            if (!Craft::$app->elements->saveElement($this->asset, true)) {
                throw new Exception('Failed to save alt text for asset: ' . ($this->asset->filename ?? ('Asset #' . $this->asset->id)));
            }

            Craft::info(sprintf('Alt text saved for %s on site ID: %d', $this->asset->filename ?? $this->asset->id, $this->asset->siteId ?? 0), 'alt-pilot');
        } catch (OpenAiErrorException $e) {
            // Re-throw with error details in message for queue system to capture
            // The message is already sanitized and user-friendly from OpenAiService
            $enhancedMessage = $e->getMessage();
            if ($e->errorCode !== null) {
                $enhancedMessage .= ' [OPENAI_ERROR_CODE:' . $e->errorCode . ']';
            }

            // Log error without exposing API keys (message is already sanitized)
            $logMessage = sprintf(
                'OpenAI API error generating alt text for %s on site ID: %s - %s (Code: %s, Type: %s, HTTP: %d)',
                $this->asset->filename ?? $this->asset->id,
                $this->asset->siteId ?? 'N/A',
                $e->getMessage(),
                $e->errorCode ?? 'unknown',
                $e->errorType ?? 'unknown',
                $e->httpStatusCode
            );

            Craft::error($logMessage, 'alt-pilot');

            // Create a new exception without the original exception to prevent stack trace from exposing API keys
            throw new Exception($enhancedMessage, $e->getCode());
        } catch (Exception $e) {
            // Re-throw generic exceptions (db errors, etc)
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
