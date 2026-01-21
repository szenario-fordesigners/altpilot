<?php

namespace szenario\craftaltpilot\helpers;

final class SettingsHelper
{
    public static function calculateSettingsDiff(array $old, array $new): array
    {
        $diff = [];
        $keys = array_unique(array_merge(array_keys($old), array_keys($new)));

        foreach ($keys as $key) {
            $oldValue = $old[$key] ?? null;
            $newValue = $new[$key] ?? null;

            if (is_array($oldValue) && is_array($newValue)) {
                $nestedDiff = self::calculateSettingsDiff($oldValue, $newValue);
                if ($nestedDiff !== []) {
                    $diff[$key] = $nestedDiff;
                }
                continue;
            }

            if ($oldValue !== $newValue) {
                $diff[$key] = [
                    'old' => $oldValue,
                    'new' => $newValue,
                ];
            }
        }

        return $diff;
    }

    /**
     * @param mixed $rawVolumeIds
     * @return int[]
     */
    public static function normalizeVolumeIds(mixed $rawVolumeIds): array
    {
        if ($rawVolumeIds === null || $rawVolumeIds === '' || $rawVolumeIds === []) {
            return [];
        }

        $ids = is_array($rawVolumeIds) ? $rawVolumeIds : [$rawVolumeIds];
        $ids = array_map(static fn($id) => (int) $id, $ids);
        sort($ids);

        return array_values($ids);
    }
}
