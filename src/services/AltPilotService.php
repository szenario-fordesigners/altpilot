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
    /**
     * Generate alt text for an asset (synchronous)
     *
     * @param \craft\elements\Asset $asset The asset to generate alt text for
     * @param string|null $prompt Optional custom prompt
     * @return string The generated alt text
     */
    public function generateAltText(\craft\elements\Asset $asset, ?string $prompt = null): string
    {
        $plugin = \szenario\craftaltpilot\AltPilot::getInstance();
        $openAiService = $plugin->openAiService;
        $urlReachabilityChecker = $plugin->urlReachabilityChecker;
        $imageUtilityService = $plugin->imageUtilityService;

        // Try to get public URL first (cheaper, faster)
        // Transform logic is handled internally by getAssetPublicUrl()
        $publicUrl = $imageUtilityService->getAssetPublicUrl($asset);

        if ($publicUrl !== null) {
            // Check if the URL is actually reachable from the internet
            if ($urlReachabilityChecker->isReachable($publicUrl)) {
                return $openAiService->generateAltText($publicUrl, $prompt);
            }

            Craft::info('Public URL exists but is not reachable, falling back to base64 encoding for asset: ' . $asset->id, "alt-pilot");
        } else {
            Craft::info('No public URL available, falling back to base64 encoding for asset: ' . $asset->id, "alt-pilot");
        }

        // Fall back to base64 encoding if no public URL available or not reachable
        // Transform logic is handled internally by assetToBase64()
        $base64Image = $imageUtilityService->assetToBase64($asset);
        return $openAiService->generateAltText($base64Image, $prompt);
    }



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
            fn(string $id, int $assetId) => <<<JS
const \$button = $('#' + $id);
\$button.on('activate', () => {
  \$button.addClass('loading');

  Craft.cp.displayNotice('Generating alt text...');

  Craft.sendActionRequest('POST', 'alt-pilot/web/queue', {
    data: {assetID: $assetId}
  }).then(({data}) => {
    Craft.cp.displayNotice(data.message ?? 'Alt text generation has been queued');
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
            ]
        );
    }
}
