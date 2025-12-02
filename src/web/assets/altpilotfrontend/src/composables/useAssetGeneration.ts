import { computed, type Ref, ref, watch } from 'vue';
import { useGlobalState } from './useGlobalState';
import { useGenerationTracker } from './useGenerationTracker';
import type { Asset, MultiLanguageAsset } from '../types/Asset';

const HIDDEN_IFRAME_REMOVE_DELAY = 1000;

export function useAssetGeneration(asset: MultiLanguageAsset, thisSelectedSiteId: Ref<number>) {
  const { csrfToken, cpTrigger } = useGlobalState();
  const { trackAsset, stateForAsset, isAssetRunning } = useGenerationTracker();
  const currentAsset = computed(() => asset[thisSelectedSiteId.value] as Asset);

  const generating = ref(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);

  const generationState = computed(() =>
    stateForAsset(currentAsset.value.id, currentAsset.value.siteId ?? null),
  );
  const isGenerationActive = computed(() =>
    isAssetRunning(currentAsset.value.id, currentAsset.value.siteId ?? null),
  );
  const generationMessage = computed(() => generationState.value?.message ?? null);

  // Clear success message when generation finishes (state is deleted or status is finished)
  watch([generationState, isGenerationActive], ([state, active]) => {
    if (!active && (state === null || state?.status === 'finished')) {
      success.value = null;
    }
  });

  const triggerQueueRunner = () => {
    if (!cpTrigger.value) {
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.src = cpTrigger.value;
    document.body.appendChild(iframe);

    setTimeout(() => {
      if (iframe.parentNode) {
        document.body.removeChild(iframe);
      }
    }, HIDDEN_IFRAME_REMOVE_DELAY);
  };

  const generate = async () => {
    if (!csrfToken.value) {
      error.value = 'CSRF token not available';
      return;
    }

    generating.value = true;
    error.value = null;
    success.value = null;

    try {
      const payload: Record<string, string> = {
        assetID: currentAsset.value.id.toString(),
        siteId: thisSelectedSiteId.value.toString(),
        [csrfToken.value.name]: csrfToken.value.value,
      };

      const response = await fetch('/actions/alt-pilot/web/queue', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to queue generation' }));
        throw new Error(
          errorData.error || errorData.message || `Request failed with status ${response.status}`,
        );
      }

      const data = await response.json();
      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to queue generation');
      }

      success.value = data.message || 'Alt text generation queued successfully';
      trackAsset({
        assetId: currentAsset.value.id,
        siteId: currentAsset.value.siteId ?? null,
        jobId: data.jobId ?? null,
        message: data.message ?? null,
      });

      triggerQueueRunner();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      generating.value = false;
    }
  };

  return {
    generating,
    error,
    success,
    generationMessage,
    isGenerationActive,
    generate,
  };
}
