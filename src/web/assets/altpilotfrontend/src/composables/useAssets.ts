import { ref } from 'vue';

type FetchAssetsOptions = {
  limit?: number;
  offset?: number;
};

type PaginationInfo = {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
};

export function useAssets(defaultLimit = 20, defaultOffset = 0) {
  const assets = ref<Asset[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<PaginationInfo | null>(null);

  const fetchAssets = async (options: FetchAssetsOptions = {}) => {
    const limit = options.limit ?? defaultLimit;
    const offset = options.offset ?? defaultOffset;

    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(
        `/actions/alt-pilot/web/get-assets?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      assets.value = data.assets ?? [];
      pagination.value = data.pagination ?? null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      assets.value = [];
      pagination.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    assets,
    loading,
    error,
    pagination,
    fetchAssets,
  };
}
