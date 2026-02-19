<script setup lang="ts">
import { useAssets } from '@/composables/useAssets';
import { useGlobalState } from '@/composables/useGlobalState';
const { sites } = useGlobalState();
const { sort, fetchAssets, filter, pagination } = useAssets();

const filterOptions = [
  { value: 'all', label: 'all' },
  { value: 'missing', label: 'missing' },
  { value: 'manual', label: 'manually' },
  { value: 'ai-generated', label: 'AI-generated' },
];

const setFilter = (value: string) => {
  if (filter.value === value) return;
  filter.value = value;
  fetchAssets({ offset: 0 });
};

const sortOptions = [
  { value: 'dateUpdated', label: 'last edited' },
  { value: 'dateCreated', label: 'image: last uploaded' },
  { value: 'filename', label: 'image: filename' },
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
    <div class="grid grid-cols-[1fr_max-content] items-end gap-4 max-md:grid-cols-1">
      <div>
        <div class="mb-ap-title-p text-sm text-ap-dark-green">showing results</div>
        <div class="text-xl text-ap-dark-green">
          alt texts for {{ pagination?.total || 0 }} images in {{ sites.length }} languages
        </div>
      </div>

      <div class="flex md:justify-self-end">
        <div>
          <p class="mb-1 mb-ap-title-p text-sm leading-[1.2] text-ap-dark-green">filter</p>
          <ul class="flex flex-wrap gap-2">
            <li v-for="option in filterOptions" :key="option.value">
              <button
                type="button"
                @click="setFilter(option.value)"
                class="rounded-full border border-ap-dark-green px-3 py-1 text-xs leading-none transition-colors hover:bg-ap-light-green/30"
                :class="
                  filter === option.value ? 'bg-ap-light-green text-black' : 'text-ap-dark-green'
                "
              >
                {{ option.label }}
              </button>
            </li>
          </ul>
        </div>

        <div class="sm:ml-4">
          <p class="mb-1 mb-ap-title-p text-sm leading-[1.2] text-ap-dark-green">sort by</p>
          <div class="relative">
            <select
              class="w-full appearance-none rounded-full border border-ap-dark-green py-1 pr-8 pl-3 text-xs leading-[1.2] text-ap-dark-green focus:ring-1 focus:ring-ap-dark-green focus:outline-none"
              :value="sort"
              @change="onSortChange"
            >
              <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <span
              class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ap-dark-green"
              aria-hidden="true"
            >
              <svg
                class="h-2.5 w-2.5"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
