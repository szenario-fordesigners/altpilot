import { createGlobalState } from '@vueuse/core';
import { computed, ref } from 'vue';
import { apiClient } from '@/utils/apiClient';

type StatusCountsResponse = {
  counts: Record<string, number> | Record<number, number>;
  total: number;
};

const DEFAULT_STATUS_ORDER = [0, 1, 2] as const;

const useStatusCountsState = createGlobalState(() => {
  const statusCounts = ref<Record<number, number>>({ 0: 0, 1: 0, 2: 0 });
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchStatusCounts = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await apiClient.get<StatusCountsResponse>(
        '/actions/altpilot/web/get-status-counts',
      );

      const countsPayloadEntries = Object.entries(data.counts ?? {}).reduce<Record<string, number>>(
        (acc, [status, count]) => {
          acc[status] = Number(count);
          return acc;
        },
        {},
      );

      statusCounts.value = DEFAULT_STATUS_ORDER.reduce<Record<number, number>>((acc, code) => {
        acc[code] = countsPayloadEntries[String(code)] ?? 0;
        return acc;
      }, {});

      total.value =
        typeof data.total === 'number'
          ? data.total
          : DEFAULT_STATUS_ORDER.reduce<number>(
              (sum, code) => sum + (statusCounts.value[code] ?? 0),
              0,
            );
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      statusCounts.value = { 0: 0, 1: 0, 2: 0 };
      total.value = 0;
    } finally {
      loading.value = false;
    }
  };

  return {
    missingCount: computed(() => statusCounts.value[0] ?? 0),
    aiGeneratedCount: computed(() => statusCounts.value[1] ?? 0),
    manualCount: computed(() => statusCounts.value[2] ?? 0),
    total,
    loading,
    error,
    fetchStatusCounts,
  };
});

export const useStatusCounts = () => useStatusCountsState();
