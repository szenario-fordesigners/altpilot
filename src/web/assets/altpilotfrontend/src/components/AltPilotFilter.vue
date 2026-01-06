<script setup lang="ts">
import { useAssets } from '@/composables/useAssets';

const { sort, fetchAssets } = useAssets();

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
</script>

<template>
  <div class="my-4 grid grid-cols-4 gap-4">
    <div>filter</div>
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

    <div>search</div>
    <div>search</div>
  </div>
</template>
