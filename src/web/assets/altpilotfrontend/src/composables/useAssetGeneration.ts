import { reactive, ref } from 'vue';
import { useGlobalState } from '@/composables/useGlobalState';
import { useGenerationTracker } from '@/composables/useGenerationTracker';
import type { MultiLanguageAsset } from '@/types/Asset';
import { apiClient } from '@/utils/apiClient';
import { useToasts } from '@/composables/useToasts';

const HIDDEN_IFRAME_REMOVE_DELAY = 1000;

type QueueResponse = {
  jobId: string | null;
  queueStatus: string | null;
};

export function useAssetGeneration(asset: MultiLanguageAsset) {
  const { csrfToken, cpTrigger } = useGlobalState();
  const { trackAsset, stateForAsset, isAssetRunning } = useGenerationTracker();
  const { toast } = useToasts();

  const generatingBySite = reactive<Record<number, boolean>>({});
  const errorBySite = reactive<Record<number, string | null>>({});
  const successBySite = reactive<Record<number, string | null>>({});

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

  const generateForSite = async (siteId: number) => {
    if (!csrfToken.value) {
      const msg = 'CSRF token not available';
      errorBySite[siteId] = msg;
      toast({
        title: 'Error',
        description: msg,
        type: 'foreground',
      });
      return;
    }

    if (generatingBySite[siteId]) {
      return;
    }

    generatingBySite[siteId] = true;
    errorBySite[siteId] = null;
    successBySite[siteId] = null;

    try {
      const payload: Record<string, string> = {
        assetID: asset[siteId]!.id.toString(),
        siteId: siteId.toString(),
      };

      const { data, message } = await apiClient.postJson<QueueResponse>(
        '/actions/alt-pilot/web/queue',
        payload,
      );

      const msg = message || 'Alt text generation queued successfully';
      successBySite[siteId] = msg;

      toast({
        title: 'Queued',
        description: msg,
        type: 'foreground',
      });

      trackAsset({
        assetId: asset[siteId]!.id,
        siteId,
        jobId: data.jobId ?? null,
        message,
      });

      triggerQueueRunner();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      errorBySite[siteId] = msg;
      toast({
        title: 'Error',
        description: msg,
        type: 'foreground',
      });
    } finally {
      generatingBySite[siteId] = false;
    }
  };

  const isGenerationActive = (siteId: number) =>
    isAssetRunning(asset[siteId]!.id, siteId) || !!generatingBySite[siteId];

  const generationMessage = (siteId: number) =>
    stateForAsset(asset[siteId]!.id, siteId)?.message ?? null;

  return {
    generateForSite,
    generatingBySite,
    errorBySite,
    successBySite,
    isGenerationActive,
    generationMessage,
  };
}
