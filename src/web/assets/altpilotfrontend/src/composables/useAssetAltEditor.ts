import { computed, reactive, ref } from 'vue';
import type { Asset, MultiLanguageAsset } from '@/types/Asset';
import { apiClient } from '@/utils/apiClient';

type AltTextMap = Record<number, string>;

function buildInitialAltMap(asset: MultiLanguageAsset): AltTextMap {
  const map: AltTextMap = {};
  Object.values(asset).forEach((localized: Asset) => {
    map[localized.siteId] = localized.alt ?? '';
  });
  return map;
}

export function useAssetAltEditor(asset: MultiLanguageAsset) {
  const altTexts = reactive<AltTextMap>(buildInitialAltMap(asset));
  const originalAltTexts = reactive<AltTextMap>(buildInitialAltMap(asset));

  const saving = ref(false);
  const error = ref<string | null>(null);
  const successMessage = ref<string | null>(null);

  const hasChanges = computed(() => {
    const keys = new Set([...Object.keys(originalAltTexts), ...Object.keys(altTexts)]);
    for (const key of keys) {
      const siteId = Number(key);
      if ((altTexts[siteId] ?? '') !== (originalAltTexts[siteId] ?? '')) {
        return true;
      }
    }
    return false;
  });

  const normalizeAltTexts = (): Record<number, string> => {
    const normalized: Record<number, string> = {};
    Object.entries(altTexts).forEach(([siteIdString, value]) => {
      normalized[Number(siteIdString)] = value.trim();
    });
    return normalized;
  };

  const save = async () => {
    if (!hasChanges.value || saving.value) {
      return;
    }

    saving.value = true;
    error.value = null;
    successMessage.value = null;

    const anyAsset = Object.values(asset)[0];
    const assetId = anyAsset?.id;
    if (!assetId) {
      error.value = 'Asset ID missing';
      saving.value = false;
      return;
    }

    try {
      const payload = {
        assetID: assetId,
        altTexts: normalizeAltTexts(),
      };

      const { data } = await apiClient.postJson('/actions/alt-pilot/web/save-alt-texts', payload);

      if (!data) {
        throw new Error('Failed to save alt texts');
      }

      Object.entries(altTexts).forEach(([siteIdString, value]) => {
        const siteId = Number(siteIdString);
        originalAltTexts[siteId] = value;
      });

      successMessage.value = 'Alt texts saved';
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      saving.value = false;
    }
  };

  return {
    altTexts,
    hasChanges,
    saving,
    error,
    successMessage,
    save,
  };
}
