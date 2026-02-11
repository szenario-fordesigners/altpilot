<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import AltPilotLogo from '@/components/AltPilotLogo.vue';
import { useAssets } from '@/composables/useAssets';

const { fetchAssets, query } = useAssets();
const searchQuery = ref(query.value || '');

const debouncedSearch = useDebounceFn((val: string) => {
  query.value = val;
  fetchAssets({ offset: 0 });
}, 400);

watch(searchQuery, (newVal) => {
  debouncedSearch(newVal);
});

watch(
  () => query.value,
  (newVal) => {
    if (newVal !== searchQuery.value) {
      searchQuery.value = newVal;
    }
  },
);

const clearSearch = () => {
  searchQuery.value = '';
};
</script>

<template>
  <p class="mb-2 text-xs text-ap-dark-green">AltPilot</p>
  <div class="relative">
    <input v-model="searchQuery" type="text" placeholder="Search..."
      class="block h-12 w-full rounded-2xl border border-ap-dark-green pl-[4.75rem] pr-12 text-ap-dark-green placeholder:text-ap-dark-green/50 focus:outline-none focus:ring-1 focus:ring-ap-dark-green" />

    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center">
      <div
        class="flex h-12 w-12 items-center justify-center rounded-2xl bg-ap-light-green text-ap-dark-green border border-ap-dark-green">
        <AltPilotLogo class="h-8 w-8" />
      </div>
    </div>
    <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg class="h-6 w-6 text-ap-dark-green" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 20 20">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
      </svg>
    </div>
    <button v-if="searchQuery" @click="clearSearch" type="button"
      class="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-ap-dark-green hover:text-ap-dark-green/80"
      aria-label="Clear search">
      <svg class="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
      </svg>
    </button>
  </div>
</template>
