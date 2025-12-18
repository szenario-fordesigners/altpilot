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
      class="w-full rounded-lg border border-slate-200 bg-white p-3 shadow-lg"
      @update:open="(open) => onOpenChange(t.id, open)"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <ToastTitle v-if="t.title" class="text-sm font-semibold text-slate-900">
            {{ t.title }}
          </ToastTitle>
          <ToastDescription class="text-sm text-slate-700">
            {{ t.description }}
          </ToastDescription>
        </div>

        <ToastClose as-child>
          <button
            type="button"
            class="-m-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </ToastClose>
      </div>

      <div v-if="t.action" class="mt-2 flex justify-end">
        <ToastAction as-child :alt-text="t.action.altText">
          <button
            type="button"
            class="rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white hover:bg-slate-800"
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
      class="fixed right-4 bottom-4 z-50 flex max-h-[calc(100vh-2rem)] w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none"
    />
  </ToastProvider>
</template>
