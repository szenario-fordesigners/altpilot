import { createGlobalState } from '@vueuse/core';
import { ref } from 'vue';
import { apiClient } from '@/utils/apiClient';
import type { Asset, AssetsByAssetId } from '@/types/Asset';

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

type AssetsResponse = {
  assets: AssetsByAssetId;
  pagination: PaginationInfo | null;
};

type UseAssetsOptions = {
  defaultLimit?: number;
  defaultOffset?: number;
};

const useAssetsState = createGlobalState(() => {
  const assets = ref<AssetsByAssetId>({});
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<PaginationInfo | null>(null);
  const defaultLimit = ref(20);
  const defaultOffset = ref(0);

  const setDefaults = (limit?: number, offset?: number) => {
    if (typeof limit === 'number') {
      defaultLimit.value = limit;
    }
    if (typeof offset === 'number') {
      defaultOffset.value = offset;
    }
  };

  const fetchAssets = async (options: FetchAssetsOptions = {}) => {
    const limit = options.limit ?? defaultLimit.value;
    const offset = options.offset ?? defaultOffset.value;

    loading.value = true;
    error.value = null;

    try {
      const { data } = await apiClient.get<AssetsResponse>(
        `/actions/alt-pilot/web/get-all-assets?limit=${limit}&offset=${offset}&siteId=all`,
      );
      assets.value = data.assets ?? {};
      pagination.value = data.pagination ?? null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      assets.value = {};
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
    loading,
    error,
    pagination,
    fetchAssets,
    setDefaults,
    replaceAsset,
  };
});

export function useAssets(options?: UseAssetsOptions) {
  const state = useAssetsState();
  if (options) {
    state.setDefaults(options.defaultLimit, options.defaultOffset);
  }
  return state;
}
