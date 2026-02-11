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
    <button @click="handlePrevious" :disabled="!canGoPrevious" class="disabled:cursor-not-allowed disabled:opacity-50">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="14.5" transform="matrix(-1 0 0 1 30 0)" stroke="#3C6E4E" />
        <path
          d="M7.29289 15.7071C6.90237 15.3166 6.90237 14.6834 7.29289 14.2929L13.6569 7.92893C14.0474 7.53841 14.6805 7.53841 15.0711 7.92893C15.4616 8.31946 15.4616 8.95262 15.0711 9.34315L9.41421 15L15.0711 20.6569C15.4616 21.0474 15.4616 21.6805 15.0711 22.0711C14.6805 22.4616 14.0474 22.4616 13.6569 22.0711L7.29289 15.7071ZM23 15V16L8 16V15V14L23 14V15Z"
          fill="#3C6E4E" />
      </svg>


    </button>

    <div class="flex items-center gap-2">
      <input v-model.number="pageInput" @change="handleInput" @keyup.enter="handleInput" type="number" min="1"
        :max="totalPages" class="w-16 rounded border border-ap-dark-green px-2 py-1 text-center text-ap-dark-green" />
      <span class="text-sm text-ap-dark-green"> / {{ totalPages }} </span>
    </div>

    <button @click="handleNext" :disabled="!canGoNext" class=" disabled:cursor-not-allowed disabled:opacity-50">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="14.5" stroke="#3C6E4E" />
        <path
          d="M22.7071 15.7071C23.0976 15.3166 23.0976 14.6834 22.7071 14.2929L16.3431 7.92893C15.9526 7.53841 15.3195 7.53841 14.9289 7.92893C14.5384 8.31946 14.5384 8.95262 14.9289 9.34315L20.5858 15L14.9289 20.6569C14.5384 21.0474 14.5384 21.6805 14.9289 22.0711C15.3195 22.4616 15.9526 22.4616 16.3431 22.0711L22.7071 15.7071ZM7 15V16L22 16V15V14L7 14V15Z"
          fill="#3C6E4E" />
      </svg>

    </button>
  </div>
</template>
