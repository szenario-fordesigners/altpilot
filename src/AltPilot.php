<?php

namespace szenario\craftaltpilot;

use Craft;
use craft\base\Element;
use craft\base\Model;
use craft\base\Plugin;
use craft\elements\Asset;
use craft\events\DefineMenuItemsEvent;
use craft\events\ModelEvent;
use craft\events\PluginEvent;
use craft\events\RegisterElementActionsEvent;
use craft\helpers\App;
use craft\helpers\Json;
use craft\log\MonologTarget;
use craft\services\Plugins;
use Psr\Log\LogLevel;
use szenario\craftaltpilot\behaviors\AltPilotMetadata;
use szenario\craftaltpilot\elements\actions\GenerateAltPilotElementAction;
use szenario\craftaltpilot\models\Settings;
use szenario\craftaltpilot\services\AltPilotService;
use szenario\craftaltpilot\services\AltTextGenerator;
use szenario\craftaltpilot\services\DatabaseService;
use szenario\craftaltpilot\services\ImageUtilityService;
use szenario\craftaltpilot\services\OpenAiService;
use szenario\craftaltpilot\services\QueueService;
use szenario\craftaltpilot\services\UrlReachabilityChecker;
use yii\base\Event;
use craft\events\RegisterCpNavItemsEvent;
use craft\web\twig\variables\Cp;

/**
 * AltPilot plugin
 *
 * @method static AltPilot getInstance()
 * @method Settings getSettings()
 * @author szenario <support@szenario.design>
 * @copyright szenario
 * @license https://craftcms.github.io/license/ Craft License
 * @property-read OpenAiService $openAiService
 * @property-read AltPilotService $altPilotService
 * @property-read UrlReachabilityChecker $urlReachabilityChecker
 * @property-read ImageUtilityService $imageUtilityService
 * @property-read QueueService $queueService
 * @property-read AltTextGenerator $altTextGenerator
 * @property-read DatabaseService $databaseService
 */
class AltPilot extends Plugin
{
    public string $schemaVersion = '1.0.0';
    public bool $hasCpSettings = true;
    private array $_previousSettingsSnapshot = [];
    private bool $_hasStoredSettingsSnapshot = false;

    public static function config(): array
    {
        return [
            'components' => [
                'openAiService' => OpenAiService::class,
                'altPilotService' => AltPilotService::class,
                'urlReachabilityChecker' => UrlReachabilityChecker::class,
                'imageUtilityService' => ImageUtilityService::class,
                'queueService' => QueueService::class,
                'altTextGenerator' => AltTextGenerator::class,
                'databaseService' => DatabaseService::class,
            ],
        ];
    }

    public function init(): void
    {
        parent::init();

        $this->attachEventHandlers();
        $this->registerLogTarget();

        // Any code that creates an element query or loads Twig should be deferred until
        // after Craft is fully initialized, to avoid conflicts with other plugins/modules
        Craft::$app->onInit(function () {
            // ...
        });
    }

    protected function createSettingsModel(): ?Model
    {
        return Craft::createObject(Settings::class);
    }

    protected function settingsHtml(): ?string
    {
        return Craft::$app->view->renderTemplate('alt-pilot/_settings.twig', [
            'plugin' => $this,
            'settings' => $this->getSettings(),
        ]);
    }


    public function afterInstall(): void
    {
        parent::afterInstall();

        try {
            $this->databaseService->initializeDatabase();
        } catch (\Throwable $exception) {
            Craft::error('AltPilot database initialization failed: ' . $exception->getMessage(), 'alt-pilot');
        }
    }

    /**
     * Register a custom log target for AltPilot plugin messages.
     */
    private function registerLogTarget(): void
    {
        $log = Craft::$app->getLog();
        $targets = $log->targets;

        // Check if the target already exists to avoid duplicates
        $targetExists = false;
        foreach ($targets as $target) {
            if ($target instanceof MonologTarget && $target->name === 'alt-pilot') {
                $targetExists = true;
                break;
            }
        }

        if (!$targetExists) {
            $target = Craft::createObject([
                'class' => MonologTarget::class,
                'name' => 'alt-pilot',
                'extractExceptionTrace' => !App::devMode(),
                'allowLineBreaks' => App::devMode(),
                'level' => App::devMode() ? LogLevel::DEBUG : LogLevel::INFO,
                'categories' => ['alt-pilot'],
                'logContext' => App::devMode(),
            ]);

            $targets[] = $target;
            $log->targets = $targets;
        }
    }

    private function calculateSettingsDiff(array $old, array $new): array
    {
        $diff = [];
        $keys = array_unique(array_merge(array_keys($old), array_keys($new)));

        foreach ($keys as $key) {
            $oldValue = $old[$key] ?? null;
            $newValue = $new[$key] ?? null;

            if (is_array($oldValue) && is_array($newValue)) {
                $nestedDiff = $this->calculateSettingsDiff($oldValue, $newValue);
                if ($nestedDiff !== []) {
                    $diff[$key] = $nestedDiff;
                }
                continue;
            }

            if ($oldValue !== $newValue) {
                $diff[$key] = [
                    'old' => $oldValue,
                    'new' => $newValue,
                ];
            }
        }

        return $diff;
    }



    private function attachEventHandlers(): void
    {
        // Register event handlers here ...
        // (see https://craftcms.com/docs/5.x/extend/events.html to get started)

        // Attach altPilot behavior to all image assets
        Event::on(
            Asset::class,
            Element::EVENT_INIT,
            function (Event $event) {
                /** @var Asset $asset */
                $asset = $event->sender;


                if ($asset->kind !== 'image') {
                    return;
                }

                Craft::info('AltPilot behavior attached to asset: ' . $asset->id . ' - kind: ' . $asset->kind, 'alt-pilot');

                $asset->attachBehavior('altPilotMetadata', AltPilotMetadata::class);
            }
        );

        Event::on(
            Plugins::class,
            Plugins::EVENT_BEFORE_SAVE_PLUGIN_SETTINGS,
            function (PluginEvent $event) {
                if ($event->plugin !== $this) {
                    return;
                }

                $info = Craft::$app->getPlugins()->getStoredPluginInfo($this->handle) ?? [];
                $this->_hasStoredSettingsSnapshot = array_key_exists('settings', $info);
                $this->_previousSettingsSnapshot = $info['settings'] ?? [];
                Craft::info(
                    'AltPilot captured pre-save settings snapshot: ' . Json::encode($this->_previousSettingsSnapshot),
                    'alt-pilot'
                );
            }
        );

        Event::on(
            Plugins::class,
            Plugins::EVENT_AFTER_SAVE_PLUGIN_SETTINGS,
            function (PluginEvent $event) {
                if ($event->plugin !== $this) {
                    return;
                }

                $newSettings = $this->getSettings()->toArray();
                if (!$this->_hasStoredSettingsSnapshot) {
                    Craft::info('AltPilot settings saved for the first time.', 'alt-pilot');
                } else {
                    $diff = $this->calculateSettingsDiff($this->_previousSettingsSnapshot, $newSettings);

                    if ($diff === []) {
                        Craft::info('AltPilot settings saved; no changes detected.', 'alt-pilot');
                    } else {
                        Craft::info('AltPilot settings changed: ' . Json::encode($diff), 'alt-pilot');
                    }
                }

                $this->_previousSettingsSnapshot = $newSettings;
                $this->_hasStoredSettingsSnapshot = true;
            }
        );

        // register asset dropdown menu item
        Event::on(
            Asset::class,
            Element::EVENT_DEFINE_ACTION_MENU_ITEMS,
            function (DefineMenuItemsEvent $event) {
                $this->altPilotService->handleAssetActionMenuItems($event);
            }
        );

        Event::on(
            Asset::class,
            Asset::EVENT_AFTER_SAVE,
            function (ModelEvent $event) {
                if (!$event->isNew) {
                    return;
                }

                $asset = $event->sender;
                if (!$asset instanceof Asset || !$asset->id || $asset->kind !== 'image') {
                    return;
                }

                $this->databaseService->insertSingleAsset(Craft::$app->getDb(), $asset);


            }
        );

        // register element action
        Event::on(
            Asset::class,
            Asset::EVENT_REGISTER_ACTIONS,
            function (RegisterElementActionsEvent $event) {
                $event->actions[] = GenerateAltPilotElementAction::class;
            }
        );

        // register control panel section
        Event::on(
            Cp::class,
            Cp::EVENT_REGISTER_CP_NAV_ITEMS,
            function (RegisterCpNavItemsEvent $event) {
                $event->navItems[] = [
                    'url' => 'alt-pilot',
                    'label' => 'AltPilot',
                    'icon' => '@mynamespace/path/to/icon.svg',
                ];
            }
        );
    }
}
