<?php

namespace szenario\craftaltpilot\migrations;

use Craft;
use craft\db\Migration;
use szenario\craftaltpilot\services\assets\DatabaseService;
use szenario\craftaltpilot\services\ai\StatsService;

/**
 * Install migration.
 */
class Install extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp(): bool
    {
        // STATUS VALUES:
        // 0 = missing
        // 1 = ai generated
        // 2 = manually edited

        if (!$this->db->tableExists(DatabaseService::TABLE_NAME)) {
            $this->createTable(DatabaseService::TABLE_NAME, [
                'id' => $this->primaryKey(),
                'assetId' => $this->integer()->notNull(),
                'siteId' => $this->integer()->notNull(),
                'volumeId' => $this->integer()->notNull(),
                'dateCreated' => $this->dateTime()->notNull(),
                'dateUpdated' => $this->dateTime()->notNull(),
                'uid' => $this->uid(),
                'status' => $this->integer()->notNull(),
            ]);

            // Create unique index on assetId and siteId for faster lookups
            $this->createIndex(
                null,
                DatabaseService::TABLE_NAME,
                ['assetId', 'siteId', 'volumeId'],
                true // unique
            );

            // Add foreign key to assets table
            $this->addForeignKey(
                null,
                DatabaseService::TABLE_NAME,
                'assetId',
                '{{%elements}}',
                'id',
                'CASCADE',
                'CASCADE'
            );

            // Add foreign key to sites table
            $this->addForeignKey(
                null,
                DatabaseService::TABLE_NAME,
                'siteId',
                '{{%sites}}',
                'id',
                'CASCADE',
                'CASCADE'
            );

            // Add foreign key to volumes table
            $this->addForeignKey(
                null,
                DatabaseService::TABLE_NAME,
                'volumeId',
                '{{%volumes}}',
                'id',
                'CASCADE',
                'CASCADE'
            );
        } else {
            echo "    > altpilot metadata table already exists, skipping table creation.\n";
        }

        if (!$this->db->tableExists(StatsService::TABLE_NAME)) {
            $this->createTable(StatsService::TABLE_NAME, [
                'id' => $this->primaryKey(),
                'averageTokenCount' => $this->integer()->notNull()->defaultValue(5000),
                'averageRequestDuration' => $this->integer()->notNull()->defaultValue(30),
                'dateCreated' => $this->dateTime()->notNull(),
                'dateUpdated' => $this->dateTime()->notNull(),
                'uid' => $this->uid(),
            ]);

            // Insert initial row
            $this->insert(StatsService::TABLE_NAME, [
                'id' => 1,
                'averageTokenCount' => 5000,
                'averageRequestDuration' => 30,
                'dateCreated' => new \yii\db\Expression('NOW()'),
                'dateUpdated' => new \yii\db\Expression('NOW()'),
                'uid' => \craft\helpers\StringHelper::UUID(),
            ]);
        } else {
            echo "    > altpilot stats table already exists, skipping table creation.\n";
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public function safeDown(): bool
    {
        if ($this->db->tableExists(DatabaseService::TABLE_NAME)) {
            $this->dropTable(DatabaseService::TABLE_NAME);
        }

        if ($this->db->tableExists(StatsService::TABLE_NAME)) {
            $this->dropTable(StatsService::TABLE_NAME);
        }

        return true;
    }
}

