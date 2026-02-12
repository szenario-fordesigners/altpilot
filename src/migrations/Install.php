<?php

namespace szenario\craftaltpilot\migrations;

use Craft;
use craft\db\Migration;
use szenario\craftaltpilot\services\assets\DatabaseService;

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

        if ($this->db->tableExists(DatabaseService::TABLE_NAME)) {
            Craft::info('AltPilot metadata table already exists, skipping table creation.', 'alt-pilot');
            return true;
        }

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

        return true;
    }
}

