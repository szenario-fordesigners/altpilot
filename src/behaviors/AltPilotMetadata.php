<?php

namespace szenario\craftaltpilot\behaviors;

use Craft;
use craft\db\Query;
use craft\elements\Asset;
use craft\helpers\StringHelper;
use craft\events\ModelEvent;
use szenario\craftaltpilot\services\DatabaseService;
use yii\base\Behavior;
use yii\base\Event;
use yii\db\Exception;
use yii\db\Expression;

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
     * @inheritdoc
     */
    public function events(): array
    {
        return [
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
        $this->_status = $value;
        $this->_loaded = true;
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

        $status = $this->_status ?? self::STATUS_MISSING;
        $db = Craft::$app->getDb();

        try {
            $db->createCommand()->upsert(
                DatabaseService::TABLE_NAME,
                [
                    'assetId' => $asset->id,
                    'siteId' => $asset->siteId,
                    'volumeId' => $asset->volumeId,
                    'status' => $status,
                    'dateCreated' => new Expression('NOW()'),
                    'dateUpdated' => new Expression('NOW()'),
                    'uid' => StringHelper::UUID(),
                ],
                [
                    'status' => $status,
                    'dateUpdated' => new Expression('NOW()'),
                ]
            )->execute();

            $this->_status = $status;
            $this->_loaded = true;
        } catch (Exception $e) {
            Craft::error('Failed to save AltPilot metadata for asset ' . $asset->id . ': ' . $e->getMessage(), 'alt-pilot');
        }
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