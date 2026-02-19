<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
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
  <div class="relative">
    <input
      v-model="searchQuery"
      type="text"
      class="block h-12 w-full rounded-full border border-ap-dark-green pr-12 pl-12 text-xl text-ap-dark-green transition-colors focus:bg-ap-light-green/30 focus:ring-0 focus:ring-ap-dark-green focus:outline-none"
    />

    <div class="pointer-events-none absolute inset-y-0 left-3 flex items-center">
      <svg
        class="h-6 w-6 text-ap-dark-green"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
        />
      </svg>
    </div>

    <button
      v-if="searchQuery"
      @click="clearSearch"
      type="button"
      class="absolute inset-y-0 right-3 flex items-center p-1 text-ap-dark-green hover:text-ap-dark-green/80"
      aria-label="Clear search"
    >
      <svg
        class="h-4 w-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
    </button>
  </div>
</template>
