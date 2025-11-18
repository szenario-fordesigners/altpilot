<?php

namespace szenario\craftaltpilot\migrations;

use craft\db\Migration;

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
        $tableName = '{{%altpilot_alt_text_checked}}';

        if (!$this->db->tableExists($tableName)) {
            $this->createTable($tableName, [
                'id' => $this->primaryKey(),
                'assetId' => $this->integer()->notNull(),
                'siteId' => $this->integer()->notNull(),
                'altTextChecked' => $this->boolean()->defaultValue(false)->notNull(),
                'dateCreated' => $this->dateTime()->notNull(),
                'dateUpdated' => $this->dateTime()->notNull(),
                'uid' => $this->uid(),
            ]);

            // Create unique index on assetId and siteId for faster lookups
            $this->createIndex(
                null,
                $tableName,
                ['assetId', 'siteId'],
                true // unique
            );

            // Add foreign key to assets table
            $this->addForeignKey(
                null,
                $tableName,
                'assetId',
                '{{%elements}}',
                'id',
                'CASCADE',
                'CASCADE'
            );

            // Add foreign key to sites table
            $this->addForeignKey(
                null,
                $tableName,
                'siteId',
                '{{%sites}}',
                'id',
                'CASCADE',
                'CASCADE'
            );
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public function safeDown(): bool
    {
        $tableName = '{{%altpilot_alt_text_checked}}';

        if ($this->db->tableExists($tableName)) {
            $this->dropTable($tableName);
        }

        return true;
    }
}

