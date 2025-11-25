<script setup lang="ts">
import { onMounted } from 'vue';
import { useAssets } from './composables/useAssets';
import AssetCard from './components/AssetCard.vue';

const { cpTrigger } = defineProps<{
  cpTrigger: string;
}>();

const { assets, loading, error, fetchAssets } = useAssets();

onMounted(() => {
  fetchAssets();
});
</script>

<template>
  <div id="altPilotWrapper">
    <p v-if="loading">Loading assets…</p>
    <p v-else-if="error" class="text-red-500">Failed to load assets: {{ error }}</p>

    <div
      v-else
      class="grid auto-rows-fr [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] gap-4"
    >
      <div v-for="asset in assets" :key="asset.id" class="h-full">
        <AssetCard :asset="asset" :cpTrigger="cpTrigger" />
      </div>
    </div>
  </div>
</template>
