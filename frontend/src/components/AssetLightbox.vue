<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from 'reka-ui';
import type { MultiLanguageAsset } from '@/types/Asset';

const props = defineProps<{
  open: boolean;
  initialAssetId: number | null;
  assets: MultiLanguageAsset[];
  primarySiteId: number;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const currentIndex = ref(0);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.initialAssetId !== null) {
      const index = props.assets.findIndex(
        (a) => a[props.primarySiteId]?.id === props.initialAssetId,
      );
      if (index !== -1) {
        currentIndex.value = index;
      }
    }
  },
);

const currentAssetWrapper = computed(() => props.assets[currentIndex.value]);
const currentAsset = computed(() => {
  if (!currentAssetWrapper.value) return null;
  return currentAssetWrapper.value[props.primarySiteId];
});

function next() {
  if (currentIndex.value < props.assets.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0;
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = props.assets.length - 1;
  }
}

function onKeydown(e: KeyboardEvent) {
  if (!props.open) return;
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity" />
      <DialogContent
        class="fixed top-1/2 left-1/2 z-50 flex w-full max-w-7xl -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center p-4 shadow-none outline-none"
      >
        <DialogTitle class="sr-only"> Asset Preview </DialogTitle>
        <DialogDescription class="sr-only"> Preview of the selected asset </DialogDescription>

        <div v-if="currentAsset" class="relative flex w-full flex-col items-center">
          <!-- Close Button -->
          <DialogClose
            class="absolute -top-12 right-[max(4vw,1rem)] cursor-pointer p-2 text-white hover:text-gray-300 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="M6 6 18 18" />
            </svg>
          </DialogClose>

          <!-- White stage for media -->
          <div
            class="flex h-[min(78vh,900px)] w-[960px] max-w-[calc(100vw-12rem)] items-center justify-center bg-white p-6 shadow-2xl"
          >
            <img
              :src="currentAsset.url"
              :alt="currentAsset.title || 'Asset'"
              class="h-full w-full object-contain"
            />
          </div>

          <div class="mt-4 text-lg font-medium text-white">{{ currentAsset.title }}</div>

          <!-- Navigation Buttons -->
          <button
            class="absolute top-1/2 left-[max(2vw,0.5rem)] -translate-y-1/2 cursor-pointer p-2 text-white hover:text-gray-300 focus:outline-none"
            @click="prev"
            title="Previous"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button
            class="absolute top-1/2 right-[max(2vw,0.5rem)] -translate-y-1/2 cursor-pointer p-2 text-white hover:text-gray-300 focus:outline-none"
            @click="next"
            title="Next"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
