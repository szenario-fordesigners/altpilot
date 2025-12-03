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

/**
 * Open Ai Service service
 */
class OpenAiService extends Component
{
    private const DEFAULT_PROMPT = 'Describe this image in a way suitable for alt text (roughly 150 characters maximum).';

    private ?Client $client = null;

    /**
     * Get the OpenAI client instance
     *
     * @return Client
     * @throws InvalidConfigException
     */
    private function getClient(): Client
    {
        if ($this->client === null) {
            $settings = \szenario\craftaltpilot\AltPilot::getInstance()->getSettings();
            $apiKey = $settings->openAiApiKey;

            if (empty($apiKey)) {
                throw new InvalidConfigException('OpenAI API key is not configured.');
            }

            $this->client = OpenAI::client($apiKey);
        }

        return $this->client;
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
            $settings = \szenario\craftaltpilot\AltPilot::getInstance()->getSettings();

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
        $settings = \szenario\craftaltpilot\AltPilot::getInstance()->getSettings();

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


        $startTime = time();
        $response = $this->chatCompletion($messages, $options);
        Craft::info('OpenAI API response: ' . json_encode($response), "alt-pilot");

        $this->updateRequestStats($response->usage->totalTokens, time() - $startTime);


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


    private function updateRequestStats(int $tokenCount, float $durationSeconds): void
    {
        $settings = \szenario\craftaltpilot\AltPilot::getInstance()->getSettings();
        $averageTokenCount = $settings->averageTokenCount;
        $averageRequestDuration = $settings->averageRequestDuration;

        $settings->averageTokenCount = round(($averageTokenCount + $tokenCount) / 2);
        $settings->averageRequestDuration = round(($averageRequestDuration + $durationSeconds) / 2);

        Craft::$app->getPlugins()->savePluginSettings(\szenario\craftaltpilot\AltPilot::getInstance(), $settings->toArray());
    }
}
