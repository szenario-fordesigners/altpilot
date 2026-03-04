<?php

namespace szenario\craftaltpilot\assetbundles\altpilotoverlay;

use craft\web\AssetBundle;

class AltPilotOverlayAsset extends AssetBundle
{
    public $sourcePath = '@szenario/craftaltpilot/assetbundles/altpilotoverlay/dist';

    public $js = [
        'overlay.js',
    ];

    public $jsOptions = [
        'defer' => true,
    ];
}
