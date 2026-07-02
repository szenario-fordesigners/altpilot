<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from 'reka-ui';

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
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-[100] bg-black/50" />
      <DialogContent
        class="fixed top-1/2 left-1/2 z-[100] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 text-ap-dark-green shadow-xl"
        @escape-key-down="handleCancel"
      >
        <DialogTitle class="mb-2 text-lg font-bold">Overwrite Alt Text?</DialogTitle>
        <DialogDescription class="mb-4">
          This will overwrite the existing alt text for <strong>{{ siteName }}</strong
          >. This action cannot be undone.
        </DialogDescription>

        <div class="mb-6 flex items-center gap-2">
          <input
            id="suppress-warning"
            v-model="doNotShowAgain"
            type="checkbox"
            class="h-4 w-4 rounded border-ap-dark-green text-ap-dark-green focus:ring-ap-dark-green"
          />
          <label for="suppress-warning" class="text-sm select-none"> Don't show this again </label>
        </div>

        <div class="flex justify-end gap-3">
          <button
            class="rounded-full border border-ap-dark-green bg-white px-3 text-xl text-ap-dark-green transition-colors hover:bg-ap-light-green/30"
            @click="handleCancel"
          >
            Cancel
          </button>
          <button
            class="rounded-full border border-ap-dark-green bg-ap-dark-green px-3 text-xl text-ap-light-green transition-colors hover:bg-ap-light-green hover:text-ap-dark-green"
            @click="handleConfirm"
          >
            Generate
          </button>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
