<?php

namespace szenario\craftaltpilot;

use Craft;
use craft\base\Model;
use craft\base\Plugin;
use craft\elements\Asset;
use craft\events\RegisterElementActionsEvent;
use szenario\craftaltpilot\elements\actions\GenerateAltPilotElementAction;
use yii\base\Event;
use szenario\craftaltpilot\models\Settings;
use szenario\craftaltpilot\services\AltPilotService;
use szenario\craftaltpilot\services\ImageUtilityService;
use szenario\craftaltpilot\services\OpenAiService;
use szenario\craftaltpilot\services\QueueService;
use szenario\craftaltpilot\services\UrlReachabilityChecker;
use craft\events\DefineMenuItemsEvent;
use craft\base\Element;
use szenario\craftaltpilot\behaviors\AltTextChecked;

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
 */
class AltPilot extends Plugin
{
    public string $schemaVersion = '1.0.0';
    public bool $hasCpSettings = true;

    public static function config(): array
    {
        return [
            'components' => ['openAiService' => OpenAiService::class, 'altPilotService' => AltPilotService::class, 'urlReachabilityChecker' => UrlReachabilityChecker::class, 'imageUtilityService' => ImageUtilityService::class, 'queueService' => QueueService::class],
        ];
    }

    public function init(): void
    {
        parent::init();

        $this->attachEventHandlers();

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

    private function attachEventHandlers(): void
    {
        // Register event handlers here ...
        // (see https://craftcms.com/docs/5.x/extend/events.html to get started)

        // Attach AltTextChecked behavior to all Asset elements
        Event::on(
            Asset::class,
            Element::EVENT_INIT,
            function (Event $event) {
                /** @var Asset $asset */
                $asset = $event->sender;
                $asset->attachBehavior('altTextChecked', AltTextChecked::class);
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

        // register element action
        Event::on(
            Asset::class,
            Asset::EVENT_REGISTER_ACTIONS,
            function (RegisterElementActionsEvent $event) {
                $event->actions[] = GenerateAltPilotElementAction::class;
            }
        );

    }
}
