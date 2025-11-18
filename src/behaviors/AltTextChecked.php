<?php

namespace szenario\craftaltpilot\behaviors;

use Craft;
use craft\db\Query;
use craft\elements\Asset;
use yii\base\Behavior;
use yii\db\Exception;

/**
 * Adds an `altTextChecked` boolean property to every asset.
 */
class AltTextChecked extends Behavior
{
    /**
     * @var bool|null Cached value of altTextChecked
     */
    private ?bool $_altTextChecked = null;

    /**
     * @var bool Whether the value has been loaded from the database
     */
    private bool $_loaded = false;

    /**
     * @inheritdoc
     */
    public function events(): array
    {
        return [
            Asset::EVENT_AFTER_SAVE => 'afterSave',
        ];
    }

    /**
     * Get the altTextChecked value for this asset.
     *
     * @return bool
     */
    public function getAltTextChecked(): bool
    {
        if (!$this->_loaded) {
            $this->_loadFromDatabase();
        }

        return $this->_altTextChecked ?? false;
    }

    /**
     * Set the altTextChecked value for this asset.
     *
     * @param bool $value
     */
    public function setAltTextChecked(bool $value): void
    {
        $this->_altTextChecked = $value;
        $this->_loaded = true;
    }

    /**
     * Load the altTextChecked value from the database.
     */
    private function _loadFromDatabase(): void
    {
        $asset = $this->owner;

        if (!$asset instanceof Asset || !$asset->id) {
            $this->_altTextChecked = false;
            $this->_loaded = true;
            return;
        }

        $result = (new Query())
            ->select(['altTextChecked'])
            ->from('{{%altpilot_alt_text_checked}}')
            ->where(['assetId' => $asset->id, 'siteId' => $asset->siteId])
            ->one();

        $this->_altTextChecked = $result ? (bool) $result['altTextChecked'] : false;
        $this->_loaded = true;
    }

    /**
     * Save the altTextChecked value to the database after the asset is saved.
     *
     * @param \craft\events\ModelEvent $event
     */
    public function afterSave(\craft\events\ModelEvent $event): void
    {
        $asset = $this->owner;

        if (!$asset instanceof Asset || !$asset->id || $this->_altTextChecked === null) {
            return;
        }

        $db = Craft::$app->getDb();
        $tableName = '{{%altpilot_alt_text_checked}}';

        try {
            // Check if a record already exists
            $exists = (new Query())
                ->from($tableName)
                ->where(['assetId' => $asset->id, 'siteId' => $asset->siteId])
                ->exists();

            if ($exists) {
                // Update existing record
                $db->createCommand()
                    ->update(
                        $tableName,
                        [
                            'altTextChecked' => $this->_altTextChecked,
                            'dateUpdated' => new \yii\db\Expression('NOW()'),
                        ],
                        ['assetId' => $asset->id, 'siteId' => $asset->siteId]
                    )
                    ->execute();
            } else {
                // Insert new record
                $db->createCommand()
                    ->insert(
                        $tableName,
                        [
                            'assetId' => $asset->id,
                            'siteId' => $asset->siteId,
                            'altTextChecked' => $this->_altTextChecked,
                            'dateCreated' => new \yii\db\Expression('NOW()'),
                            'dateUpdated' => new \yii\db\Expression('NOW()'),
                            'uid' => \craft\helpers\StringHelper::UUID(),
                        ]
                    )
                    ->execute();
            }
        } catch (Exception $e) {
            Craft::error('Failed to save altTextChecked for asset ' . $asset->id . ': ' . $e->getMessage(), 'alt-pilot');
        }
    }
}