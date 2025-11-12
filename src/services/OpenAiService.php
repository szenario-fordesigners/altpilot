<?php

namespace szenario\craftaltpilot\services;

use Craft;
use OpenAI;
use OpenAI\Client;
use yii\base\Component;
use yii\base\InvalidConfigException;

/**
 * Open Ai Service service
 */
class OpenAiService extends Component
{
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
     * @param string|null $prompt Optional custom prompt (uses settings prompt if not provided)
     * @return string The generated alt text
     * @throws \Exception
     */
    public function generateAltText(string $imageData, ?string $prompt = null): string
    {
        $settings = \szenario\craftaltpilot\AltPilot::getInstance()->getSettings();

        $userPrompt = $prompt ?? $settings->openAiPrompt ?? 'Describe this image in a way suitable for alt text (roughly 150 characters maximum).';

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

        $response = $this->chatCompletion($messages, $options);

        Craft::info('OpenAI API response: ' . json_encode($response), "alt-pilot");

        if (empty($response->choices[0]->message->content)) {
            throw new \Exception('No content returned from OpenAI API');
        }

        return trim($response->choices[0]->message->content);
    }
}
