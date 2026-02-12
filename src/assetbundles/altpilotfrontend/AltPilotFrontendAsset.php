<?php

namespace szenario\craftaltpilot\assetbundles\altpilotfrontend;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;

/**
 * Alt Pilot Frontend asset bundle
 */
class AltPilotFrontendAsset extends AssetBundle
{
    public $sourcePath = '@szenario/craftaltpilot/assetbundles/altpilotfrontend/dist';
    public $depends = [
        CpAsset::class,
    ];
    public $js = [
        'main.js',
    ];
    public $css = [
        'frontend.css',
    ];
}
