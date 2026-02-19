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
    public int $assetId;
    public ?int $siteId = null;
    public string $filename = '';

    public function execute($queue): void
    {
        $asset = Craft::$app->elements->getElementById($this->assetId, Asset::class, $this->siteId);

        if (!$asset) {
            Craft::warning(sprintf('Asset %d (site %d) not found for AltTextGeneratorJob', $this->assetId, $this->siteId ?? 0), 'altpilot');
            return;
        }

        $plugin = \szenario\craftaltpilot\AltPilot::getInstance();
        $altTextGenerator = $plugin->altTextGenerator;

        try {
            $altText = $altTextGenerator->generateAltTextForAsset($asset);

            $asset->alt = $altText;

            $behavior = $asset->getBehavior('altPilotMetadata');
            if ($behavior instanceof AltPilotMetadata) {
                $behavior->setStatus(AltPilotMetadata::STATUS_AI_GENERATED);
            }

            if (!Craft::$app->elements->saveElement($asset, true)) {
                throw new Exception('Failed to save alt text for asset: ' . ($asset->filename ?? ('Asset #' . $asset->id)));
            }

            Craft::info(sprintf('Alt text saved for %s on site ID: %d', $asset->filename ?? $asset->id, $asset->siteId ?? 0), 'altpilot');
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
                $asset->filename ?? $asset->id,
                $asset->siteId ?? 'N/A',
                $e->getMessage(),
                $e->errorCode ?? 'unknown',
                $e->errorType ?? 'unknown',
                $e->httpStatusCode
            );

            Craft::error($logMessage, 'altpilot');

            // Create a new exception without the original exception to prevent stack trace from exposing API keys
            throw new Exception($enhancedMessage, $e->getCode());
        } catch (Exception $e) {
            // Re-throw generic exceptions (db errors, etc)
            Craft::error(sprintf('Error generating alt text for %s on site ID: %s - %s', $asset->filename ?? $asset->id, $asset->siteId ?? 'N/A', $e->getMessage()), 'altpilot');
            throw $e;
        }
    }

    protected function defaultDescription(): ?string
    {
        return Craft::t('altpilot', '[Asset ID: {id} | Site ID: {siteId}] AltPilot: Generating alt text for {asset}', [
            'id' => $this->assetId,
            'siteId' => $this->siteId,
            'asset' => $this->filename,
        ]);
    }
}
