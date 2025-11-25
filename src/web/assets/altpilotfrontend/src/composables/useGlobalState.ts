// store.ts
import { createGlobalState } from '@vueuse/core';
import { ref } from 'vue';

export const useGlobalState = createGlobalState(() => {
  const csrfToken = ref<{ name: string; value: string } | null>(null);
  const cpTrigger = ref<string | null>(null);
  const sites = ref<Site[]>([]);
  const currentSiteId = ref<number | null>(null);
  return { csrfToken, cpTrigger, sites, currentSiteId };
});
