<?php

namespace szenario\craftaltpilot;

use Craft;
use Psr\Log\LogLevel;
use craft\base\Model;
use craft\base\Plugin;
use craft\helpers\App;
use craft\helpers\UrlHelper;
use craft\log\MonologTarget;
use szenario\craftaltpilot\events\AssetEvents;
use szenario\craftaltpilot\events\CleanupEvents;
use szenario\craftaltpilot\events\DashboardEvents;
use szenario\craftaltpilot\events\OverlayEvents;
use szenario\craftaltpilot\events\SettingsEvents;
use szenario\craftaltpilot\models\Settings;
use szenario\craftaltpilot\services\ai\OpenAiService;
use szenario\craftaltpilot\services\assets\DatabaseService;
use szenario\craftaltpilot\services\generation\AltTextGenerator;
use szenario\craftaltpilot\services\generation\QueueService;

/**
 * AltPilot plugin
 *
 * @method static AltPilot getInstance()
 * @method Settings getSettings()
 * @author szenario <support@szenario.design>
 * @copyright szenario
 * @license https://craftcms.github.io/license/ Craft License
 * @property-read OpenAiService $openAiService
 * @property-read QueueService $queueService
 * @property-read AltTextGenerator $altTextGenerator
 * @property-read DatabaseService $databaseService
 */
class AltPilot extends Plugin
{
    public string $schemaVersion = '1.0.0';
    public bool $hasCpSettings = true;
    public bool $hasCpSection = true;

    public static function config(): array
    {
        return [
            'components' => [
                'openAiService' => OpenAiService::class,
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
        $phpMaxExecutionTime = (int) ini_get('max_execution_time');

        return Craft::$app->view->renderTemplate('altpilot/_settings.twig', [
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
            Craft::error('AltPilot database initialization failed: ' . $exception->getMessage(), 'altpilot');
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
            if ($target instanceof MonologTarget && $target->name === 'altpilot') {
                $targetExists = true;
                break;
            }
        }

        if (!$targetExists) {
            $target = Craft::createObject([
                'class' => MonologTarget::class,
                'name' => 'altpilot',
                'extractExceptionTrace' => !App::devMode(),
                'allowLineBreaks' => App::devMode(),
                'level' => App::devMode() ? LogLevel::DEBUG : LogLevel::INFO,
                'categories' => ['altpilot'],
                'logContext' => App::devMode(),
            ]);

            $targets[] = $target;
            $log->targets = $targets;
        }
    }

    private function attachEventHandlers(): void
    {
        (new DashboardEvents($this))->register();
        (new SettingsEvents($this))->register();
        (new AssetEvents($this))->register();
        (new CleanupEvents($this))->register();
        (new OverlayEvents($this))->register();
    }
}
