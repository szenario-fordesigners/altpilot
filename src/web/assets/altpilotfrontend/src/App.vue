<script setup lang="ts">
import { onMounted } from 'vue';
import { useAssets } from './composables/useAssets';
import AssetCard from './components/AssetCard.vue';
import AssetPagination from './components/AssetPagination.vue';

const { cpTrigger } = defineProps<{
  cpTrigger: string;
}>();

const { assets, loading, error, pagination, fetchAssets } = useAssets();

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
    <p v-if="loading">Loading assets…</p>
    <p v-else-if="error" class="text-red-500">Failed to load assets: {{ error }}</p>

    <template v-else>
      <div
        class="grid auto-rows-fr [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] gap-4"
      >
        <div v-for="asset in assets" :key="asset.id" class="h-full">
          <AssetCard :asset="asset" :cpTrigger="cpTrigger" />
        </div>
      </div>

      <AssetPagination :pagination="pagination" @previous="handlePrevious" @next="handleNext" />
    </template>
  </div>
</template>
