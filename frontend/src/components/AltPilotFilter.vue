<script setup lang="ts">
import { useAssets } from '@/composables/useAssets';
import { useGlobalState } from '@/composables/useGlobalState';
const { sites } = useGlobalState();
const { sort, fetchAssets, filter, pagination } = useAssets();

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

const onSortChange = (event: Event) => {
  const target = event.target as HTMLSelectElement | null;
  if (!target) return;
  setSort(target.value);
};
</script>

<template>
  <div class="my-4">
    <div class="grid grid-cols-1 gap-4 grid-cols-[25%_max-content_max-content] items-end">
      <div>
        <div class="text-xs text-ap-dark-green">
          showing alt-texts
        </div>
        <div class="text-base text-ap-dark-green">
          for {{ pagination?.total }} images / in {{ sites.length }} languages
        </div>
      </div>


      <div>
        <p class="mb-1 text-[12px] leading-[1.2] text-ap-dark-green">filter</p>
        <ul class="flex flex-wrap gap-2">
          <li v-for="option in filterOptions" :key="option.value">
            <button type="button" @click="setFilter(option.value)"
              class="rounded-full border border-ap-dark-green px-3 py-1 text-xs leading-none" :class="filter === option.value ? 'bg-ap-light-green text-black' : 'bg-white text-ap-dark-green'
                ">
              {{ option.label }}
            </button>
          </li>
        </ul>
      </div>

      <div class="ml-4">
        <p class="mb-1 text-[12px] leading-[1.2] text-ap-dark-green">sort by</p>
        <div class="relative">
          <select
            class="w-full appearance-none rounded-full border border-ap-dark-green py-1 pl-3 pr-8 text-xs leading-[1.2] text-ap-dark-green focus:outline-none focus:ring-1 focus:ring-ap-dark-green"
            :value="sort" @change="onSortChange">
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <span
            class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-ap-dark-green">▼</span>
        </div>
      </div>
    </div>
  </div>
</template>
