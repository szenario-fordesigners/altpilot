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
use OpenAI\Responses\Meta\MetaInformationRateLimit;

/**
 * Open Ai Service service
 */
class OpenAiService extends Component
{
    private const DEFAULT_PROMPT = 'Describe this image in a way suitable for alt text (roughly 150 characters maximum).';
    private const EXECUTION_BUFFER_SECONDS = 3;
    private const MAX_EXECUTION_TIME_SECONDS = 55;
    private const THROTTLE_LOG_CATEGORY = 'alt-pilot-throttle';

    private ?Client $client = null;
    private int $nextAllowedRequestTime = 0;

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

    private function throttleIfNeeded(): void
    {
        if ($this->nextAllowedRequestTime <= 0) {
            return;
        }

        $now = time();
        if ($now >= $this->nextAllowedRequestTime) {
            $this->nextAllowedRequestTime = 0;
            return;
        }

        $sleepSeconds = (int) max(1, $this->nextAllowedRequestTime - $now);
        $this->logThrottle('Sleeping before next OpenAI request', [
            'sleepSeconds' => $sleepSeconds,
            'nextAllowedRequestTime' => $this->nextAllowedRequestTime,
        ]);
        sleep($sleepSeconds);
        $this->nextAllowedRequestTime = 0;
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
            Craft::error('OpenAI API error: ' . $e->getMessage(), __METHOD__);
            throw $e;
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
                            'detail' => 'auto',
                        ],
                    ],
                ],
            ],
        ];

        $options = array_merge([
            // 'max_completion_tokens' => 300,
        ]);


        $this->throttleIfNeeded();

        $startTime = time();
        $response = $this->chatCompletion($messages, $options);
        Craft::info('OpenAI API response: ' . json_encode($response), "alt-pilot");

        $durationSeconds = time() - $startTime;
        $stats = $this->updateRequestStats($response->usage->totalTokens, $durationSeconds);

        $this->scheduleNextRequestDelay(
            $response->meta()->tokenLimit,
            $response->meta()->requestLimit,
            $stats['averageRequestDuration'],
            $durationSeconds
        );


        if (empty($response->choices[0]->message->content)) {
            throw new \Exception('No content returned from OpenAI API');
        }

        return trim($response->choices[0]->message->content);
    }

    /**
     * Prepare the user prompt by rendering any object template expressions
     */
    private function preparePrompt(string $promptTemplate, ?Asset $asset, ?Site $site): string
    {
        try {
            $objectContext = $asset ?? new \stdClass();
            $renderedPrompt = Craft::$app->getView()->renderObjectTemplate($promptTemplate, $objectContext, [
                'asset' => $asset,
                'site' => $site,
            ]);

            return $renderedPrompt !== '' ? $renderedPrompt : $promptTemplate;
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

    private function scheduleNextRequestDelay(
        MetaInformationRateLimit $tokenLimit,
        MetaInformationRateLimit $requestLimit,
        int $averageRequestDuration,
        int $lastRequestDuration
    ): void {
        $settings = AltPilot::getInstance()->getSettings();
        $averageTokenCount = max(1, (int) $settings->averageTokenCount);

        $tokenRemaining = max(0, (int) $tokenLimit->remaining);
        $requestRemaining = max(0, (int) $requestLimit->remaining);

        $tokenResetSeconds = $this->roundSeconds($this->parseResetInterval($tokenLimit->reset));
        $requestResetSeconds = $this->roundSeconds($this->parseResetInterval($requestLimit->reset));

        $intervals = [];

        $this->logThrottle('Starting compute intervals', [
            'requestResetSeconds' => $requestResetSeconds,
            'tokenResetSeconds' => $tokenResetSeconds,
            'requestResetSecondsRaw' => $requestLimit->reset,
            'tokenResetSecondsRaw' => $tokenLimit->reset,
            'requestRemaining' => $requestRemaining,
            'tokenRemaining' => $tokenRemaining,
            'averageTokenCount' => $averageTokenCount,
        ]);

        if ($requestResetSeconds !== null && $requestResetSeconds > 0) {
            if ($requestRemaining <= 0) {
                $intervals[] = $requestResetSeconds;
            } else {
                $intervals[] = (int) ceil($requestResetSeconds / max($requestRemaining, 1));
            }
        }

        if ($tokenResetSeconds !== null && $tokenResetSeconds > 0) {
            if ($tokenRemaining <= 0) {
                $intervals[] = $tokenResetSeconds;
            } else {
                $possibleRequests = $tokenRemaining / $averageTokenCount;
                $intervals[] = $possibleRequests > 0 ? (int) ceil($tokenResetSeconds / $possibleRequests) : $tokenResetSeconds;
            }
        }

        if ($intervals === []) {
            $this->nextAllowedRequestTime = 0;
            $this->logThrottle('Could not compute throttling interval (no headers provided).');
            return;
        }

        $requiredInterval = max($intervals);
        $waitSeconds = max(0, $requiredInterval - $averageRequestDuration);

        $this->logThrottle('Computed throttle interval', [
            'tokenRemaining' => $tokenRemaining,
            'tokenResetSeconds' => $tokenResetSeconds,
            'requestRemaining' => $requestRemaining,
            'requestResetSeconds' => $requestResetSeconds,
            'requiredInterval' => $requiredInterval,
            'averageRequestDuration' => $averageRequestDuration,
            'lastRequestDuration' => $lastRequestDuration,
            'initialWaitSeconds' => $waitSeconds,
        ]);

        $maxDelayBudget = $this->determineMaxDelayBudget($lastRequestDuration);

        if ($maxDelayBudget === 0) {
            $this->logThrottle('Skipping throttle due to exhausted PHP max_execution_time budget.', [
                'maxExecutionTime' => ini_get('max_execution_time'),
                'lastRequestDuration' => $lastRequestDuration,
            ]);
            $this->nextAllowedRequestTime = 0;
            return;
        }

        if ($waitSeconds > $maxDelayBudget) {
            $this->logThrottle('Trimming throttle interval due to PHP max_execution_time budget.', [
                'requestedWaitSeconds' => $waitSeconds,
                'maxDelayBudget' => $maxDelayBudget,
            ]);
            $waitSeconds = $maxDelayBudget;
        }


        if ($waitSeconds <= 0) {
            $this->nextAllowedRequestTime = 0;
            $this->logThrottle('Throttle interval resolved to 0 seconds. No delay scheduled.');
            return;
        }

        $this->nextAllowedRequestTime = time() + $waitSeconds;
        $this->logThrottle('Scheduled next OpenAI request', [
            'waitSeconds' => $waitSeconds,
            'nextAllowedRequestTime' => $this->nextAllowedRequestTime,
        ]);
    }

    private function roundSeconds(?float $value): ?int
    {
        if ($value === null) {
            return null;
        }

        $rounded = (int) ceil($value);
        return $rounded > 0 ? $rounded : null;
    }

    private function determineMaxDelayBudget(int $lastRequestDuration): int
    {
        $phpMaxExecutionTime = (int) ini_get('max_execution_time');

        $executionCeiling = !$phpMaxExecutionTime
            ? self::MAX_EXECUTION_TIME_SECONDS
            : min($phpMaxExecutionTime, self::MAX_EXECUTION_TIME_SECONDS);


        $budget = $executionCeiling - $lastRequestDuration - self::EXECUTION_BUFFER_SECONDS;

        $this->logThrottle('Calculated execution-time budget for throttling.', [
            'phpMaxExecutionTime' => $phpMaxExecutionTime,
            'configuredMaxExecutionTime' => self::MAX_EXECUTION_TIME_SECONDS,
            'executionCeilingSeconds' => $executionCeiling,
            'lastRequestDuration' => $lastRequestDuration,
            'bufferSeconds' => self::EXECUTION_BUFFER_SECONDS,
            'budget' => $budget,
        ]);

        return max(0, $budget);
    }


    /**
     * Parse OpenAI's reset header values (e.g. "20ms", "3s") into seconds.
     */
    private function parseResetInterval(?string $reset): ?float
    {
        if ($reset === null || $reset === '') {
            return null;
        }

        $trimmed = trim($reset);

        if (is_numeric($trimmed)) {
            return (float) $trimmed;
        }

        if (preg_match_all('/(\d+(?:\.\d+)?)(ms|s|m)/i', $trimmed, $matches, PREG_SET_ORDER) && $matches !== []) {
            $totalSeconds = 0.0;

            foreach ($matches as $match) {
                $value = (float) $match[1];
                $unit = strtolower($match[2]);

                $totalSeconds += match ($unit) {
                    'ms' => $value / 1000,
                    's' => $value,
                    'm' => $value * 60,
                    default => 0,
                };
            }

            if ($totalSeconds > 0) {
                return $totalSeconds;
            }
        }

        $timestamp = strtotime($trimmed);
        if ($timestamp !== false) {
            $seconds = $timestamp - time();
            return $seconds > 0 ? (float) $seconds : null;
        }

        return null;
    }

    private function logThrottle(string $message, array $context = []): void
    {
        $payload = $context === [] ? $message : sprintf('%s %s', $message, json_encode($context));
        Craft::info($payload, self::THROTTLE_LOG_CATEGORY);
    }
}
