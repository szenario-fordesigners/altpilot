<?php

namespace szenario\craftaltpilot\console\controllers;

use craft\elements\Asset;
use craft\helpers\Console;
use yii\console\ExitCode;

/**
 * Asset controller
 */
class AssetController extends BaseAssetController
{
    /**
     * Generate alt text for a single asset by ID
     *
     * @param int $assetId The ID of the asset to generate alt text for
     */
    public function actionIndex(int $assetId): int
    {
        $query = Asset::find()->id($assetId)->kind('image');

        if ($this->siteId) {
            $query->siteId($this->siteId);
        } else {
            $query->siteId('*');
        }

        $assets = $query->all();

        if (empty($assets)) {
            $this->stderr("Asset not found with ID: $assetId\n", Console::FG_RED);
            return ExitCode::DATAERR;
        }

        foreach ($assets as $asset) {
            $this->queueJob($asset);
        }

        return ExitCode::OK;
    }
}
