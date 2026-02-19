<?php

namespace szenario\craftaltpilot\events;

use craft\events\DeleteSiteEvent;
use craft\events\VolumeEvent;
use craft\services\Sites;
use craft\services\Volumes;
use szenario\craftaltpilot\AltPilot;
use yii\base\Event;

final class CleanupEvents
{
    private AltPilot $plugin;

    public function __construct(AltPilot $plugin)
    {
        $this->plugin = $plugin;
    }

    public function register(): void
    {
        Event::on(
            Sites::class,
            Sites::EVENT_AFTER_DELETE_SITE,
            function (DeleteSiteEvent $event) {
                $siteId = (int) $event->site->id;
                $this->plugin->databaseService->deleteMetadataForSite($siteId);
            }
        );

        Event::on(
            Volumes::class,
            Volumes::EVENT_AFTER_DELETE_VOLUME,
            function (VolumeEvent $event) {
                $volumeId = (int) $event->volume->id;
                $this->plugin->databaseService->deleteMetadataForVolume($volumeId);
            }
        );
    }
}
