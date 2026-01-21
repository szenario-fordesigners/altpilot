<?php

namespace szenario\craftaltpilot\events;

use Craft;
use craft\events\PluginEvent;
use craft\events\RegisterComponentTypesEvent;
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

                try {
                    $widget = Craft::$app->dashboard->createWidget([
                        'type' => AltPilotWidget::class,
                        'colspan' => 2,
                    ]);

                    if (Craft::$app->dashboard->saveWidget($widget)) {
                        Craft::$app->dashboard->changeWidgetColspan($widget->id, 2);
                        Craft::info('Widget saved successfully', 'alt-pilot');
                    }
                } catch (\Throwable $e) {
                    Craft::warning('Could not save widget: ' . $e->getMessage(), 'alt-pilot');
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
}
