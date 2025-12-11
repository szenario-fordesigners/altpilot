import { computed, ref, watch } from 'vue';
import { useGlobalState } from '@/composables/useGlobalState';
import { useGenerationTracker } from '@/composables/useGenerationTracker';
import type { Asset, MultiLanguageAsset } from '@/types/Asset';
import { apiClient } from '@/utils/apiClient';

const HIDDEN_IFRAME_REMOVE_DELAY = 1000;

type QueueResponse = {
  jobId: string | null;
  queueStatus: string | null;
};

export function useAssetGeneration(asset: MultiLanguageAsset) {
  const { csrfToken, cpTrigger, primarySiteId } = useGlobalState();
  const { trackAsset, stateForAsset, isAssetRunning } = useGenerationTracker();
  const currentAsset = computed(() => asset[primarySiteId.value]!);

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
    iframe.src = `/${cpTrigger.value}`;
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
        siteId: primarySiteId.value!.toString(),
      };

      const { data, message } = await apiClient.postJson<QueueResponse>(
        '/actions/alt-pilot/web/queue',
        payload,
      );

      success.value = message || 'Alt text generation queued successfully';
      trackAsset({
        assetId: currentAsset.value.id,
        siteId: currentAsset.value.siteId ?? null,
        jobId: data.jobId ?? null,
        message: message,
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
