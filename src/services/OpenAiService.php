<?php

namespace szenario\craftaltpilot\services;

use Craft;
use OpenAI;
use OpenAI\Client;

use craft\elements\Asset;
use craft\models\Site;
use Throwable;
use yii\base\Component;
use yii\base\InvalidConfigException;
use \szenario\craftaltpilot\AltPilot;


/**
 * Open Ai Service service
 */
class OpenAiService extends Component
{
    private const DEFAULT_PROMPT = 'Describe this image in a way suitable for alt text (roughly 150 characters maximum).';

    private ?Client $client = null;
    private ?OpenAiRateLimiter $rateLimiter = null;
    private ?OpenAiErrorService $errorService = null;


    // TODO: REMOVE LOGS AFTER TESTING THIS WITH LIKE 5K IMAGES

    /**
     * Get the OpenAI client instance
     *
     * @return Client
     * @throws InvalidConfigException
     */
    private function getClient(): Client
    {
        if ($this->client === null) {
            $settings = AltPilot::getInstance()->getSettings();
            $apiKey = $settings->openAiApiKey;

            if (empty($apiKey)) {
                throw new InvalidConfigException('OpenAI API key is not configured.');
            }

            $this->client = OpenAI::client($apiKey);
        }

        return $this->client;
    }

    private function getRateLimiter(): OpenAiRateLimiter
    {
        if ($this->rateLimiter === null) {
            $this->rateLimiter = new OpenAiRateLimiter();
        }

        return $this->rateLimiter;
    }

    private function getErrorService(): OpenAiErrorService
    {
        if ($this->errorService === null) {
            $this->errorService = AltPilot::getInstance()->openAiErrorService;
        }

        return $this->errorService;
    }

    /**
     * Send a chat completion request to OpenAI
     *
     * @param array $messages Array of message objects with 'role' and 'content' keys
     * @param array $options Additional options (model, temperature, max_tokens, etc.)
     * @return \OpenAI\Responses\Chat\CreateResponse The API response
     * @throws \Exception
     */
    private function chatCompletion(array $messages, array $options = [])
    {
        try {
            $settings = AltPilot::getInstance()->getSettings();

            $defaultOptions = [
                'model' => $settings->openAiModel ?? 'gpt-5-nano',
            ];

            $params = array_merge($defaultOptions, $options, [
                'messages' => $messages,
            ]);

            $response = $this->getClient()->chat()->create($params);

            return $response;
        } catch (\Exception $e) {
            throw $this->getErrorService()->handleException($e);
        }
    }

    /**
     * Generate alt text for an image using OpenAI Vision API
     *
     * @param string $imageData The base64 data URL or public URL of the image
     * @param Asset|null $asset The asset currently being processed
     * @param Site|null $site The site context to derive language metadata from
     * @return string The generated alt text
     * @throws \Exception
     */
    public function generateAltTextForImage(string $imageData, ?Asset $asset = null, ?Site $site = null): string
    {
        $settings = AltPilot::getInstance()->getSettings();

        $promptTemplate = $settings->openAiPrompt ?: self::DEFAULT_PROMPT;
        $userPrompt = $this->preparePrompt($promptTemplate, $asset, $site);

        Craft::info('User prompt: ' . $userPrompt, 'alt-pilot');

        $messages = [
            [
                'role' => 'user',
                'content' => [
                    [
                        'type' => 'text',
                        'text' => $userPrompt,
                    ],
                    [
                        'type' => 'image_url',
                        'image_url' => [
                            'url' => $imageData,
                            'detail' => 'low',
                        ],
                    ],
                ],
            ],
        ];

        $options = array_merge([
            // 'max_completion_tokens' => 300,
        ]);


        $this->getRateLimiter()->throttleIfNeeded();

        $startTime = time();

        try {
            $response = $this->chatCompletion($messages, $options);
        } catch (\Exception $e) {
            throw $this->getErrorService()->handleException($e);
        }

        // Validate response and check for errors
        $this->getErrorService()->validateResponse($response);

        // Extract content
        $content = $this->getErrorService()->extractContent($response);

        $durationSeconds = time() - $startTime;

        // Safely access usage and meta information (only for object responses)
        $tokenCount = 0;
        if (is_object($response)) {
            if (isset($response->usage) && isset($response->usage->totalTokens)) {
                $tokenCount = $response->usage->totalTokens;
            }
        } elseif (is_array($response) && isset($response['usage']['total_tokens'])) {
            $tokenCount = (int) $response['usage']['total_tokens'];
        }

        $stats = $this->updateRequestStats($tokenCount, $durationSeconds);

        // Safely access meta information for rate limiting (only for object responses with meta method)
        if (is_object($response) && method_exists($response, 'meta')) {
            try {
                $meta = $response->meta();
                $tokenLimit = $meta->tokenLimit ?? null;
                $requestLimit = $meta->requestLimit ?? null;

                $this->getRateLimiter()->scheduleNextRequestDelay(
                    $tokenLimit,
                    $requestLimit,
                    $stats['averageTokenCount'],
                    $stats['averageRequestDuration'],
                    $durationSeconds
                );
            } catch (\Exception $e) {
                // Log but don't fail if meta information is unavailable
                Craft::warning('Could not access response meta information: ' . $e->getMessage(), __METHOD__);
            }
        }

        return trim($content);
    }

    /**
     * Prepare the user prompt by rendering any object template expressions and prepending context
     */
    private function preparePrompt(string $promptTemplate, ?Asset $asset, ?Site $site): string
    {
        try {
            $settings = AltPilot::getInstance()->getSettings();
            $objectContext = $asset ?? new \stdClass();

            // Render the main prompt
            $renderedPrompt = Craft::$app->getView()->renderObjectTemplate($promptTemplate, $objectContext, [
                'asset' => $asset,
                'site' => $site,
            ]);

            $finalPrompt = $renderedPrompt !== '' ? $renderedPrompt : $promptTemplate;

            // Integrate context as focus/emphasis if provided
            if (!empty($settings->openAiPromptContext)) {
                $renderedContext = Craft::$app->getView()->renderObjectTemplate($settings->openAiPromptContext, $objectContext, [
                    'asset' => $asset,
                    'site' => $site,
                ]);

                if (!empty($renderedContext)) {
                    // Add context as instruction 7
                    $contextFocus = trim($renderedContext);
                    if (!empty($contextFocus)) {
                        $finalPrompt .= "\n7. Pay particular attention to: {$contextFocus}";
                    }
                }
            }

            return $finalPrompt;
        } catch (Throwable $e) {
            Craft::warning('Failed to render OpenAI prompt template: ' . $e->getMessage(), 'alt-pilot');
            return $promptTemplate;
        }
    }


    private function updateRequestStats(int $tokenCount, float $durationSeconds): array
    {
        $settings = AltPilot::getInstance()->getSettings();
        $averageTokenCount = $settings->averageTokenCount;
        $averageRequestDuration = $settings->averageRequestDuration;

        $settings->averageTokenCount = round(($averageTokenCount + $tokenCount) / 2);
        $settings->averageRequestDuration = round(($averageRequestDuration + $durationSeconds) / 2);

        Craft::$app->getPlugins()->savePluginSettings(AltPilot::getInstance(), $settings->toArray());

        return [
            'averageTokenCount' => $settings->averageTokenCount,
            'averageRequestDuration' => $settings->averageRequestDuration,
        ];
    }

}
