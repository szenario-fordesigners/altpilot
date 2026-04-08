<?php

namespace szenario\craftaltpilot\helpers;

/**
 * Pure helper functions for plugin settings. No state, no side effects.
 */
final class SettingsHelper
{
    /**
     * Normalize a volume ID setting value into a sorted array of integers.
     * Handles null, empty string, single values, and arrays.
     * Used by Settings::beforeValidate(), SettingsEvents, DatabaseService, and AssetEvents.
     *
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
