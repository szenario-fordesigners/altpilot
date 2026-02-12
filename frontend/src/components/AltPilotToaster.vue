<script setup lang="ts">
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from 'reka-ui';

import { useToasts } from '@/composables/useToasts';

const { toasts, dismiss, onOpenChange } = useToasts();
</script>

<template>
  <ToastProvider :duration="5000" swipe-direction="right">
    <ToastRoot
      v-for="t in toasts"
      :key="t.id"
      v-model:open="t.open"
      :duration="t.duration"
      :type="t.type"
      class="toast-transition relative w-full overflow-hidden rounded-2xl border border-ap-dark-green bg-ap-light-green text-ap-dark-green"
      @update:open="(open) => onOpenChange(t.id, open)"
    >
      <ToastClose as-child>
        <button
          type="button"
          class="absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full border-ap-dark-green text-ap-dark-green transition-colors hover:border hover:bg-ap-dark-green/10"
          aria-label="Close"
        >
          <svg aria-hidden="true" viewBox="0 0 12 12" class="h-2.5 w-2.5">
            <path
              d="M2 2 L10 10 M10 2 L2 10"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </ToastClose>

      <div class="px-3 py-2 pr-9">
        <div class="min-w-0">
          <ToastTitle v-if="t.title" class="text-xs leading-tight text-ap-dark-green uppercase">
            {{ t.title }}
          </ToastTitle>
          <ToastDescription class="text-sm leading-snug text-ap-dark-green">
            {{ t.description }}
          </ToastDescription>
        </div>
      </div>

      <div v-if="t.action" class="flex justify-end px-3 pb-2">
        <ToastAction as-child :alt-text="t.action.altText">
          <button
            type="button"
            class="rounded-full border border-ap-dark-green px-2.5 py-0.5 text-xs text-ap-dark-green transition-colors hover:bg-ap-light-green/30"
            @click="
              () => {
                t.action?.onClick();
                dismiss(t.id);
              }
            "
          >
            {{ t.action.label }}
          </button>
        </ToastAction>
      </div>
    </ToastRoot>

    <ToastViewport
      class="fixed right-3 bottom-3 z-50 flex max-h-[calc(100vh-1.5rem)] w-[300px] max-w-[calc(100vw-1.5rem)] flex-col gap-1.5 outline-none"
    />
  </ToastProvider>
</template>

<style scoped>
:deep(.toast-transition[data-state='open']) {
  animation: toast-enter 180ms cubic-bezier(0.16, 1, 0.3, 1);
}

:deep(.toast-transition[data-state='closed']) {
  animation: toast-leave 320ms ease;
}

@keyframes toast-enter {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toast-leave {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  to {
    opacity: 0;
    transform: translateY(6px) scale(0.99);
  }
}
</style>
