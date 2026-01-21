<?php

namespace szenario\craftaltpilot;

use Craft;
use Psr\Log\LogLevel;
use craft\base\Element;
use craft\base\Model;
use craft\base\Plugin;
use craft\elements\Asset;
use craft\events\DefineMenuItemsEvent;
use craft\events\DeleteSiteEvent;
use craft\events\ModelEvent;
use craft\events\PluginEvent;
use craft\events\RegisterComponentTypesEvent;
use craft\events\RegisterElementActionsEvent;
use craft\events\RegisterElementSearchableAttributesEvent;
use craft\events\VolumeEvent;
use craft\helpers\App;
use craft\helpers\Json;
use craft\helpers\UrlHelper;
use craft\log\MonologTarget;
use craft\services\Dashboard;
use craft\services\Plugins;
use craft\services\Sites;
use craft\services\Volumes;
use szenario\craftaltpilot\behaviors\AltPilotMetadata;
use szenario\craftaltpilot\elements\actions\GenerateAltPilotElementAction;
use szenario\craftaltpilot\models\Settings;
use szenario\craftaltpilot\services\AltPilotService;
use szenario\craftaltpilot\services\AltTextGenerator;
use szenario\craftaltpilot\services\DatabaseService;
use szenario\craftaltpilot\services\ImageReverseLookupService;
use szenario\craftaltpilot\services\ImageUtilityService;
use szenario\craftaltpilot\services\OpenAiErrorService;
use szenario\craftaltpilot\services\OpenAiService;
use szenario\craftaltpilot\services\QueueService;
use szenario\craftaltpilot\services\StatusService;
use szenario\craftaltpilot\services\UrlReachabilityChecker;
use szenario\craftaltpilot\widgets\AltPilotWidget;
use yii\base\Event;
use craft\web\View;
use craft\events\TemplateEvent;

/**
 * AltPilot plugin
 *
 * @method static AltPilot getInstance()
 * @method Settings getSettings()
 * @author szenario <support@szenario.design>
 * @copyright szenario
 * @license https://craftcms.github.io/license/ Craft License
 * @property-read OpenAiService $openAiService
 * @property-read OpenAiErrorService $openAiErrorService
 * @property-read AltPilotService $altPilotService
 * @property-read UrlReachabilityChecker $urlReachabilityChecker
 * @property-read ImageUtilityService $imageUtilityService
 * @property-read QueueService $queueService
 * @property-read AltTextGenerator $altTextGenerator
 * @property-read DatabaseService $databaseService
 * @property-read StatusService $statusService
 * @property-read ImageReverseLookupService $imageReverseLookupService
 */
class AltPilot extends Plugin
{
    public string $schemaVersion = '1.0.0';
    public bool $hasCpSettings = true;
    public bool $hasCpSection = true;
    private array $_previousSettingsSnapshot = [];
    private bool $_hasStoredSettingsSnapshot = false;

    public static function config(): array
    {
        return [
            'components' => [
                'openAiService' => OpenAiService::class,
                'openAiErrorService' => OpenAiErrorService::class,
                'altPilotService' => AltPilotService::class,
                'urlReachabilityChecker' => UrlReachabilityChecker::class,
                'imageUtilityService' => ImageUtilityService::class,
                'queueService' => QueueService::class,
                'altTextGenerator' => AltTextGenerator::class,
                'databaseService' => DatabaseService::class,
                'statusService' => StatusService::class,
                'imageReverseLookupService' => ImageReverseLookupService::class,
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
        $phpMaxExecutionTime = (int) ini_get('max_execution_time');

        return Craft::$app->view->renderTemplate('alt-pilot/_settings.twig', [
            'plugin' => $this,
            'settings' => $this->getSettings(),
            'phpMaxExecutionTime' => $phpMaxExecutionTime,
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

        // Redirect to the control panel settings page if we're in a web context
        if (Craft::$app->getRequest()->getIsConsoleRequest() === false && Craft::$app->getRequest()->getIsCpRequest()) {
            $settingsUrl = UrlHelper::cpUrl('settings/plugins/' . $this->handle);
            Craft::$app->getResponse()->redirect($settingsUrl)->send();
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

    /**
     * @param mixed $rawVolumeIds
     * @return int[]
     */
    private function normalizeVolumeIds(mixed $rawVolumeIds): array
    {
        if ($rawVolumeIds === null || $rawVolumeIds === '' || $rawVolumeIds === []) {
            return [];
        }

        $ids = is_array($rawVolumeIds) ? $rawVolumeIds : [$rawVolumeIds];
        $ids = array_map(static fn($id) => (int) $id, $ids);
        sort($ids);

        return array_values($ids);
    }

    private function attachEventHandlers(): void
    {
        Event::on(
            Plugins::class,
            Plugins::EVENT_AFTER_INSTALL_PLUGIN,
            function (PluginEvent $event) {
                if ($event->plugin === $this) {
                    try {
                        // add widget to dashboard
                        $widget = Craft::$app->dashboard->createWidget([
                            'type' => AltPilotWidget::class,
                            'colspan' => 2,
                        ]);

                        if (Craft::$app->dashboard->saveWidget($widget)) {
                            Craft::$app->dashboard->changeWidgetColspan($widget->id, 2);
                            Craft::info('Widget saved successfully', 'alt-pilot');
                        }
                    } catch (\Throwable $e) {
                        // when installing via CLI, the dashboard is not available and widget install will fail
                        Craft::warning('Could not save widget: ' . $e->getMessage(), 'alt-pilot');
                    }
                }
            }
        );

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

                        $oldVolumeIds = $this->normalizeVolumeIds($this->_previousSettingsSnapshot['volumeIDs'] ?? []);
                        $newVolumeIds = $this->normalizeVolumeIds($newSettings['volumeIDs'] ?? []);

                        if ($oldVolumeIds !== $newVolumeIds) {
                            $this->databaseService->handleVolumesChange($oldVolumeIds, $newVolumeIds);
                        }
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

                if (!Craft::$app->getRequest()->getIsConsoleRequest() && !Craft::$app->getUser()->checkPermission('accessPlugin-alt-pilot')) {
                    return;
                }

                Craft::info('Asset after save event triggered', 'alt-pilot');

                $asset = $event->sender;
                if (!$asset instanceof Asset || !$asset->id || $asset->kind !== 'image') {
                    return;
                }

                Craft::info('Asset after save event triggered: ' . $asset->id . ' - kind: ' . $asset->kind, 'alt-pilot');

                $configuredVolumes = $this->normalizeVolumeIds($this->getSettings()->volumeIDs ?? []);

                Craft::info('Configured volumes: ' . Json::encode($configuredVolumes), 'alt-pilot');

                if ($configuredVolumes === [] || !in_array((int) $asset->volumeId, $configuredVolumes, true)) {
                    return;
                }

                Craft::info('Asset after save event triggered: ' . $asset->id . ' - kind: ' . $asset->kind . ' - volumeId: ' . $asset->volumeId, 'alt-pilot');

                // Iterate over all sites and enqueue jobs for each
                // This ensures we cover all languages even if propagation hasn't finished yet
                $sites = Craft::$app->getSites()->getAllSites();

                foreach ($sites as $site) {
                    $siteAsset = clone $asset;
                    $siteAsset->siteId = $site->id;

                    $this->databaseService->insertSingleAsset(Craft::$app->getDb(), $siteAsset);
                    $this->queueService->safelyCreateJob($siteAsset);
                }
            }
        );

        // handle site deletion
        Event::on(
            Sites::class,
            Sites::EVENT_AFTER_DELETE_SITE,
            function (DeleteSiteEvent $event) {
                $siteId = (int) $event->site->id;
                $this->databaseService->deleteMetadataForSite($siteId);
            }
        );

        // handle volume deletion
        Event::on(
            Volumes::class,
            Volumes::EVENT_AFTER_DELETE_VOLUME,
            function (VolumeEvent $event) {
                $volumeId = (int) $event->volume->id;
                $this->databaseService->deleteMetadataForVolume($volumeId);
            }
        );

        // register element action
        Event::on(
            Asset::class,
            Asset::EVENT_REGISTER_ACTIONS,
            function (RegisterElementActionsEvent $event) {
                if (!Craft::$app->getUser()->checkPermission('accessPlugin-alt-pilot')) {
                    return;
                }
                $event->actions[] = GenerateAltPilotElementAction::class;
            }
        );

        // register dashboard widget
        Event::on(Dashboard::class, Dashboard::EVENT_REGISTER_WIDGET_TYPES, function (RegisterComponentTypesEvent $event) {
            $event->types[] = AltPilotWidget::class;
        });

        // register alt text for search index (for example in the control panel search)
        Event::on(
            Asset::class,
            Asset::EVENT_REGISTER_SEARCHABLE_ATTRIBUTES,
            function (RegisterElementSearchableAttributesEvent $e) {
                $e->attributes[] = 'alt';
            }
        );


        // register alt text preview in the frontend
        Event::on(
            View::class,
            View::EVENT_AFTER_RENDER_PAGE_TEMPLATE,
            function (TemplateEvent $event) {
                if (!$this->getSettings()->showImageOverlay) {
                    return;
                }

                if (!Craft::$app->getUser()->checkPermission('accessPlugin-alt-pilot')) {
                    return;
                }

                $this->imageReverseLookupService->handleImageOverlay($event);
            }
        );
    }
}
