<?php

namespace szenario\craftaltpilot\events;

use Craft;
use craft\events\PluginEvent;
use craft\helpers\Json;
use craft\services\Plugins;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\helpers\SettingsHelper;
use yii\base\Event;

final class SettingsEvents
{
    private AltPilot $plugin;
    private array $previousSettingsSnapshot = [];
    private bool $hasStoredSettingsSnapshot = false;

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
                $this->hasStoredSettingsSnapshot = array_key_exists('settings', $info);
                $this->previousSettingsSnapshot = $info['settings'] ?? [];
            }
        );

        Event::on(
            Plugins::class,
            Plugins::EVENT_AFTER_SAVE_PLUGIN_SETTINGS,
            function (PluginEvent $event) {
                if ($event->plugin !== $this->plugin) {
                    return;
                }

                $newSettings = $this->plugin->getSettings()->toArray();

                if (!$this->hasStoredSettingsSnapshot) {
                    Craft::info('AltPilot settings saved for the first time.', 'altpilot');
                } else {
                    $diff = SettingsHelper::calculateSettingsDiff($this->previousSettingsSnapshot, $newSettings);

                    if ($diff === []) {
                        Craft::info('AltPilot settings saved; no changes detected.', 'altpilot');
                    } else {
                        $redactedDiff = SettingsHelper::redactSensitiveSettingsDiff($diff);
                        Craft::info('AltPilot settings changed: ' . Json::encode($redactedDiff), 'altpilot');

                        $oldVolumeIds = SettingsHelper::normalizeVolumeIds($this->previousSettingsSnapshot['volumeIDs'] ?? []);
                        $newVolumeIds = SettingsHelper::normalizeVolumeIds($newSettings['volumeIDs'] ?? []);

                        if ($oldVolumeIds !== $newVolumeIds) {
                            $this->plugin->databaseService->handleVolumesChange($oldVolumeIds, $newVolumeIds);
                        }
                    }
                }

                $this->previousSettingsSnapshot = $newSettings;
                $this->hasStoredSettingsSnapshot = true;
            }
        );
    }
}
