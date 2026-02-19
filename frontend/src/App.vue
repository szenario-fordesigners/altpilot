<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useAssets } from '@/composables/useAssets';
import { useGlobalState } from '@/composables/useGlobalState';
import { useStatusCounts } from '@/composables/useStatusCounts';
import AssetCard from '@/components/AssetCard.vue';
import AssetLightbox from '@/components/AssetLightbox.vue';
import AssetCardSkeleton from '@/components/AssetCardSkeleton.vue';
import AssetPagination from '@/components/AssetPagination.vue';
import AltPilotHeader from '@/components/AltPilotHeader.vue';
import Toaster from '@/components/AltPilotToaster.vue';
import type { Site } from '@/types/Site';

const { cpTrigger, csrfToken, sites, primarySiteId, hasSelectedVolumes } = defineProps<{
  cpTrigger: string;
  csrfToken: { name: string; value: string };
  sites: Site[];
  primarySiteId: number;
  hasSelectedVolumes: boolean;
}>();

const state = useGlobalState();
const { fetchAssets, query } = useAssets();

// Check for query param in URL (e.g. from deep link)
const urlParams = new URLSearchParams(window.location.search);
const queryParam = urlParams.get('query');
if (queryParam) {
  query.value = queryParam;
}

// set the csrf token and cp trigger in the global state
state.csrfToken.value = csrfToken;
state.cpTrigger.value = cpTrigger;
state.sites.value = sites;
state.primarySiteId.value = primarySiteId;
state.hasSelectedVolumes.value = hasSelectedVolumes;

const ASSET_CARD_LIMIT = 36;
const { assets, assetIds, loading, pagination } = useAssets({
  defaultLimit: ASSET_CARD_LIMIT,
});
const { fetchStatusCounts } = useStatusCounts();
const showLoading = computed(() => loading.value);

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
    <div
      v-if="!hasSelectedVolumes"
      class="mb-6 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-800"
    >
      <p>
        No volumes selected. Please configure the
        <a
          :href="`/${cpTrigger}/settings/plugins/altpilot`"
          class="font-bold underline hover:text-yellow-900"
          >settings</a
        >.
      </p>
    </div>

    <AltPilotHeader />

    <div class="relative">
      <Transition name="asset-grid-fade">
        <div
          v-if="showLoading"
          key="loading"
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6"
        >
          <div v-for="i in ASSET_CARD_LIMIT" :key="`skeleton-${i}`" class="h-full">
            <AssetCardSkeleton />
          </div>
        </div>
        <div
          v-else
          key="loaded"
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6"
        >
          <div v-for="id in assetIds" :key="id" class="h-full">
            <AssetCard v-if="assets[id]" :asset="assets[id]" @click-image="openLightbox" />
          </div>
        </div>
      </Transition>
    </div>

    <AssetPagination
      v-if="!showLoading"
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

<style scoped>
.asset-grid-fade-enter-active,
.asset-grid-fade-leave-active {
  transition: opacity 220ms ease-in-out;
}

.asset-grid-fade-leave-active {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.asset-grid-fade-enter-from,
.asset-grid-fade-leave-to {
  opacity: 0;
}
</style>
