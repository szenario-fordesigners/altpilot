<?php

namespace szenario\craftaltpilot\events;

use Craft;
use craft\events\TemplateEvent;
use craft\web\View;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\assetbundles\altpilotoverlay\AltPilotOverlayAsset;
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
            View::EVENT_BEFORE_RENDER_PAGE_TEMPLATE,
            function (TemplateEvent $event) {
                if (!$this->shouldInjectOverlay()) {
                    return;
                }

                // Register the overlay JS — the script handles auth via an
                // AJAX call, so it's safe to include in cached pages.
                $view = Craft::$app->getView();
                $view->registerAssetBundle(AltPilotOverlayAsset::class);
            }
        );
    }

    private function shouldInjectOverlay(): bool
    {
        $request = Craft::$app->getRequest();

        return (
            !$request->getIsConsoleRequest() &&
            !$request->getIsCpRequest() &&
            $request->getIsSiteRequest()
        );
    }
}
