import { computed, type Ref, ref, watch } from 'vue';
import { useGlobalState } from './useGlobalState';

export function useAssetAltEditor(assetRef: Ref<Asset>) {
  const { csrfToken } = useGlobalState();
  const altText = ref(assetRef.value.alt ?? '');
  const originalAltText = ref(assetRef.value.alt ?? '');
  const saving = ref(false);
  const error = ref<string | null>(null);

  watch(
    () => assetRef.value.alt,
    (newAlt) => {
      const updated = newAlt ?? '';
      altText.value = updated;
      originalAltText.value = updated;
    },
  );

  const hasChanges = computed(() => altText.value !== originalAltText.value);

  const save = async () => {
    if (!csrfToken.value) {
      error.value = 'CSRF token not available';
      return;
    }

    if (!hasChanges.value) {
      return;
    }

    saving.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      formData.append('action', 'elements/save');
      formData.append('elementId', assetRef.value.id.toString());
      formData.append('alt', altText.value);
      formData.append(csrfToken.value.name, csrfToken.value.value);

      const response = await fetch('/actions/elements/save', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
        redirect: 'manual',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save asset' }));
        throw new Error(
          errorData.error || errorData.message || `Request failed with status ${response.status}`,
        );
      }

      const data = await response.json();
      if (data.success === false || (data.error && !data.id)) {
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
