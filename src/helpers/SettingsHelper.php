<?php

namespace szenario\craftaltpilot\helpers;

final class SettingsHelper
{
    private const REDACTED_VALUE = '[REDACTED]';
    private const SENSITIVE_SETTING_KEYS = [
        'openAiApiKey',
    ];

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

    public static function redactSensitiveSettingsDiff(array $diff): array
    {
        return self::redactSensitiveValues($diff);
    }

    private static function redactSensitiveValues(array $values): array
    {
        foreach ($values as $key => $value) {
            if (in_array((string) $key, self::SENSITIVE_SETTING_KEYS, true)) {
                $values[$key] = self::redactEntryValue($value);
                continue;
            }

            if (is_array($value)) {
                $values[$key] = self::redactSensitiveValues($value);
            }
        }

        return $values;
    }

    private static function redactEntryValue(mixed $value): mixed
    {
        if (!is_array($value)) {
            return self::REDACTED_VALUE;
        }

        $redacted = $value;

        if (array_key_exists('old', $redacted)) {
            $redacted['old'] = self::REDACTED_VALUE;
        }

        if (array_key_exists('new', $redacted)) {
            $redacted['new'] = self::REDACTED_VALUE;
        }

        return $redacted;
    }
}
