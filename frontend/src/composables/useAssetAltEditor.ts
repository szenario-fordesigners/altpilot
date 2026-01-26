import { computed, reactive, ref, watch } from 'vue';
import type { Asset, MultiLanguageAsset } from '@/types/Asset';
import { apiClient } from '@/utils/apiClient';
import { useToasts } from '@/composables/useToasts';

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

  const { toast } = useToasts();

  // Watch for asset updates (e.g., when generation completes and replaceAsset is called)
  // Update altTexts when the asset's alt text changes for any site
  watch(
    () => {
      // Create a map of siteId -> alt text for comparison
      const currentAlts: Record<number, string> = {};
      Object.values(asset).forEach((localized: Asset) => {
        currentAlts[localized.siteId] = localized.alt ?? '';
      });
      return currentAlts;
    },
    (newAlts, oldAlts) => {
      // Only update if the alt text actually changed
      Object.entries(newAlts).forEach(([siteIdStr, newAlt]) => {
        const siteId = Number(siteIdStr);
        const oldAlt = oldAlts?.[siteId] ?? '';
        if (newAlt !== oldAlt) {
          // Update both altTexts and originalAltTexts to reflect the new generated value
          // This ensures the UI updates and there are no "unsaved changes" for the new generation
          altTexts[siteId] = newAlt;
          originalAltTexts[siteId] = newAlt;
        }
      });
    },
    { deep: true },
  );

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
      toast({
        title: 'Error',
        description: error.value,
        type: 'foreground',
      });
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

        // Only update if the value actually changed from the original
        if (originalAltTexts[siteId] !== value) {
          originalAltTexts[siteId] = value;

          // Update the asset status locally
          if (asset[siteId]) {
            const newStatus = value.trim() === '' ? 0 : 2; // 0 = Missing, 2 = Manual
            asset[siteId].status = newStatus;
            asset[siteId].alt = value;
          }
        }
      });

      successMessage.value = 'Alt texts saved';
      toast({
        title: 'Saved',
        description: successMessage.value,
        type: 'foreground',
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: 'Error',
        description: error.value,
        type: 'foreground',
      });
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
