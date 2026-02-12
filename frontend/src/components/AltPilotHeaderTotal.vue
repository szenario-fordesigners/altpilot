<script setup lang="ts">
import { useStatusCounts } from '@/composables/useStatusCounts';
import AltPilotLogo from '@/components/AltPilotLogo.vue';

const { total } = useStatusCounts();

const formatNumber = (num: number): string => {
  return num.toLocaleString('de-DE');
};
</script>

<template>
  <div class="flex items-center gap-6 text-ap-dark-green">
    <div
      class="pointer-events-none flex h-12 w-12 shrink-0 self-end items-center justify-center rounded-2xl bg-ap-light-green text-ap-dark-green mb-2">
      <AltPilotLogo class="max-h-8 w-8" />
    </div>
    <div>
      <p class="m-0 mt-1 text-[3.75rem] leading-[1]">{{ formatNumber(total) }}</p>
    </div>
  </div>
</template>
