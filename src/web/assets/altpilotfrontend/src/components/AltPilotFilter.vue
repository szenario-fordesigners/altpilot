<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useAssets } from '@/composables/useAssets';

const { sort, fetchAssets, query, filter, pagination } = useAssets();

const searchQuery = ref(query.value || '');
// filter is now handled by useAssets

const debouncedSearch = useDebounceFn((val: string) => {
  query.value = val;
  fetchAssets({ offset: 0 });
}, 400);

watch(searchQuery, (newVal) => {
  debouncedSearch(newVal);
});

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'missing', label: 'Missing' },
  { value: 'manual', label: 'Manual' },
  { value: 'ai-generated', label: 'AI Generated' },
];

const setFilter = (value: string) => {
  if (filter.value === value) return;
  filter.value = value;
  fetchAssets({ offset: 0 });
};

const sortOptions = [
  { value: 'dateUpdated', label: 'Last edited' },
  { value: 'dateCreated', label: 'Image: last uploaded' },
  { value: 'filename', label: 'Image: filename' },
];

const setSort = (value: string) => {
  if (sort.value === value) return;
  sort.value = value;
  // Reset pagination to page 1 (offset 0) when sorting changes
  fetchAssets({ offset: 0 });
};

const clearSearch = () => {
  searchQuery.value = '';
};
</script>

<template>
  <div class="my-4 grid grid-cols-4 gap-4">
    <div>
      <h3 class="mb-1">Filter</h3>
      <ul class="space-y-0">
        <li v-for="option in filterOptions" :key="option.value">
          <button
            @click="setFilter(option.value)"
            class="w-full text-left text-sm"
            :class="filter === option.value ? 'underline' : ''"
          >
            {{ option.label }}
          </button>
        </li>
      </ul>
    </div>
    <div class="flex flex-col items-start">
      <h3 class="mb-1">Sorting</h3>
      <ul class="space-y-0">
        <li v-for="option in sortOptions" :key="option.value">
          <button
            @click="setSort(option.value)"
            class="w-full text-left text-sm"
            :class="sort === option.value ? 'underline' : ''"
          >
            {{ option.label }}
          </button>
        </li>
      </ul>
    </div>

    <div class="col-span-2">
      <div class="relative w-full">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            class="h-6 w-6"
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
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="block w-full rounded-xl border border-black p-4 pr-10 pl-10 focus:outline-none"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Clear search"
        >
          <svg
            class="h-5 w-5"
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
      <div v-if="query && pagination?.total !== undefined" class="mt-2 text-sm text-gray-600">
        {{ pagination.total }} result{{ pagination.total === 1 ? '' : 's' }} found
      </div>
    </div>
  </div>
</template>
