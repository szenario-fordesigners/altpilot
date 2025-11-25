<script setup lang="ts">
import { computed } from 'vue';

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
}>();

const currentPage = computed(() => {
  if (!props.pagination) return 1;
  return Math.floor(props.pagination.offset / props.pagination.limit) + 1;
});

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

    <span class="text-sm">
      Page {{ currentPage }} of {{ totalPages }}
      <span v-if="pagination.total" class="text-gray-600"> ({{ pagination.total }} total) </span>
    </span>

    <button
      @click="handleNext"
      :disabled="!canGoNext"
      class="rounded border border-black px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Next
    </button>
  </div>
</template>
