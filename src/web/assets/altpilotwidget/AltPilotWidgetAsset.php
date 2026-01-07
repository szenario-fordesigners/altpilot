<?php

namespace szenario\craftaltpilot\web\assets\altpilotwidget;

use craft\web\assets\cp\CpAsset;
use craft\web\AssetBundle;

/**
 * Alt Pilot Widget asset bundle
 */
class AltPilotWidgetAsset extends AssetBundle
{
    public $sourcePath = __DIR__ . '/dist';
    public $depends = [
        CpAsset::class
    ];
    public $js = [];
    public $css = [
        'css/AltPilotWidget.css'
    ];
}
