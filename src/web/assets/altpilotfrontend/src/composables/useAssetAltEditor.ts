import { computed, type Ref, ref, watch } from 'vue';
import type { Asset, MultiLanguageAsset } from '@/types/Asset';
import { apiClient } from '@/utils/apiClient';

export function useAssetAltEditor(asset: MultiLanguageAsset, thisSelectedSiteId: Ref<number>) {
  const currentAsset = computed<Asset | undefined>(() => asset[thisSelectedSiteId.value]);

  const altText = ref(currentAsset.value?.alt ?? '');
  const originalAltText = ref(currentAsset.value?.alt ?? '');

  watch(
    () => currentAsset.value?.alt,
    (newAlt) => {
      altText.value = newAlt ?? '';
      originalAltText.value = newAlt ?? '';
    },
  );

  const saving = ref(false);
  const error = ref<string | null>(null);

  const hasChanges = computed(() => altText.value !== originalAltText.value);

  type SaveAssetResponse = {
    success?: boolean;
    error?: string;
    message?: string;
    errors?: Record<string, string[]>;
  };

  const save = async () => {
    if (!hasChanges.value) {
      return;
    }

    saving.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      formData.append('action', 'elements/save');
      formData.append('elementId', currentAsset.value!.id.toString());
      formData.append('siteId', thisSelectedSiteId.value.toString());
      formData.append('alt', altText.value);

      const { data } = await apiClient.postForm<SaveAssetResponse>(
        '/actions/elements/save',
        formData,
      );

      if (data?.success === false) {
        throw new Error(data.error || data.message || 'Failed to save asset');
      }

      originalAltText.value = altText.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      saving.value = false;
    }
  };

  return {
    altText,
    hasChanges,
    saving,
    error,
    save,
  };
}
