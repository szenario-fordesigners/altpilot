<script setup lang="ts">
import { onMounted } from 'vue';
import { useAssets } from './composables/useAssets';
import { useGlobalState } from './composables/useGlobalState';
import AssetCard from './components/AssetCard.vue';
import AssetCardSkeleton from './components/AssetCardSkeleton.vue';
import AssetPagination from './components/AssetPagination.vue';

const { cpTrigger, csrfToken } = defineProps<{
  cpTrigger: string;
  csrfToken: { name: string; value: string };
}>();

const state = useGlobalState();

// set the csrf token in the global state
state.csrfToken.value = csrfToken;

const assetCardLimit = 20;
const { assets, loading, error, pagination, fetchAssets } = useAssets(assetCardLimit);

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
});
</script>

<template>
  <div id="altPilotWrapper">
    <p v-if="error" class="text-red-500">Failed to load assets: {{ error }}</p>

    <template v-else>
      <div
        class="grid auto-rows-fr [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] gap-4"
      >
        <template v-if="loading">
          <div v-for="i in assetCardLimit" :key="`skeleton-${i}`" class="h-full">
            <AssetCardSkeleton />
          </div>
        </template>
        <template v-else>
          <div v-for="asset in assets" :key="asset.id" class="h-full">
            <AssetCard :asset="asset" :cpTrigger="cpTrigger" />
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
