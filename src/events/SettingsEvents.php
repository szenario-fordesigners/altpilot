<?php

namespace szenario\craftaltpilot\events;

use Craft;
use craft\events\ConfigEvent;
use craft\services\ProjectConfig;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\helpers\SettingsHelper;

/**
 * Listens for plugin settings changes and triggers side effects when volumes change.
 *
 * When volumes are added or removed in settings, DatabaseService needs to
 * populate/clean up the metadata table accordingly. This listens on the plugin's
 * project config path instead of Plugins::EVENT_*_SAVE_PLUGIN_SETTINGS, because
 * those only fire for a CP save. The project config handler fires for both a CP
 * save and a deploy (`project-config/apply`), and carries the old and new values.
 */
final class SettingsEvents
{
    private AltPilot $plugin;

    /** The last [old, new] volume change handled, used to skip Craft's duplicate dispatch */
    private ?array $lastChange = null;

    public function __construct(AltPilot $plugin)
    {
        $this->plugin = $plugin;
    }

    public function register(): void
    {
        $path = ProjectConfig::PATH_PLUGINS . '.' . $this->plugin->handle . '.settings';
        $handler = function (ConfigEvent $event) {
            $this->handleSettingsChange($event);
        };

        // ponytail: no onRemove, the settings path only disappears on uninstall,
        // when the tables are dropped anyway.
        Craft::$app->getProjectConfig()
            ->onAdd($path, $handler)
            ->onUpdate($path, $handler);
    }

    private function handleSettingsChange(ConfigEvent $event): void
    {
        $oldVolumeIds = SettingsHelper::normalizeVolumeIds($event->oldValue['volumeIDs'] ?? []);
        $newVolumeIds = SettingsHelper::normalizeVolumeIds($event->newValue['volumeIDs'] ?? []);

        // During `project-config/apply`, ProjectConfig::reset() re-runs init(), which
        // attaches Craft's change dispatcher a second time, so every config handler
        // fires twice. Skip the repeat so we don't rescan the volumes twice.
        $change = [$oldVolumeIds, $newVolumeIds];
        if ($oldVolumeIds === $newVolumeIds || $change === $this->lastChange) {
            return;
        }
        $this->lastChange = $change;

        Craft::info('AltPilot volume settings changed.', 'altpilot');
        $this->plugin->databaseService->handleVolumesChange($oldVolumeIds, $newVolumeIds);
    }
}
