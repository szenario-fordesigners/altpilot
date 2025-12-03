<?php

namespace szenario\craftaltpilot\models;

use Craft;
use craft\base\Model;

/**
 * AltPilot settings
 */
class Settings extends Model
{
    public $openAiApiKey = '';
    public $openAiModel = 'gpt-5-nano';

    public $openAiPrompt = 'Describe the image provided, make it suitable for an alt text description (roughly 150 characters maximum). Consider transparency within the image if supported by the file type, e.g. don\'t suggest it has a dark background if it is transparent. Do not add a prefix of any kind (e.g. alt text: AI content) so the value is suitable for the alt text attribute value of the image. When describing a person do not assume their gender. Output in {site.language}';

    public $generateOnUpload = false;

    public $generatePerLanguage = true;

    public $averageTokenCount = 5000;

    public $averageRequestDuration = 60;
}
