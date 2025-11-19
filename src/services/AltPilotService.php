<?php

namespace szenario\craftaltpilot\services;

use Craft;
use yii\base\Component;
use craft\events\DefineMenuItemsEvent;
use craft\enums\MenuItemType;
/**
 * Alt Pilot Service service
 */
class AltPilotService extends Component
{
  public function handleAssetActionMenuItems(DefineMenuItemsEvent $event)
  {
    $asset = $event->sender;

    if (!$asset instanceof \craft\elements\Asset) {
      return;
    }

    if ($asset->kind !== 'image') {
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

  Craft.sendActionRequest('POST', 'alt-pilot/web/queue', {
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
