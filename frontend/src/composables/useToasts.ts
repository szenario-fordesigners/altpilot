import { createGlobalState } from '@vueuse/core';
import { ref } from 'vue';

export type ToastType = 'foreground' | 'background';

export type ToastAction = {
  label: string;
  altText: string;
  onClick: () => void;
};

export type ToastInput = {
  title?: string;
  description: string;
  type?: ToastType;
  duration?: number;
  action?: ToastAction;
};

export type ToastItem = ToastInput & {
  id: string;
  open: boolean;
  createdAt: number;
};

const createId = () => {
  try {
    return (
      globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
    );
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
};

export const useToasts = createGlobalState(() => {
  const toasts = ref<ToastItem[]>([]);

  // Keep the UI readable; newest toasts win.
  const maxToasts = ref<number>(5);

  function toast(input: ToastInput): string {
    const item: ToastItem = {
      id: createId(),
      open: true,
      createdAt: Date.now(),
      type: input.type ?? 'foreground',
      title: input.title,
      description: input.description,
      duration: input.duration,
      action: input.action,
    };

    toasts.value = [...toasts.value, item].slice(-maxToasts.value);
    return item.id;
  }

  function dismiss(id: string) {
    const item = toasts.value.find((t) => t.id === id);
    if (item) item.open = false;
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  function onOpenChange(id: string, open: boolean) {
    if (open) return;

    // Allow any close animation to finish.
    window.setTimeout(() => remove(id), 150);
  }

  return {
    toasts,
    maxToasts,
    toast,
    dismiss,
    remove,
    onOpenChange,
  };
});
