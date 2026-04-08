<?php

namespace szenario\craftaltpilot\services\ai;

use Craft;
use OpenAI;
use OpenAI\Client;
use OpenAI\Exceptions\ErrorException;
use OpenAI\Exceptions\RateLimitException;
use craft\elements\Asset;
use craft\models\Site;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\exceptions\OpenAiErrorException;
use Throwable;
use yii\base\Component;
use yii\base\InvalidConfigException;

/**
 * Handles all communication with the OpenAI API.
 *
 * This is the single entry point for alt text generation. It decides whether to
 * send a public URL or base64-encoded image, builds the prompt from plugin settings,
 * calls the API, and handles errors + rate limiting.
 *
 * Called by: AltTextGeneratorJob (via the Craft queue)
 */
class OpenAiService extends Component
{
    private const DEFAULT_PROMPT = 'Describe this image in a way suitable for alt text (roughly 150 characters maximum).';

    /** Maps OpenAI error codes to user-friendly messages shown in the CP */
    private const ERROR_MESSAGES = [
        'invalid_api_key' => 'Invalid OpenAI API key. Please check your API key in the plugin settings.',
        'insufficient_quota' => 'OpenAI API quota exceeded. Please check your billing and usage limits.',
        'rate_limit_exceeded' => 'OpenAI API rate limit exceeded. Please try again later.',
        'billing_not_active' => 'OpenAI billing is not active. Please set up billing in your OpenAI account.',
        'model_not_found' => 'The specified OpenAI model was not found. Please check your model configuration.',
        'server_error' => 'OpenAI API server error. Please try again later.',
        'timeout' => 'Request to OpenAI API timed out. Please try again.',
    ];

    /** Lazy-loaded OpenAI client instance (one per request) */
    private ?Client $client = null;

    /**
     * Create or return the OpenAI PHP client, configured with the API key from settings.
     */
    private function getClient(): Client
    {
        if ($this->client === null) {
            $apiKey = AltPilot::getInstance()->getSettings()->openAiApiKey;

            if (empty($apiKey)) {
                throw new InvalidConfigException('OpenAI API key is not configured.');
            }

            $this->client = OpenAI::client($apiKey);
        }

        return $this->client;
    }

    /**
     * Generate alt text for an asset. This is the main public method.
     *
     * Strategy:
     * 1. Try to get a public URL for the image (cheaper — OpenAI fetches it directly)
     * 2. Verify the URL is reachable from the internet (local/private URLs won't work)
     * 3. Fall back to base64-encoding the image bytes if no usable URL exists
     *
     * The site context determines which language the alt text is generated in.
     */
    public function generateForAsset(Asset $asset): string
    {
        $plugin = AltPilot::getInstance();
        $imageService = $plugin->imageUtilityService;

        $site = $asset->siteId !== null
            ? Craft::$app->getSites()->getSiteById((int) $asset->siteId)
            : null;
        $site ??= Craft::$app->getSites()->getPrimarySite();

        $publicUrl = $imageService->getAssetPublicUrl($asset);
        if ($publicUrl !== null && $plugin->urlReachabilityChecker->isReachable($publicUrl)) {
            return $this->generateAltText($publicUrl, $asset, $site);
        }

        Craft::info('Using base64 encoding for asset: ' . $asset->id, 'altpilot');
        return $this->generateAltText($imageService->assetToBase64($asset), $asset, $site);
    }

    /**
     * Build the OpenAI chat completion request, send it, and return the alt text string.
     *
     * @param string $imageData Either a public URL or a base64 data URI
     */
    private function generateAltText(string $imageData, Asset $asset, Site $site): string
    {
        $plugin = AltPilot::getInstance();
        $settings = $plugin->getSettings();

        $prompt = $this->buildPrompt($settings->openAiPrompt ?: self::DEFAULT_PROMPT, $asset, $site);

        $messages = [[
            'role' => 'user',
            'content' => [
                ['type' => 'text', 'text' => $prompt],
                ['type' => 'image_url', 'image_url' => ['url' => $imageData, 'detail' => 'low']],
            ],
        ]];

        // Wait if a previous request set a rate-limit delay (stored in cache)
        $plugin->openAiRateLimiter->throttleIfNeeded();
        $startTime = time();

        try {
            $response = $this->getClient()->chat()->create([
                'model' => $settings->openAiModel ?? 'gpt-5-nano',
                'messages' => $messages,
            ]);
        } catch (\Exception $e) {
            if ($e instanceof RateLimitException && property_exists($e, 'response') && $e->response !== null) {
                $plugin->openAiRateLimiter->handleRateLimitResponse($e->response);
            }
            throw $this->wrapException($e);
        }

        $content = $this->extractContent($response);
        $duration = time() - $startTime;

        // Track rolling averages of token usage and request duration (used for rate-limit pacing)
        $tokenCount = 0;
        if (is_object($response) && isset($response->usage, $response->usage->totalTokens)) {
            $tokenCount = $response->usage->totalTokens;
        }

        $stats = $plugin->statsService->updateStats($tokenCount, $duration);

        // Use the response's rate-limit headers to schedule a delay before the next request
        $this->scheduleRateLimit($response, $stats, $duration);

        return trim($content);
    }

    /**
     * Pull the text content out of the OpenAI chat completion response.
     * The openai-php/client can return either objects or arrays depending on context.
     */
    private function extractContent(mixed $response): string
    {
        if (is_object($response) && isset($response->choices[0]->message->content)) {
            $content = $response->choices[0]->message->content;
        } elseif (is_array($response) && isset($response['choices'][0]['message']['content'])) {
            $content = $response['choices'][0]['message']['content'];
        } else {
            Craft::error('Invalid OpenAI response structure: ' . substr(json_encode($response), 0, 500), 'altpilot');
            throw new OpenAiErrorException(
                'Invalid response from OpenAI API. Please check your API key and configuration.',
                500, null, 'invalid_response', 'api_error', 500
            );
        }

        if (empty($content)) {
            throw new OpenAiErrorException(
                'No content returned from OpenAI API',
                500, null, 'empty_content', 'api_error', 500
            );
        }

        return trim($content);
    }

    /**
     * Convert any exception from the OpenAI client into an OpenAiErrorException
     * with a sanitized, user-friendly message. This keeps API keys out of logs and UI.
     */
    private function wrapException(\Exception $e): \Exception
    {
        if ($e instanceof OpenAiErrorException) {
            return $e;
        }

        $sanitized = $this->sanitizeMessage($e->getMessage());

        if ($e instanceof RateLimitException) {
            Craft::error('OpenAI rate limit: ' . $sanitized, 'altpilot');
            return new OpenAiErrorException(
                'OpenAI API rate limit exceeded. Please try again later.',
                429, $e, 'rate_limit_exceeded', 'rate_limit_error', 429
            );
        }

        if ($e instanceof ErrorException) {
            $code = $e->getErrorCode();
            $status = $e->getStatusCode();
            $message = self::ERROR_MESSAGES[(string) $code]
                ?? ($status === 401 ? 'OpenAI API authentication failed. Please check your API key.'
                : ($status >= 500 ? 'OpenAI API server error. Please try again later.'
                : 'OpenAI API error: ' . $e->getErrorMessage()));

            Craft::error(sprintf('OpenAI error [%s]: %s (HTTP %d)', $code ?? 'unknown', $sanitized, $status), 'altpilot');
            return new OpenAiErrorException($message, $status, $e, (string) $code, $e->getErrorType(), $status);
        }

        Craft::error('OpenAI error: ' . $sanitized, 'altpilot');
        return new OpenAiErrorException(
            'Unexpected error communicating with OpenAI API: ' . $sanitized,
            $e->getCode() ?: 500, $e, 'unexpected_error', 'api_error', $e->getCode() ?: 500
        );
    }

    /**
     * Strip API keys and other secrets from error messages before logging or displaying them.
     */
    private function sanitizeMessage(string $message): string
    {
        $message = preg_replace('/sk-[a-zA-Z0-9]{20,}/', 'sk-***REDACTED***', $message);
        $message = preg_replace('/api[_-]?key["\']?\s*[:=]\s*["\']?[a-zA-Z0-9_-]{20,}/i', 'api_key=***REDACTED***', $message);
        $message = preg_replace('/Incorrect API key provided:\s*[^\s]+/i', 'Incorrect API key provided: ***REDACTED***', $message);
        return $message;
    }

    /**
     * Render the prompt template from plugin settings using Craft's object template engine.
     * Appends optional "role" and "focus" instructions if configured.
     * Falls back to the raw template string if rendering fails.
     */
    private function buildPrompt(string $template, Asset $asset, Site $site): string
    {
        try {
            $settings = AltPilot::getInstance()->getSettings();
            $view = Craft::$app->getView();
            $vars = ['asset' => $asset, 'site' => $site];

            $prompt = $view->renderObjectTemplate($template, $asset, $vars) ?: $template;

            if (!empty($settings->openAiPromptRole)) {
                $role = trim($view->renderObjectTemplate($settings->openAiPromptRole, $asset, $vars));
                if ($role !== '') {
                    $prompt .= "\n7. Interpret the image from this perspective: {$role}.";
                    $prompt .= "\n7a. Keep this perspective internal; do not mention the role, perspective, persona, or point of view in the final alt text.";
                }
            }

            if (!empty($settings->openAiPromptFocus)) {
                $focus = trim($view->renderObjectTemplate($settings->openAiPromptFocus, $asset, $vars));
                if ($focus !== '') {
                    $prompt .= "\n8. Pay particular attention to: {$focus}";
                }
            }

            return $prompt;
        } catch (Throwable $e) {
            Craft::warning('Failed to render prompt template: ' . $e->getMessage(), 'altpilot');
            return $template;
        }
    }

    /**
     * Read the rate-limit metadata from a successful response and tell the
     * rate limiter to schedule an appropriate delay before the next API call.
     */
    private function scheduleRateLimit(mixed $response, array $stats, int $duration): void
    {
        if (!is_object($response) || !method_exists($response, 'meta')) {
            return;
        }

        try {
            $meta = $response->meta();
            AltPilot::getInstance()->openAiRateLimiter->scheduleNextRequestDelay(
                $meta->tokenLimit,
                $meta->requestLimit,
                $stats['averageTokenCount'],
                $stats['averageRequestDuration'],
                $duration
            );
        } catch (\Exception $e) {
            Craft::warning('Could not read response meta for rate limiting: ' . $e->getMessage(), 'altpilot');
        }
    }
}
