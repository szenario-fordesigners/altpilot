<?php

namespace szenario\craftaltpilot\models;

use craft\base\Model;
use szenario\craftaltpilot\helpers\SettingsHelper;

/**
 * AltPilot settings
 */
class Settings extends Model
{
    public $openAiApiKey = '';
    public $openAiModel = 'gpt-5-nano';

    public $openAiPrompt = 'You are an expert in semantic image analysis for web accessibility. Your job is to generate alt texts for images.
1. Describe the primary subject, specific action, and setting efficiently.
2. Use precise nouns (e.g., "Persian cat" instead of "cat").
3. Include visible text ONLY if it is prominent and essential to the meaning of the image.
4. Strictly limit the output to a maximum of 150 characters.
5. Return ONLY the raw description string. No filler.
6. Output in {{ craft.app.i18n.getLocaleById(asset.language).displayName }}';

    public $openAiPromptRole = '';

    public $openAiPromptFocus = '';

    public $showImageOverlay = true;

    public $averageTokenCount = 5000;

    public $averageRequestDuration = 30;

    public $volumeIDs = [];

    public $initialized = false;

    /**
     * @inheritdoc
     */
    public function rules(): array
    {
        return [
            [['openAiApiKey'], 'required'],
            [['openAiApiKey', 'openAiPrompt', 'openAiPromptRole', 'openAiPromptFocus'], 'string'],
        ];
    }

    public function beforeValidate(): bool
    {
        $this->volumeIDs = SettingsHelper::normalizeVolumeIds($this->volumeIDs);

        return parent::beforeValidate();
    }
}
