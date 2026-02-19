<script setup lang="ts">
import { useStatusCounts } from '@/composables/useStatusCounts';
import AltPilotLogo from '@/components/AltPilotLogo.vue';

const { total } = useStatusCounts();

const formatNumber = (num: number): string => {
  return num.toLocaleString('de-DE');
};
</script>

<template>
  <div class="flex items-center gap-5 text-ap-dark-green">
    <div
      class="pointer-events-none mb-2 flex h-14 w-14 shrink-0 items-center justify-center self-end rounded-2xl pt-1 text-ap-dark-green"
    >
      <AltPilotLogo class="max-h-12 w-12" />
    </div>
    <div>
      <p class="m-0 mt-1 text-[3.75rem] leading-[1]">{{ formatNumber(total) }}</p>
    </div>
  </div>
</template>
