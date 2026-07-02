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

export const useAssets = createGlobalState(() => {
  const assets = ref<AssetsByAssetId>({});
  const assetIds = ref<number[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<PaginationInfo | null>(null);
  const defaultLimit = ref(36);
  const sort = ref('dateCreated');
  const query = ref('');
  const filter = ref('all');

  const fetchAssets = async (options: FetchAssetsOptions = {}) => {
    const limit = options.limit ?? defaultLimit.value;
    const offset = options.offset ?? 0;
    const sortValue = options.sort ?? sort.value;
    const queryValue = options.query ?? query.value;
    const filterValue = options.filter ?? filter.value;

    loading.value = true;
    error.value = null;

    try {
      const { data } = await apiClient.get<AssetsResponse>(
        `/actions/altpilot/web/get-all-assets?limit=${limit}&offset=${offset}&sort=${sortValue}&filter=${filterValue}&query=${encodeURIComponent(
          queryValue,
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

    // Only update if the asset exists in the assets object
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
    sort,
    query,
    filter,
    fetchAssets,
    replaceAsset,
  };
});
