import { createGlobalState } from '@vueuse/core';
import { computed, ref } from 'vue';
import { apiClient } from '@/utils/apiClient';

export type StatusCount = {
  status: number;
  count: number;
};

type StatusCountsResponse = {
  counts: StatusCount[];
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

const useStatusCountsState = createGlobalState(() => {
  const statusCounts = ref<StatusCount[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchStatusCounts = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await apiClient.get<StatusCountsResponse>(
        '/actions/alt-pilot/web/get-status-counts',
      );

      statusCounts.value = Array.isArray(data.counts)
        ? data.counts.map((item) => ({
            status: Number(item.status),
            count: Number(item.count),
          }))
        : [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      statusCounts.value = [];
    } finally {
      loading.value = false;
    }
  };

  const refetchStatusCounts = () => fetchStatusCounts();
  const statusCountItems = computed<StatusCountItem[]>(() => {
    const entries = statusCounts.value.map(({ status, count }) => ({
      code: status,
      label: STATUS_LABELS[status] ?? `Status ${status}`,
      count,
    }));

    return entries.sort((a, b) => a.code - b.code);
  });

  return {
    statusCounts,
    loading,
    error,
    fetchStatusCounts,
    refetchStatusCounts,
    statusCountItems,
  };
});

export const useStatusCounts = () => useStatusCountsState();
