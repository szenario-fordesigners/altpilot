<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useAssets } from '@/composables/useAssets';
import { useGlobalState } from '@/composables/useGlobalState';
import { useStatusCounts } from '@/composables/useStatusCounts';
import AssetCard from '@/components/AssetCard.vue';
import AssetLightbox from '@/components/AssetLightbox.vue';
import AssetCardSkeleton from '@/components/AssetCardSkeleton.vue';
import AssetPagination from '@/components/AssetPagination.vue';
import AltPilotStats from '@/components/AltPilotStats.vue';
import AltPilotFilter from '@/components/AltPilotFilter.vue';
import Toaster from '@/components/AltPilotToaster.vue';
import type { Site } from '@/types/Site';

const { cpTrigger, csrfToken, sites, primarySiteId } = defineProps<{
  cpTrigger: string;
  csrfToken: { name: string; value: string };
  sites: Site[];
  primarySiteId: number;
}>();

const state = useGlobalState();

// set the csrf token and cp trigger in the global state
state.csrfToken.value = csrfToken;
state.cpTrigger.value = cpTrigger;
state.sites.value = sites;
state.primarySiteId.value = primarySiteId;

const ASSET_CARD_LIMIT = 30;
const { assets, assetIds, loading, pagination, fetchAssets } = useAssets({
  defaultLimit: ASSET_CARD_LIMIT,
});
const { fetchStatusCounts } = useStatusCounts();

const lightboxOpen = ref(false);
const initialLightboxAssetId = ref<number | null>(null);

const openLightbox = (assetId: number) => {
  initialLightboxAssetId.value = assetId;
  lightboxOpen.value = true;
};

const handlePrevious = () => {
  if (!pagination.value) return;
  const newOffset = Math.max(0, pagination.value.offset - pagination.value.limit);
  fetchAssets({ offset: newOffset, limit: pagination.value.limit });
};

const handleNext = () => {
  if (!pagination.value) return;
  const newOffset = pagination.value.offset + pagination.value.limit;
  fetchAssets({ offset: newOffset, limit: pagination.value.limit });
};

const handlePageChange = (page: number) => {
  if (!pagination.value) return;
  const newOffset = (page - 1) * pagination.value.limit;
  fetchAssets({ offset: newOffset, limit: pagination.value.limit });
};

const sortedAssets = computed(() => {
  return assetIds.value.map((id) => assets.value[id]).filter((asset) => asset !== undefined);
});

onMounted(() => {
  fetchAssets();
  fetchStatusCounts();
});
</script>

<template>
  <div id="altPilotWrapper">
    <AltPilotStats />

    <AltPilotFilter class="mt-4" />

    <div class="grid grid-cols-4 gap-4">
      <template v-if="loading">
        <div v-for="i in ASSET_CARD_LIMIT" :key="`skeleton-${i}`" class="h-full">
          <AssetCardSkeleton />
        </div>
      </template>
      <template v-else>
        <div v-for="id in assetIds" :key="id" class="h-full">
          <AssetCard v-if="assets[id]" :asset="assets[id]" @click-image="openLightbox" />
        </div>
      </template>
    </div>

    <AssetPagination
      v-if="!loading"
      :pagination="pagination"
      @previous="handlePrevious"
      @next="handleNext"
      @page-change="handlePageChange"
    />

    <Toaster />
    <AssetLightbox
      v-model:open="lightboxOpen"
      :initial-asset-id="initialLightboxAssetId"
      :assets="sortedAssets"
      :primary-site-id="primarySiteId"
    />
  </div>
</template>
