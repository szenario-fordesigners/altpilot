<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAssets } from '@/composables/useAssets';
import { useGlobalState } from '@/composables/useGlobalState';
import { useStatusCounts } from '@/composables/useStatusCounts';
import AssetCard from '@/components/AssetCard.vue';
import AssetCardSkeleton from '@/components/AssetCardSkeleton.vue';
import AssetPagination from '@/components/AssetPagination.vue';
import AltPilotStats from '@/components/AltPilotStats.vue';
import AltPilotFilter from '@/components/AltPilotFilter.vue';
import type { Site } from '@/types/Site';

const { cpTrigger, csrfToken, sites, currentSiteId } = defineProps<{
  cpTrigger: string;
  csrfToken: { name: string; value: string };
  sites: Site[];
  currentSiteId: number;
}>();

const state = useGlobalState();

// set the csrf token and cp trigger in the global state
state.csrfToken.value = csrfToken;
state.cpTrigger.value = cpTrigger;
state.sites.value = sites;
state.currentSiteId.value = currentSiteId;
state.selectedSiteId.value = currentSiteId;

const ASSET_CARD_LIMIT = 20;
const { assets, loading, error, pagination, fetchAssets } = useAssets({
  defaultLimit: ASSET_CARD_LIMIT,
});
const {
  statusCountItems,
  loading: statusCountsLoading,
  error: statusCountsError,
  fetchStatusCounts,
  refetchStatusCounts,
} = useStatusCounts();
const hasStatusCounts = computed(() => statusCountItems.value.length > 0);

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

onMounted(() => {
  fetchAssets();
  fetchStatusCounts();
});
</script>

<template>
  <div id="altPilotWrapper">
    <AltPilotStats />

    <AltPilotFilter class="mt-4 h-20 border" />

    state.selectedSiteId: {{ state.selectedSiteId.value }}

    <select
      class=""
      @change="
        (event) =>
          (state.selectedSiteId.value = parseInt((event.target as HTMLSelectElement).value))
      "
    >
      <option v-for="site in sites" :key="site.id" :value="site.id">
        {{ site.name }} ({{ site.language }})
      </option>
    </select>

    <div class="grid auto-rows-fr [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] gap-4">
      <template v-if="loading">
        <div v-for="i in ASSET_CARD_LIMIT" :key="`skeleton-${i}`" class="h-full">
          <AssetCardSkeleton />
        </div>
      </template>
      <template v-else>
        <div
          v-for="asset in Object.values(assets)"
          :key="asset[state.selectedSiteId.value]!.id"
          class="h-full"
        >
          <AssetCard :asset="asset" />
        </div>
      </template>
    </div>

    <AssetPagination
      v-if="!loading"
      :pagination="pagination"
      @previous="handlePrevious"
      @next="handleNext"
    />
  </div>
</template>
