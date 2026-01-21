<?php

namespace szenario\craftaltpilot\events;

use Craft;
use craft\events\TemplateEvent;
use craft\web\View;
use szenario\craftaltpilot\AltPilot;
use yii\base\Event;

final class OverlayEvents
{
    private AltPilot $plugin;

    public function __construct(AltPilot $plugin)
    {
        $this->plugin = $plugin;
    }

    public function register(): void
    {
        Event::on(
            View::class,
            View::EVENT_AFTER_RENDER_PAGE_TEMPLATE,
            function (TemplateEvent $event) {
                if (!$this->plugin->getSettings()->showImageOverlay) {
                    return;
                }

                if (!Craft::$app->getUser()->checkPermission('accessPlugin-alt-pilot')) {
                    return;
                }

                $this->plugin->imageReverseLookupService->handleImageOverlay($event);
            }
        );
    }
}
