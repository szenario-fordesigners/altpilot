<?php

namespace szenario\craftaltpilot\widgets;

use Craft;
use craft\base\Widget;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\web\assets\altpilotwidget\AltPilotWidgetAsset;

/**
 * Alt Pilot Widget widget type
 */
class AltPilotWidget extends Widget
{
    public static function displayName(): string
    {
        return '';
    }

    public static function isSelectable(): bool
    {
        return true;
    }

    public static function icon(): ?string
    {
        return 'chart-line';
    }

    public function getBodyHtml(): ?string
    {

        Craft::$app->getView()->registerAssetBundle(AltPilotWidgetAsset::class);

        return Craft::$app->getView()->renderTemplate(
            'alt-pilot/_widget',
            [
                'statusCounts' => AltPilot::getInstance()->statusService->getStatusCounts(),
            ]
        );
    }
}
