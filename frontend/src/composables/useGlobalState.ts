// store.ts
import { createGlobalState } from '@vueuse/core';
import { ref } from 'vue';
import type { Site } from '@/types/Site';

export const useGlobalState = createGlobalState(() => {
  const csrfToken = ref<{ name: string; value: string } | null>(null);
  const cpTrigger = ref<string | null>(null);
  const sites = ref<Site[]>([]);
  const primarySiteId = ref<number>(1);
  const hasSelectedVolumes = ref<boolean>(true);
  return { csrfToken, cpTrigger, sites, primarySiteId, hasSelectedVolumes };
});
