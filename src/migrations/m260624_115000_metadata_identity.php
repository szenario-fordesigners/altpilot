<?php

namespace szenario\craftaltpilot\migrations;

use craft\db\Migration;
use craft\db\Query;
use craft\db\Table;
use szenario\craftaltpilot\behaviors\AltPilotMetadata;
use szenario\craftaltpilot\services\assets\DatabaseService;
use yii\db\Expression;

/**
 * Normalize AltPilot metadata identity to assetId + siteId.
 */
class m260624_115000_metadata_identity extends Migration
{
    public function safeUp(): bool
    {
        if (!$this->db->tableExists(DatabaseService::TABLE_NAME)) {
            return true;
        }

        $this->normalizeMetadataRows();

        $this->dropIndexIfExists(DatabaseService::TABLE_NAME, ['assetId', 'siteId', 'volumeId'], true);
        $this->createIndexIfMissing(DatabaseService::TABLE_NAME, ['assetId', 'siteId'], true);

        return true;
    }

    public function safeDown(): bool
    {
        if (!$this->db->tableExists(DatabaseService::TABLE_NAME)) {
            return true;
        }

        $this->dropIndexIfExists(DatabaseService::TABLE_NAME, ['assetId', 'siteId'], true);
        $this->createIndexIfMissing(DatabaseService::TABLE_NAME, ['assetId', 'siteId', 'volumeId'], true);

        return true;
    }

    private function normalizeMetadataRows(): void
    {
        $rows = (new Query())
            ->select([
                'metadata.id',
                'metadata.assetId',
                'metadata.siteId',
                'metadata.volumeId',
                'metadata.status',
                'metadata.dateUpdated',
                'currentVolumeId' => 'assets.volumeId',
                'currentAssetSiteId' => 'assets_sites.assetId',
                'currentAlt' => 'assets_sites.alt',
            ])
            ->from(['metadata' => DatabaseService::TABLE_NAME])
            ->leftJoin(['assets' => Table::ASSETS], '[[assets.id]] = [[metadata.assetId]]')
            ->leftJoin(['assets_sites' => Table::ASSETS_SITES], [
                'and',
                '[[assets_sites.assetId]] = [[metadata.assetId]]',
                '[[assets_sites.siteId]] = [[metadata.siteId]]',
            ])
            ->orderBy([
                'metadata.assetId' => SORT_ASC,
                'metadata.siteId' => SORT_ASC,
                'metadata.dateUpdated' => SORT_DESC,
                'metadata.id' => SORT_DESC,
            ])
            ->all($this->db);

        $groups = [];
        foreach ($rows as $row) {
            $groups[$row['assetId'] . ':' . $row['siteId']][] = $row;
        }

        foreach ($groups as $groupRows) {
            $this->normalizeMetadataGroup($groupRows);
        }
    }

    /**
     * @param array<int, array<string, mixed>> $rows
     */
    private function normalizeMetadataGroup(array $rows): void
    {
        $validRows = array_values(array_filter($rows, static function(array $row): bool {
            return $row['currentVolumeId'] !== null && $row['currentAssetSiteId'] !== null;
        }));

        if ($validRows === []) {
            $this->deleteMetadataRows(array_column($rows, 'id'));
            return;
        }

        $currentVolumeId = (int) $validRows[0]['currentVolumeId'];
        $currentAlt = $validRows[0]['currentAlt'];
        $status = $this->statusForCurrentAlt($currentAlt, $validRows);
        $keepRow = $this->selectRowToKeep($validRows, $currentVolumeId);
        $keepId = (int) $keepRow['id'];

        $this->update(
            DatabaseService::TABLE_NAME,
            [
                'volumeId' => $currentVolumeId,
                'status' => $status,
                'dateUpdated' => new Expression('NOW()'),
            ],
            ['id' => $keepId]
        );

        $deleteIds = array_values(array_filter(
            array_map(static fn(array $row): int => (int) $row['id'], $rows),
            static fn(int $id): bool => $id !== $keepId
        ));

        $this->deleteMetadataRows($deleteIds);
    }

    /**
     * @param array<int, array<string, mixed>> $rows
     */
    private function statusForCurrentAlt(mixed $currentAlt, array $rows): int
    {
        if (trim((string) $currentAlt) === '') {
            return AltPilotMetadata::STATUS_MISSING;
        }

        $bestStatus = AltPilotMetadata::STATUS_MISSING;
        foreach ($rows as $row) {
            $status = (int) $row['status'];
            if ($status === AltPilotMetadata::STATUS_MANUAL) {
                return AltPilotMetadata::STATUS_MANUAL;
            }
            if ($status === AltPilotMetadata::STATUS_AI_GENERATED) {
                $bestStatus = AltPilotMetadata::STATUS_AI_GENERATED;
            }
        }

        return $bestStatus === AltPilotMetadata::STATUS_MISSING
            ? AltPilotMetadata::STATUS_MANUAL
            : $bestStatus;
    }

    /**
     * @param array<int, array<string, mixed>> $rows
     * @return array<string, mixed>
     */
    private function selectRowToKeep(array $rows, int $currentVolumeId): array
    {
        foreach ($rows as $row) {
            if ((int) $row['volumeId'] === $currentVolumeId) {
                return $row;
            }
        }

        return $rows[0];
    }

    /**
     * @param int[] $ids
     */
    private function deleteMetadataRows(array $ids): void
    {
        if ($ids === []) {
            return;
        }

        $this->delete(DatabaseService::TABLE_NAME, ['id' => $ids]);
    }
}
