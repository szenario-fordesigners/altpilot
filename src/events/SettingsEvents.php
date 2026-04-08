<?php

namespace szenario\craftaltpilot\events;

use Craft;
use craft\events\PluginEvent;
use craft\services\Plugins;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\helpers\SettingsHelper;
use yii\base\Event;

/**
 * Listens for plugin settings saves and triggers side effects when volumes change.
 *
 * When volumes are added or removed in settings, DatabaseService needs to
 * populate/clean up the metadata table accordingly. We snapshot the volume IDs
 * before the save and compare after to detect changes.
 */
final class SettingsEvents
{
    private AltPilot $plugin;

    /** Volume IDs from before the current save, used to detect changes */
    private array $previousVolumeIds = [];

    public function __construct(AltPilot $plugin)
    {
        $this->plugin = $plugin;
    }

    public function register(): void
    {
        Event::on(
            Plugins::class,
            Plugins::EVENT_BEFORE_SAVE_PLUGIN_SETTINGS,
            function (PluginEvent $event) {
                if ($event->plugin !== $this->plugin) {
                    return;
                }

                $info = Craft::$app->getPlugins()->getStoredPluginInfo($this->plugin->handle) ?? [];
                $this->previousVolumeIds = SettingsHelper::normalizeVolumeIds($info['settings']['volumeIDs'] ?? []);
            }
        );

        Event::on(
            Plugins::class,
            Plugins::EVENT_AFTER_SAVE_PLUGIN_SETTINGS,
            function (PluginEvent $event) {
                if ($event->plugin !== $this->plugin) {
                    return;
                }

                Craft::info('AltPilot settings saved.', 'altpilot');

                $newVolumeIds = SettingsHelper::normalizeVolumeIds(
                    $this->plugin->getSettings()->volumeIDs ?? []
                );

                if ($this->previousVolumeIds !== $newVolumeIds) {
                    $this->plugin->databaseService->handleVolumesChange($this->previousVolumeIds, $newVolumeIds);
                }

                $this->previousVolumeIds = $newVolumeIds;
            }
        );
    }
}
