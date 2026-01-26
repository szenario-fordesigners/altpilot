<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type PaginationInfo = {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
};

const props = defineProps<{
  pagination: PaginationInfo | null;
}>();

const emit = defineEmits<{
  previous: [];
  next: [];
  'page-change': [page: number];
}>();

const currentPage = computed(() => {
  if (!props.pagination) return 1;
  return Math.floor(props.pagination.offset / props.pagination.limit) + 1;
});

const pageInput = ref(1);

// Update input when prop changes (e.g. via Next button)
watch(
  currentPage,
  (val) => {
    pageInput.value = val;
  },
  { immediate: true },
);

const totalPages = computed(() => {
  if (!props.pagination) return 1;
  return Math.ceil(props.pagination.total / props.pagination.limit);
});

const canGoPrevious = computed(() => {
  return props.pagination !== null && props.pagination.offset > 0;
});

const canGoNext = computed(() => {
  return props.pagination !== null && props.pagination.hasMore;
});

const handlePrevious = () => {
  if (!props.pagination || !canGoPrevious.value) return;
  emit('previous');
};

const handleNext = () => {
  if (!props.pagination || !canGoNext.value) return;
  emit('next');
};

const handleInput = () => {
  if (!props.pagination) return;
  let page = pageInput.value;

  if (page < 1) page = 1;
  if (page > totalPages.value) page = totalPages.value;

  pageInput.value = page;

  if (page !== currentPage.value) {
    emit('page-change', page);
  }
};
</script>

<template>
  <div v-if="pagination" class="mt-6 flex items-center justify-center gap-4">
    <button
      @click="handlePrevious"
      :disabled="!canGoPrevious"
      class="rounded border border-black px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Previous
    </button>

    <div class="flex items-center gap-2">
      <input
        v-model.number="pageInput"
        @change="handleInput"
        @keyup.enter="handleInput"
        type="number"
        min="1"
        :max="totalPages"
        class="w-16 rounded border border-gray-300 px-2 py-1 text-center"
      />
      <span class="text-sm"> / {{ totalPages }} </span>
    </div>

    <button
      @click="handleNext"
      :disabled="!canGoNext"
      class="rounded border border-black px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Next
    </button>
  </div>
</template>
