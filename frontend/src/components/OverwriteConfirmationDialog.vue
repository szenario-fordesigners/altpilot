<script setup lang="ts">
import { useStorage } from '@vueuse/core';

defineProps<{
  open: boolean;
  siteName: string;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'update:open', value: boolean): void;
}>();

const doNotShowAgain = useStorage('altpilot-suppress-overwrite-warning', false);

const handleConfirm = () => {
  emit('confirm');
  emit('update:open', false);
};

const handleCancel = () => {
  emit('cancel');
  emit('update:open', false);
};
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
      <h3 class="mb-2 text-lg font-bold text-gray-900">Overwrite Alt Text?</h3>
      <p class="mb-4 text-gray-600">
        This will overwrite the existing alt text for <strong>{{ siteName }}</strong
        >. This action cannot be undone.
      </p>

      <div class="mb-6 flex items-center gap-2">
        <input
          id="suppress-warning"
          v-model="doNotShowAgain"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-ap-periwinkle focus:ring-ap-periwinkle"
        />
        <label for="suppress-warning" class="text-sm text-gray-600 select-none">
          Don't show this again
        </label>
      </div>

      <div class="flex justify-end gap-3">
        <button
          class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-ap-periwinkle focus:ring-offset-2 focus:outline-none"
          @click="handleCancel"
        >
          Cancel
        </button>
        <button
          class="rounded-md bg-ap-periwinkle px-4 py-2 text-sm font-medium text-white hover:bg-ap-periwinkle/90 focus:ring-2 focus:ring-ap-periwinkle focus:ring-offset-2 focus:outline-none"
          @click="handleConfirm"
        >
          Generate
        </button>
      </div>
    </div>
  </div>
</template>
