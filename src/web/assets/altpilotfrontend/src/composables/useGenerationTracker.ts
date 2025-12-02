import { createGlobalState, useIntervalFn } from '@vueuse/core';
import { reactive, ref, watch } from 'vue';
import { useAssets } from './useAssets';
import { useGlobalState } from './useGlobalState';
import type { Asset } from '../types/Asset';

type GenerationStatus = 'waiting' | 'running' | 'finished' | 'failed' | 'missing' | 'unknown';

type TrackedAsset = {
  assetId: number;
  siteId: number | null;
  jobId: string | null;
  status: GenerationStatus;
  message: string | null;
};

type StatusResponse = {
  assetId: number;
  siteId: number | null;
  jobId?: string | null;
  status?: GenerationStatus;
  message?: string | null;
  asset?: Asset | null;
  progress?: number | null;
};

const ASSET_KEY_SEPARATOR = ':';
const makeKey = (assetId: number, siteId?: number | null) =>
  `${assetId}${ASSET_KEY_SEPARATOR}${siteId ?? 'default'}`;

const ACTIVE_STATUSES: GenerationStatus[] = ['waiting', 'running'];

const queuePollInterval = 1000;

export const useGenerationTracker = createGlobalState(() => {
  const trackedAssets = reactive(new Map<string, TrackedAsset>());
  const lastError = ref<string | null>(null);
  const { csrfToken } = useGlobalState();
  const { replaceAsset } = useAssets();

  const pollQueue = async () => {
    if (!csrfToken.value) {
      return;
    }

    const activeEntries = Array.from(trackedAssets.values()).filter((entry) =>
      ACTIVE_STATUSES.includes(entry.status),
    );

    if (activeEntries.length === 0) {
      return;
    }

    const payload: Record<string, unknown> = {
      assets: activeEntries.map((entry) => ({
        assetId: entry.assetId,
        siteId: entry.siteId,
        jobId: entry.jobId,
      })),
      [csrfToken.value.name]: csrfToken.value.value,
    };

    try {
      const response = await fetch('/actions/alt-pilot/web/job-status', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const assets = (data?.assets ?? []) as StatusResponse[];

      assets.forEach((item) => {
        const key = makeKey(item.assetId, item.siteId ?? null);
        const existing = trackedAssets.get(key);

        if (item.status === 'finished' && item.asset) {
          replaceAsset(item.asset as Asset);
          const message = item.message ?? 'Alt text updated';
          if (existing) {
            existing.status = 'finished';
            existing.message = message;
          } else {
            trackedAssets.set(key, {
              assetId: item.assetId,
              siteId: item.siteId ?? null,
              jobId: item.jobId ?? null,
              status: 'finished',
              message,
            });
          }
          setTimeout(() => {
            trackedAssets.delete(key);
          }, 1500);
          return;
        }

        if (item.status === 'missing') {
          const message = item.message ?? 'Asset not found';
          if (existing) {
            existing.status = 'missing';
            existing.message = message;
          } else {
            trackedAssets.set(key, {
              assetId: item.assetId,
              siteId: item.siteId ?? null,
              jobId: item.jobId ?? null,
              status: 'missing',
              message,
            });
          }
          setTimeout(() => {
            trackedAssets.delete(key);
          }, 2500);
          return;
        }

        if (!existing) {
          trackedAssets.set(key, {
            assetId: item.assetId,
            siteId: item.siteId ?? null,
            jobId: item.jobId ?? null,
            status: item.status ?? 'unknown',
            message: item.message ?? null,
          });
          return;
        }

        existing.status = item.status ?? existing.status;
        existing.message = item.message ?? existing.message;
        existing.jobId = item.jobId ?? existing.jobId;

        if (!ACTIVE_STATUSES.includes(existing.status)) {
          // Allow consumers to show the final status message for a short time before clearing.
          setTimeout(() => {
            trackedAssets.delete(key);
          }, 1500);
        }
      });

      lastError.value = null;
    } catch (err) {
      lastError.value = err instanceof Error ? err.message : 'Unknown error';
    }
  };

  const { pause, resume } = useIntervalFn(pollQueue, queuePollInterval, { immediate: false });

  watch(
    () => trackedAssets.size,
    (size) => {
      if (size > 0) {
        resume();
      } else {
        pause();
      }
    },
    { immediate: true },
  );

  const trackAsset = (options: {
    assetId: number;
    siteId?: number | null;
    jobId?: string | null;
    message?: string | null;
  }) => {
    const key = makeKey(options.assetId, options.siteId ?? null);
    trackedAssets.set(key, {
      assetId: options.assetId,
      siteId: options.siteId ?? null,
      jobId: options.jobId ?? null,
      status: 'waiting',
      message: options.message ?? null,
    });
  };

  const clearAsset = (assetId: number, siteId?: number | null) => {
    trackedAssets.delete(makeKey(assetId, siteId ?? null));
  };

  const stateForAsset = (assetId: number, siteId?: number | null): TrackedAsset | null =>
    trackedAssets.get(makeKey(assetId, siteId ?? null)) ?? null;

  const isAssetRunning = (assetId: number, siteId?: number | null) => {
    const state = stateForAsset(assetId, siteId);
    if (!state) return false;
    return ACTIVE_STATUSES.includes(state.status);
  };

  return {
    trackAsset,
    clearAsset,
    stateForAsset,
    isAssetRunning,
    lastError,
  };
});
