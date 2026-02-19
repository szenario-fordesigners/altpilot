<?php

namespace szenario\craftaltpilot\events;

use Craft;
use craft\base\Element;
use craft\elements\Asset;
use craft\events\DefineMenuItemsEvent;
use craft\events\ModelEvent;
use craft\events\RegisterElementActionsEvent;
use craft\events\RegisterElementSearchableAttributesEvent;
use craft\enums\MenuItemType;
use craft\helpers\Json;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\behaviors\AltPilotMetadata;
use szenario\craftaltpilot\elements\actions\GenerateAltPilotElementAction;
use szenario\craftaltpilot\helpers\SettingsHelper;
use yii\base\Event;

final class AssetEvents
{
    private AltPilot $plugin;

    public function __construct(AltPilot $plugin)
    {
        $this->plugin = $plugin;
    }

    public function register(): void
    {
        Event::on(
            Asset::class,
            Element::EVENT_INIT,
            function (Event $event) {
                /** @var Asset $asset */
                $asset = $event->sender;

                if ($asset->kind !== 'image') {
                    return;
                }

                Craft::info('AltPilot behavior attached to asset: ' . $asset->id . ' - kind: ' . $asset->kind, 'altpilot');

                $asset->attachBehavior('altPilotMetadata', AltPilotMetadata::class);
            }
        );

        Event::on(
            Asset::class,
            Element::EVENT_DEFINE_ACTION_MENU_ITEMS,
            function (DefineMenuItemsEvent $event) {
                $this->registerAssetActionMenuItems($event);
            }
        );

        Event::on(
            Asset::class,
            Asset::EVENT_AFTER_SAVE,
            function (ModelEvent $event) {
                if (!$event->isNew) {
                    return;
                }

                if (!Craft::$app->getRequest()->getIsConsoleRequest() && !Craft::$app->getUser()->checkPermission('accessPlugin-altpilot')) {
                    return;
                }

                Craft::info('Asset after save event triggered', 'altpilot');

                $asset = $event->sender;
                if (!$asset instanceof Asset || !$asset->id || $asset->kind !== 'image') {
                    return;
                }

                Craft::info('Asset after save event triggered: ' . $asset->id . ' - kind: ' . $asset->kind, 'altpilot');

                $configuredVolumes = SettingsHelper::normalizeVolumeIds($this->plugin->getSettings()->volumeIDs ?? []);

                Craft::info('Configured volumes: ' . Json::encode($configuredVolumes), 'altpilot');

                if ($configuredVolumes === [] || !in_array((int) $asset->volumeId, $configuredVolumes, true)) {
                    return;
                }

                Craft::info('Asset after save event triggered: ' . $asset->id . ' - kind: ' . $asset->kind . ' - volumeId: ' . $asset->volumeId, 'altpilot');

                $sites = Craft::$app->getSites()->getAllSites();

                foreach ($sites as $site) {
                    $siteAsset = clone $asset;
                    $siteAsset->siteId = $site->id;

                    $this->plugin->databaseService->insertSingleAsset(Craft::$app->getDb(), $siteAsset);
                    $this->plugin->queueService->safelyCreateJob($siteAsset);
                }
            }
        );

        Event::on(
            Asset::class,
            Asset::EVENT_REGISTER_ACTIONS,
            function (RegisterElementActionsEvent $event) {
                if (!Craft::$app->getUser()->checkPermission('accessPlugin-altpilot')) {
                    return;
                }
                $event->actions[] = GenerateAltPilotElementAction::class;
            }
        );

        Event::on(
            Asset::class,
            Asset::EVENT_REGISTER_SEARCHABLE_ATTRIBUTES,
            function (RegisterElementSearchableAttributesEvent $event) {
                $event->attributes[] = 'alt';
            }
        );
    }

    private function registerAssetActionMenuItems(DefineMenuItemsEvent $event): void
    {
        $asset = $event->sender;

        if (!$asset instanceof Asset || $asset->kind !== 'image') {
            return;
        }

        $buttonId = sprintf('action-generate-ai-alt-%s', mt_rand());

        $event->items[] = [
            'type' => MenuItemType::Button,
            'id' => $buttonId,
            'icon' => 'plane-departure',
            'label' => 'Generate Alt Text',
        ];

        $view = Craft::$app->getView();
        $view->registerJsWithVars(
            fn(string $id, int $assetId, int $siteId) => <<<JS
const \$button = $('#' + $id);
\$button.on('activate', () => {
  \$button.addClass('loading');

  Craft.cp.displayNotice('Generating alt text...');

  Craft.sendActionRequest('POST', 'altpilot/web/queue', {
    data: {assetID: $assetId, siteId: $siteId}
  }).then(({data}) => {
    console.log('data', data);
    if (data.status === 'success') {
      Craft.cp.displaySuccess(data.message);
    } else {
      Craft.cp.displayError(data.message);
    }
  }).catch(({response}) => {
    const errorMessage = response?.data?.error ?? 'Failed to generate alt text';
    Craft.cp.displayError(errorMessage);
  }).finally(() => {
    \$button.removeClass('loading');

    if (Craft.cp.elementIndex) {
        Craft.cp.elementIndex.updateElements();
        return;
    }
  });

});
JS,
            [
                $view->namespaceInputId($buttonId),
                $asset->id,
                $asset->siteId,
            ]
        );
    }
}
