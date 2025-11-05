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
     * Generate alt text for an image using OpenAI Vision API
     *
     * @param string $imageUrl The public URL of the image (preferred to save tokens)
     * @param string|null $prompt Optional custom prompt (uses settings prompt if not provided)
     * @param array $additionalOptions Additional options for the API request
     * @return string The generated alt text
     * @throws \Exception
     */
    public function generateAltText(string $imageUrl, ?string $prompt = null, array $additionalOptions = []): string
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
                            'url' => $imageUrl,
                        ],
                    ],
                ],
            ],
        ];

        $options = array_merge([
            'max_tokens' => 300,
        ], $additionalOptions);

        $response = $this->chatCompletion($messages, $options);

        if (empty($response->choices[0]->message->content)) {
            throw new \Exception('No content returned from OpenAI API');
        }

        return trim($response->choices[0]->message->content);
    }

    /**
     * Get the public URL for a Craft Asset
     *
     * @param \craft\elements\Asset $asset The Craft Asset element
     * @return string The public URL of the asset
     * @throws \Exception
     */
    public function getAssetUrl(\craft\elements\Asset $asset): string
    {
        $url = $asset->getUrl();

        if ($url === null) {
            throw new \Exception('Asset does not have a public URL. Make sure the asset is accessible.');
        }

        // Ensure we have a full URL (add base URL if needed)
        if (strpos($url, 'http') !== 0) {
            $baseUrl = Craft::getAlias('@web');
            $url = rtrim($baseUrl, '/') . '/' . ltrim($url, '/');
        }

        return $url;
    }

    /**
     * List available models
     *
     * @return \OpenAI\Responses\Models\ListResponse List of available models
     * @throws \Exception
     */
    public function listModels()
    {
        try {
            $response = $this->getClient()->models()->list();
            return $response;
        } catch (\Exception $e) {
            Craft::error('OpenAI API error listing models: ' . $e->getMessage(), __METHOD__);
            throw $e;
        }
    }
}
