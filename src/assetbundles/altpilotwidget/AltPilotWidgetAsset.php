<?php

namespace szenario\craftaltpilot\assetbundles\altpilotwidget;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;

/**
 * Alt Pilot Widget asset bundle
 */
class AltPilotWidgetAsset extends AssetBundle
{
    public $sourcePath = '@szenario/craftaltpilot/assetbundles/altpilotwidget/src';
    public $depends = [
        CpAsset::class,
    ];
    public $js = [];
    public $css = [
        'css/AltPilotWidget.css',
    ];
}
