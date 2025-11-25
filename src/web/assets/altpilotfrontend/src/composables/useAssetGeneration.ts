import { computed, type Ref, ref } from 'vue';
import { useGlobalState } from './useGlobalState';
import { useGenerationTracker } from './useGenerationTracker';

const HIDDEN_IFRAME_REMOVE_DELAY = 1000;

export function useAssetGeneration(assetRef: Ref<Asset>) {
  const { csrfToken, cpTrigger } = useGlobalState();
  const { trackAsset, stateForAsset, isAssetRunning } = useGenerationTracker();

  const generating = ref(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);

  const generationState = computed(() =>
    stateForAsset(assetRef.value.id, assetRef.value.siteId ?? null),
  );
  const isGenerationActive = computed(() =>
    isAssetRunning(assetRef.value.id, assetRef.value.siteId ?? null),
  );
  const generationMessage = computed(() => generationState.value?.message ?? null);

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
      document.body.removeChild(iframe);
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
        assetID: assetRef.value.id.toString(),
      };

      if (assetRef.value.siteId) {
        payload.siteId = assetRef.value.siteId.toString();
      }

      payload[csrfToken.value.name] = csrfToken.value.value;

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
        assetId: assetRef.value.id,
        siteId: assetRef.value.siteId ?? null,
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
