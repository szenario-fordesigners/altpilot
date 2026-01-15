<?php

namespace szenario\craftaltpilot\elements\actions;

use Craft;
use craft\base\ElementAction;
use craft\elements\Asset;
use szenario\craftaltpilot\AltPilot;

/**
 * Generate Image Alt Text element action
 */
class GenerateAltPilotElementAction extends ElementAction
{
    public static function displayName(): string
    {
        return Craft::t('alt-pilot', 'Generate Image Alt Text');
    }

    public function getTriggerHtml(): ?string
    {
        Craft::$app->getView()->registerJsWithVars(fn($type) => <<<JS
            (() => {
                new Craft.ElementActionTrigger({
                    type: $type,

                    // Whether this action should be available when multiple elements are selected
                    bulk: true,

                    validateSelection: \$jQuerySelectedItems => {
                        return \$jQuerySelectedItems.find('.element').data('kind') === 'image';
                    },
                });
            })();
        JS, [static::class]);

        return null;
    }

    public function performAction(Craft\elements\db\ElementQueryInterface $query): bool
    {
        if (!Craft::$app->getUser()->checkPermission('accessPlugin-alt-pilot')) {
            $this->setMessage(Craft::t('alt-pilot', 'You do not have permission to use AltPilot.'));
            return false;
        }

        $elements = $query->all();
        $jobCount = 0;

        foreach ($elements as $element) {
            if (!$element instanceof Asset) {
                continue;
            }

            // Set the current site id on asset
            $asset = Asset::find()->id($element->id)->siteId($query->siteId)->one();

            if ($asset === null) {
                Craft::warning('Unable to queue alt text generation: asset not found for ID ' . $element->id, 'alt-pilot');
                continue;
            }

            // Create a job for the asset
            AltPilot::getInstance()->queueService->safelyCreateJob($asset);
            $jobCount++;
        }

        if ($jobCount > 0) {
            $message = Craft::t('alt-pilot', '{count, plural, =1{1 AltPilot job} other{# AltPilot jobs}} added to queue', ['count' => $jobCount]);
            $this->setMessage($message);
        }

        return true;
    }
}
