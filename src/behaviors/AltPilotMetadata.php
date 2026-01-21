<?php

namespace szenario\craftaltpilot\behaviors;

use Craft;
use craft\db\Query;
use craft\elements\Asset;
use craft\events\ModelEvent;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\services\assets\DatabaseService;
use yii\base\Behavior;
use yii\base\Event;
use yii\db\Exception;

/**
 * Exposes a `status` attribute on assets and persists it in `altpilot_metadata`.
 */
class AltPilotMetadata extends Behavior
{
    public const STATUS_MISSING = 0;
    public const STATUS_AI_GENERATED = 1;
    public const STATUS_MANUAL = 2;

    /**
     * @var int|null Cached status value.
     */
    private ?int $_status = null;

    /**
     * @var bool Whether the metadata has been loaded from the database.
     */
    private bool $_loaded = false;

    /**
     * @var bool Whether the status has been explicitly set during this request.
     */
    private bool $_statusExplicitlySet = false;


    /**
     * @inheritdoc
     */
    public function events(): array
    {
        return [
            Asset::EVENT_BEFORE_SAVE => 'beforeSave',
            Asset::EVENT_AFTER_SAVE => 'afterSave',
            Asset::EVENT_AFTER_DELETE => 'afterDelete',
        ];
    }

    /**
     * Returns the current status for the asset.
     */
    public function getStatus(): int
    {
        if (!$this->_loaded) {
            $this->_loadFromDatabase();
        }

        return $this->_status ?? self::STATUS_MISSING;
    }

    /**
     * Sets the status flag for the asset.
     */
    public function setStatus(int $value): void
    {
        Craft::info("AltPilotMetadata: setStatus called with value $value", 'alt-pilot');
        $this->_status = $value;
        $this->_loaded = true;
        $this->_statusExplicitlySet = true;
    }

    /**
     * Handles logic before the asset saves.
     */
    public function beforeSave(ModelEvent $event): void
    {
        $asset = $this->owner;
        Craft::info("AltPilotMetadata: beforeSave for asset " . $asset->id, 'alt-pilot');

        if (!$asset instanceof Asset) {
            return;
        }

        // If status was explicitly set, don't overwrite it
        if ($this->_statusExplicitlySet) {
            Craft::info("AltPilotMetadata: Status explicitly set to " . $this->_status . ", skipping auto-detection", 'alt-pilot');
            return;
        }

        // If alt text changed, update status automatically
        if ($asset->isAttributeDirty('alt')) {
            $altText = $asset->alt;
            Craft::info("AltPilotMetadata: Alt text dirty. New value: '$altText'", 'alt-pilot');
            $status = ($altText === null || trim($altText) === '')
                ? self::STATUS_MISSING
                : self::STATUS_MANUAL;

            Craft::info("AltPilotMetadata: Auto-setting status to $status", 'alt-pilot');
            $this->setStatus($status);
        }
    }

    /**
     * Handles persisting the status after the asset saves.
     */
    public function afterSave(ModelEvent $event): void
    {
        $asset = $this->owner;
        Craft::info("AltPilotMetadata: afterSave for asset " . $asset->id, 'alt-pilot');

        if (!$asset instanceof Asset || !$asset->id || !$asset->siteId) {
            return;
        }

        $status = $this->getStatus();
        Craft::info("AltPilotMetadata: Persisting status $status to DB", 'alt-pilot');

        AltPilot::getInstance()
            ->databaseService
            ->insertSingleAsset(Craft::$app->getDb(), $asset, $status);

        $this->_status = $status;
        $this->_loaded = true;
    }

    public function afterDelete(Event $event): void
    {
        $asset = $this->owner;

        if (!$asset instanceof Asset || !$asset->id) {
            return;
        }

        try {
            Craft::$app->getDb()
                ->createCommand()
                ->delete(DatabaseService::TABLE_NAME, ['assetId' => $asset->id])
                ->execute();
        } catch (Exception $e) {
            Craft::error('Failed to delete AltPilot metadata for asset ' . $asset->id . ': ' . $e->getMessage(), 'alt-pilot');
        }
    }

    /**
     * Lazily loads the status from the metadata table.
     */
    private function _loadFromDatabase(): void
    {
        $asset = $this->owner;

        if (!$asset instanceof Asset || !$asset->id || !$asset->siteId) {
            $this->_status = self::STATUS_MISSING;
            $this->_loaded = true;
            return;
        }

        $row = (new Query())
            ->select(['status'])
            ->from(DatabaseService::TABLE_NAME)
            ->where(['assetId' => $asset->id, 'siteId' => $asset->siteId])
            ->one();

        $this->_status = $row ? (int) $row['status'] : self::STATUS_MISSING;
        $this->_loaded = true;
    }
}