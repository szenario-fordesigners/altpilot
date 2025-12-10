<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAssets } from '@/composables/useAssets';
import { useGlobalState } from '@/composables/useGlobalState';
import { useStatusCounts } from '@/composables/useStatusCounts';
import AssetCard from '@/components/AssetCard.vue';
import AssetCardSkeleton from '@/components/AssetCardSkeleton.vue';
import AssetPagination from '@/components/AssetPagination.vue';
import AltPilotStats from '@/components/AltPilotStats.vue';
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
    state.selectedSiteId: {{ state.selectedSiteId.value }}

    <p v-if="error" class="text-red-500">Failed to load assets: {{ error }}</p>

    <template v-else>
      <div class="border border-red-500"></div>
      <!-- v-model="state.selectedSiteId"  -->
      <select
        class="border border-green-500"
        @change="
          (event) =>
            (state.selectedSiteId.value = parseInt((event.target as HTMLSelectElement).value))
        "
      >
        <option v-for="site in sites" :key="site.id" :value="site.id">
          {{ site.name }} ({{ site.language }})
        </option>
      </select>

      <section class="my-4 space-y-2 rounded border border-gray-200 p-4">
        <div class="flex items-center justify-between gap-2">
          <p class="text-sm font-semibold tracking-wide text-gray-700 uppercase">Status overview</p>
          <button
            type="button"
            class="text-xs font-semibold tracking-wide text-blue-600 uppercase disabled:text-gray-400"
            :disabled="statusCountsLoading"
            @click="refetchStatusCounts"
          >
            Refresh
          </button>
        </div>

        <p v-if="statusCountsError" class="text-sm text-red-500">
          Failed to load status counts: {{ statusCountsError }}
        </p>
        <p v-else-if="statusCountsLoading" class="text-sm text-gray-500">Loading status counts…</p>
        <p v-else-if="!hasStatusCounts" class="text-sm text-gray-500">No status data yet.</p>
        <ul v-else class="flex flex-wrap gap-2 text-sm">
          <li
            v-for="item in statusCountItems"
            :key="item.code"
            class="rounded border border-gray-200 px-3 py-1"
          >
            {{ item.label }}: {{ item.count }}
          </li>
        </ul>
      </section>

      <div
        class="grid auto-rows-fr [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] gap-4"
      >
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
    </template>
  </div>
</template>
