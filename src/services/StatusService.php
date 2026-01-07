<?php

namespace szenario\craftaltpilot\services;

use craft\db\Query;
use szenario\craftaltpilot\behaviors\AltPilotMetadata;
use yii\base\Component;

/**
 * Status Service service
 */
class StatusService extends Component
{
    /**
     * Returns aggregated counts of assets by AltPilot status.
     *
     * @return array{counts: array<int,int>, total: int}
     */
    public function getStatusCounts(): array
    {
        $rows = (new Query())
            ->select(['status', 'count' => 'COUNT(*)'])
            ->from('{{%altpilot_metadata}}')
            ->groupBy(['status'])
            ->all();

        $counts = [
            AltPilotMetadata::STATUS_MISSING => 0,
            AltPilotMetadata::STATUS_AI_GENERATED => 0,
            AltPilotMetadata::STATUS_MANUAL => 0,
        ];

        $total = 0;

        foreach ($rows as $row) {
            $status = (int) $row['status'];
            $count = (int) $row['count'];
            if (isset($counts[$status])) {
                $counts[$status] = $count;
                $total += $count;
            }
        }

        return [
            'counts' => $counts,
            'total' => $total,
        ];
    }
}
