<?php

namespace szenario\craftaltpilot\services\ai;

use Craft;
use craft\db\Query;
use craft\helpers\StringHelper;
use Throwable;
use yii\base\Component;
use yii\db\Expression;

/**
 * Handles AI request statistics table orchestration.
 */
class StatsService extends Component
{
    public const TABLE_NAME = '{{%altpilot_stats}}';

    /**
     * Get the current statistics.
     * 
     * @return array{averageTokenCount: int, averageRequestDuration: int}
     */
    public function getStats(): array
    {
        try {
            $row = (new Query())
                ->select(['averageTokenCount', 'averageRequestDuration'])
                ->from(self::TABLE_NAME)
                ->where(['id' => 1])
                ->one();

            if ($row) {
                return [
                    'averageTokenCount' => (int) $row['averageTokenCount'],
                    'averageRequestDuration' => (int) $row['averageRequestDuration'],
                ];
            }
        } catch (Throwable $exception) {
            Craft::error('Failed to retrieve AltPilot stats: ' . $exception->getMessage(), 'altpilot');
        }

        // Return defaults if not found or on error
        return [
            'averageTokenCount' => 5000,
            'averageRequestDuration' => 30,
        ];
    }

    /**
     * Update the request statistics with a new request's data.
     * This uses a simple moving average.
     */
    public function updateStats(int $tokenCount, float $durationSeconds): array
    {
        $currentStats = $this->getStats();
        
        $newAverageTokenCount = (int) round(($currentStats['averageTokenCount'] + $tokenCount) / 2);
        $newAverageRequestDuration = (int) round(($currentStats['averageRequestDuration'] + $durationSeconds) / 2);

        $db = Craft::$app->getDb();
        $now = new Expression('NOW()');

        try {
            if (!$db->tableExists(self::TABLE_NAME)) {
                return [
                    'averageTokenCount' => $newAverageTokenCount,
                    'averageRequestDuration' => $newAverageRequestDuration,
                ];
            }

            $db->createCommand()->upsert(
                self::TABLE_NAME,
                [
                    'id' => 1,
                    'averageTokenCount' => $newAverageTokenCount,
                    'averageRequestDuration' => $newAverageRequestDuration,
                    'dateCreated' => $now,
                    'dateUpdated' => $now,
                    'uid' => StringHelper::UUID(),
                ],
                [
                    'averageTokenCount' => $newAverageTokenCount,
                    'averageRequestDuration' => $newAverageRequestDuration,
                    'dateUpdated' => $now,
                ]
            )->execute();
        } catch (Throwable $exception) {
            Craft::error('Failed to update AltPilot stats: ' . $exception->getMessage(), 'altpilot');
        }

        return [
            'averageTokenCount' => $newAverageTokenCount,
            'averageRequestDuration' => $newAverageRequestDuration,
        ];
    }
}
