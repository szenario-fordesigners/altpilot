import { createGlobalState } from '@vueuse/core';
import { computed, ref } from 'vue';
import { apiClient } from '@/utils/apiClient';

export type StatusCount = {
  status: number;
  count: number;
};

type StatusCountsResponse = {
  counts: Record<string, number> | Record<number, number>;
  total: number;
};

type StatusCountItem = {
  code: number;
  label: string;
  count: number;
};

// Keep these labels in sync with the backend constants defined in AltPilotMetadata.
const STATUS_LABELS: Record<number, string> = {
  0: 'Missing alt text',
  1: 'AI-generated',
  2: 'Manual',
};

const DEFAULT_STATUS_ORDER = [0, 1, 2] as const;
type StatusCode = (typeof DEFAULT_STATUS_ORDER)[number];

const useStatusCountsState = createGlobalState(() => {
  const statusCounts = ref<Record<number, number>>(
    DEFAULT_STATUS_ORDER.reduce<Record<number, number>>((acc, code) => {
      acc[code] = 0;
      return acc;
    }, {}),
  );
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchStatusCounts = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await apiClient.get<StatusCountsResponse>(
        '/actions/alt-pilot/web/get-status-counts',
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
      statusCounts.value = DEFAULT_STATUS_ORDER.reduce<Record<number, number>>((acc, code) => {
        acc[code] = 0;
        return acc;
      }, {});
      total.value = 0;
    } finally {
      loading.value = false;
    }
  };

  const refetchStatusCounts = () => fetchStatusCounts();
  const statusCountItems = computed<StatusCountItem[]>(() =>
    DEFAULT_STATUS_ORDER.map((code) => ({
      code,
      label: STATUS_LABELS[code] ?? `Status ${code}`,
      count: statusCounts.value[code] ?? 0,
    })),
  );

  return {
    statusCounts,
    missingCount: computed(() => statusCounts.value[0] ?? 0),
    aiGeneratedCount: computed(() => statusCounts.value[1] ?? 0),
    manualCount: computed(() => statusCounts.value[2] ?? 0),
    total,
    loading,
    error,
    fetchStatusCounts,
    refetchStatusCounts,
    statusCountItems,
  };
});

export const useStatusCounts = () => useStatusCountsState();
