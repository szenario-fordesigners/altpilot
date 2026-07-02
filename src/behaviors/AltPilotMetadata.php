<?php

namespace szenario\craftaltpilot\behaviors;

use Craft;
use craft\db\Query;
use craft\elements\Asset;
use craft\events\ModelEvent;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\services\assets\DatabaseService;
use yii\base\Behavior;

/**
 * Behavior attached to every image Asset. Tracks how the alt text was set:
 *
 *   STATUS_MISSING (0)      → No alt text exists
 *   STATUS_AI_GENERATED (1) → Set by AltPilot's OpenAI integration
 *   STATUS_MANUAL (2)       → Set by a human (either in the CP or via the plugin UI)
 *
 * The status is persisted in the `altpilot_metadata` table and lazily loaded
 * from the DB on first access. It auto-detects changes in beforeSave: if the
 * alt text changes and no explicit status was set, it defaults to MANUAL/MISSING.
 *
 * The queue job explicitly sets STATUS_AI_GENERATED before saving.
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

        if (!$asset instanceof Asset) {
            return;
        }

        // If status was explicitly set, don't overwrite it
        if ($this->_statusExplicitlySet) {
            Craft::info("AltPilotMetadata: Status explicitly set to " . $this->_status . ", skipping auto-detection for asset " . $asset->id . " on site " . $asset->siteId, 'altpilot');
            return;
        }

        // If alt text changed, update status automatically
        if ($asset->isAttributeDirty('alt')) {
            $altText = $asset->alt;
            Craft::info("AltPilotMetadata: Alt text dirty. New value: '$altText' for asset " . $asset->id . " on site " . $asset->siteId, 'altpilot');
            $status = ($altText === null || trim($altText) === '')
                ? self::STATUS_MISSING
                : self::STATUS_MANUAL;

            Craft::info("AltPilotMetadata: Auto-setting status to $status for asset " . $asset->id . " on site " . $asset->siteId, 'altpilot');
            $this->setStatus($status);
        }
    }

    /**
     * Handles persisting the status after the asset saves.
     */
    public function afterSave(ModelEvent $event): void
    {
        $asset = $this->owner;

        if (!$asset instanceof Asset || !$asset->id || !$asset->siteId) {
            return;
        }

        $status = $this->getStatus();
        Craft::info("AltPilotMetadata: Persisting status $status to DB for asset " . $asset->id . " on site " . $asset->siteId, 'altpilot');

        AltPilot::getInstance()
            ->databaseService
            ->insertSingleAsset(Craft::$app->getDb(), $asset, $status);

        $this->_status = $status;
        $this->_loaded = true;
    }

    /**
     * Format an asset for JSON API responses. Shared by WebController and QueueService.
     */
    public static function formatAssetForApi(Asset $asset): array
    {
        $behavior = $asset->getBehavior('altPilotMetadata');
        $status = $behavior instanceof self ? $behavior->getStatus() : self::STATUS_MISSING;

        $url = $asset->getUrl();
        $altText = $asset->alt;

        return [
            'id' => (int) $asset->id,
            'siteId' => $asset->siteId === null ? null : (int) $asset->siteId,
            'url' => is_string($url) ? $url : '',
            'title' => (string) $asset->title,
            'alt' => ($altText === null || $altText === '') ? null : (string) $altText,
            'status' => (int) $status,
        ];
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