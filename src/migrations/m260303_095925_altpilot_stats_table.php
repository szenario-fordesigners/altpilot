<?php

namespace szenario\craftaltpilot\migrations;

use Craft;
use craft\db\Migration;

/**
 * m260303_095925_altpilot_stats_table migration.
 */
class m260303_095925_altpilot_stats_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp(): bool
    {
        if (!$this->db->tableExists('{{%altpilot_stats}}')) {
            $this->createTable('{{%altpilot_stats}}', [
                'id' => $this->primaryKey(),
                'averageTokenCount' => $this->integer()->notNull()->defaultValue(5000),
                'averageRequestDuration' => $this->integer()->notNull()->defaultValue(30),
                'dateCreated' => $this->dateTime()->notNull(),
                'dateUpdated' => $this->dateTime()->notNull(),
                'uid' => $this->uid(),
            ]);

            // Insert initial row
            $this->insert('{{%altpilot_stats}}', [
                'id' => 1,
                'averageTokenCount' => 5000,
                'averageRequestDuration' => 30,
                'dateCreated' => new \yii\db\Expression('NOW()'),
                'dateUpdated' => new \yii\db\Expression('NOW()'),
                'uid' => \craft\helpers\StringHelper::UUID(),
            ]);
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public function safeDown(): bool
    {
        if ($this->db->tableExists('{{%altpilot_stats}}')) {
            $this->dropTable('{{%altpilot_stats}}');
        }

        return true;
    }
}
