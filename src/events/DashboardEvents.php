<?php

namespace szenario\craftaltpilot\events;

use Craft;
use craft\events\PluginEvent;
use craft\events\RegisterComponentTypesEvent;
use craft\helpers\UrlHelper;
use craft\services\Dashboard;
use craft\services\Plugins;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\widgets\AltPilotWidget;
use yii\base\Event;

final class DashboardEvents
{
    private AltPilot $plugin;

    public function __construct(AltPilot $plugin)
    {
        $this->plugin = $plugin;
    }

    public function register(): void
    {
        Event::on(
            Plugins::class,
            Plugins::EVENT_AFTER_INSTALL_PLUGIN,
            function (PluginEvent $event) {
                if ($event->plugin !== $this->plugin) {
                    return;
                }

                $this->createWidget();

                // Redirect here, not in afterInstall(): this event fires after the install
                // transaction and the project config write, so a failure there can't
                // leave the browser on a settings page that no longer exists.
                // Skipped during a project config apply, which may install other plugins too.
                if (
                    Craft::$app->getRequest()->getIsCpRequest() &&
                    !Craft::$app->getProjectConfig()->getIsApplyingExternalChanges()
                ) {
                    Craft::$app->getResponse()
                        ->redirect(UrlHelper::cpUrl('settings/plugins/' . $this->plugin->handle))
                        ->send();
                }
            }
        );

        Event::on(
            Dashboard::class,
            Dashboard::EVENT_REGISTER_WIDGET_TYPES,
            function (RegisterComponentTypesEvent $event) {
                $event->types[] = AltPilotWidget::class;
            }
        );
    }

    private function createWidget(): void
    {
        $userId = Craft::$app->getUser()->getIdentity()?->getId();
        if ($userId === null) {
            Craft::info('Skipping widget auto-create: no authenticated user context.', 'altpilot');
            return;
        }

        try {
            $widget = Craft::$app->dashboard->createWidget([
                'type' => AltPilotWidget::class,
                'colspan' => 2,
            ]);

            if (Craft::$app->dashboard->saveWidget($widget)) {
                Craft::$app->dashboard->changeWidgetColspan($widget->id, 2);
                Craft::info('Widget saved successfully', 'altpilot');
            }
        } catch (\Throwable $e) {
            Craft::warning('Could not save widget: ' . $e->getMessage(), 'altpilot');
        }
    }
}
