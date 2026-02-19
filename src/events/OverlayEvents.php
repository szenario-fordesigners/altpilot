<?php

namespace szenario\craftaltpilot\events;

use Craft;
use craft\events\TemplateEvent;
use craft\web\View;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\services\ui\ImageReverseLookupService;
use yii\base\Event;

final class OverlayEvents
{
    private AltPilot $plugin;
    private ?ImageReverseLookupService $imageReverseLookupService = null;

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

                if (!Craft::$app->getUser()->checkPermission('accessPlugin-altpilot')) {
                    return;
                }

                $this->getImageReverseLookupService()->handleImageOverlay($event);
            }
        );
    }

    private function getImageReverseLookupService(): ImageReverseLookupService
    {
        if ($this->imageReverseLookupService === null) {
            $this->imageReverseLookupService = new ImageReverseLookupService();
        }

        return $this->imageReverseLookupService;
    }
}
