<script setup lang="ts">
import { useGlobalState } from '../composables/useGlobalState';

const { asset } = defineProps<{
  asset: Asset;
  cpTrigger: string;
}>();

const { csrfToken } = useGlobalState();
</script>

<template>
  <div class="flex h-full flex-col gap-2 border-2 border-black bg-white p-4">
    <img class="aspect-[4/3] w-full rounded object-cover" :src="asset.url" :alt="asset.title" />
    <div class="mt-auto">
      <h3 class="text-lg font-medium">{{ asset.title }}</h3>
      <textarea class="w-full border" :value="asset.alt ?? ''" />
    </div>
    <div class="flex gap-2">
      <button class="button">Generate</button>
      <button class="button">Save</button>
      <a class="button" :href="`${cpTrigger}/assets/edit/${asset.id}`" target="_blank"
        >Control Panel</a
      >
    </div>
  </div>
</template>

<style scoped>
.button {
  border: 1px solid black;
  padding: 0.125rem 0.25rem;

  text-decoration: none;
}
</style>
