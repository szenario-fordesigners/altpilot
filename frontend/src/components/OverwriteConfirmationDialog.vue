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
    <div class="w-full max-w-md rounded-lg bg-white text-ap-dark-green p-6 shadow-xl">
      <h3 class="mb-2 text-lg font-bold">Overwrite Alt Text?</h3>
      <p class="mb-4">
        This will overwrite the existing alt text for <strong>{{ siteName }}</strong>. This action cannot be undone.
      </p>

      <div class="mb-6 flex items-center gap-2">
        <input id="suppress-warning" v-model="doNotShowAgain" type="checkbox"
          class="h-4 w-4 rounded border-ap-dark-green text-ap-dark-green focus:ring-ap-dark-green" />
        <label for="suppress-warning" class="text-sm select-none">
          Don't show this again
        </label>
      </div>

      <div class="flex justify-end gap-3">
        <button
          class="bg-white text-ap-dark-green hover:bg-ap-light-green/30 rounded-full border border-ap-dark-green px-3 text-xl transition-colors"
          @click="handleCancel">
          Cancel
        </button>
        <button
          class="text-ap-light-green bg-ap-dark-green hover:bg-ap-light-green hover:text-ap-dark-green rounded-full border border-ap-dark-green px-3 text-xl transition-colors"
          @click="handleConfirm">
          Generate
        </button>
      </div>
    </div>
  </div>
</template>
