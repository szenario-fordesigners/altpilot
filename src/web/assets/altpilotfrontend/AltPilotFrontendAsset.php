<?php

namespace szenario\craftaltpilot\web\assets\altpilotfrontend;

use craft\web\assets\cp\CpAsset;
use craft\web\AssetBundle;

/**
 * Alt Pilot Frontend asset bundle
 */
class AltPilotFrontendAsset extends AssetBundle
{
    public $sourcePath = __DIR__ . '/dist';
    public $depends = [
        CpAsset::class
    ];
    public $js = [
        'main.js'
    ];
    public $css = [
        'main.css'
    ];
}
