import { createGlobalState } from '@vueuse/core';
import { ref } from 'vue';
import { apiClient } from '@/utils/apiClient';
import type { Asset, AssetsByAssetId } from '@/types/Asset';

type FetchAssetsOptions = {
  limit?: number;
  offset?: number;
  sort?: string;
  query?: string;
  filter?: string;
};

type PaginationInfo = {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
};

type AssetsResponse = {
  assets: AssetsByAssetId;
  assetIds: number[];
  pagination: PaginationInfo | null;
};

type UseAssetsOptions = {
  defaultLimit?: number;
  defaultOffset?: number;
  defaultSort?: string;
  defaultQuery?: string;
  defaultFilter?: string;
};

const useAssetsState = createGlobalState(() => {
  const assets = ref<AssetsByAssetId>({});
  const assetIds = ref<number[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<PaginationInfo | null>(null);
  const defaultLimit = ref(20);
  const defaultOffset = ref(0);
  const defaultSort = ref('dateCreated');
  const defaultQuery = ref('');
  const defaultFilter = ref('all');

  const setDefaults = (
    limit?: number,
    offset?: number,
    sort?: string,
    query?: string,
    filter?: string,
  ) => {
    if (typeof limit === 'number') {
      defaultLimit.value = limit;
    }
    if (typeof offset === 'number') {
      defaultOffset.value = offset;
    }
    if (typeof sort === 'string') {
      defaultSort.value = sort;
    }
    if (typeof query === 'string') {
      defaultQuery.value = query;
    }
    if (typeof filter === 'string') {
      defaultFilter.value = filter;
    }
  };

  const fetchAssets = async (options: FetchAssetsOptions = {}) => {
    const limit = options.limit ?? defaultLimit.value;
    const offset = options.offset ?? defaultOffset.value;
    const sort = options.sort ?? defaultSort.value;
    const query = options.query ?? defaultQuery.value;
    const filter = options.filter ?? defaultFilter.value;

    loading.value = true;
    error.value = null;

    try {
      const { data } = await apiClient.get<AssetsResponse>(
        `/actions/altpilot/web/get-all-assets?limit=${limit}&offset=${offset}&sort=${sort}&filter=${filter}&query=${encodeURIComponent(
          query,
        )}&siteId=all`,
      );
      assets.value = data.assets ?? {};
      assetIds.value = data.assetIds ?? [];
      pagination.value = data.pagination ?? null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      assets.value = {};
      assetIds.value = [];
      pagination.value = null;
    } finally {
      loading.value = false;
    }
  };

  const replaceAsset = (updatedAsset: Asset) => {
    const assetId = updatedAsset.id;
    const siteId = updatedAsset.siteId;

    if (siteId == null) {
      return;
    }

    // Check if the asset exists in the assets object
    if (!assets.value[assetId]) {
      return;
    }

    // Update the specific site's asset within the MultiLanguageAsset
    assets.value[assetId][siteId] = updatedAsset;
  };

  return {
    assets,
    assetIds,
    loading,
    error,
    pagination,
    sort: defaultSort,
    query: defaultQuery,
    filter: defaultFilter,
    fetchAssets,
    setDefaults,
    replaceAsset,
  };
});

export function useAssets(options?: UseAssetsOptions) {
  const state = useAssetsState();
  if (options) {
    state.setDefaults(
      options.defaultLimit,
      options.defaultOffset,
      options.defaultSort,
      options.defaultQuery,
      options.defaultFilter,
    );
  }
  return state;
}
