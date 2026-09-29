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
        // ponytail: no asset delete handler. Asset::EVENT_AFTER_DELETE also fires when
        // an asset is trashed, and restoring it doesn't save it, so deleting rows there
        // lost them for good. Trashed assets are already filtered out by the queries
        // (elements.dateDeleted), and a hard delete (including trash garbage collection)
        // removes the rows via the assetId foreign key's ON DELETE CASCADE.
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
