import { createGlobalState } from '@vueuse/core';
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

const useAssetsState = createGlobalState(() => {
  const assets = ref<Asset[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<PaginationInfo | null>(null);
  const defaultLimit = ref(20);
  const defaultOffset = ref(0);

  const setDefaults = (limit: number, offset: number) => {
    defaultLimit.value = limit;
    defaultOffset.value = offset;
  };

  const fetchAssets = async (options: FetchAssetsOptions = {}) => {
    const limit = options.limit ?? defaultLimit.value;
    const offset = options.offset ?? defaultOffset.value;

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
      assets.value = (data.assets ?? []) as Asset[];
      pagination.value = data.pagination ?? null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      assets.value = [];
      pagination.value = null;
    } finally {
      loading.value = false;
    }
  };

  const replaceAsset = (updatedAsset: Asset) => {
    const index = assets.value.findIndex((asset) => asset.id === updatedAsset.id);
    if (index === -1) {
      return;
    }

    assets.value.splice(index, 1, updatedAsset);
  };

  return {
    assets,
    loading,
    error,
    pagination,
    fetchAssets,
    setDefaults,
    replaceAsset,
  };
});

export function useAssets(defaultLimit = 20, defaultOffset = 0) {
  const state = useAssetsState();
  state.setDefaults(defaultLimit, defaultOffset);
  return state;
}
