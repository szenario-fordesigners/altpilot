<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core';
import { useStatusCounts } from '@/composables/useStatusCounts';
import { assetStatus } from '@/utils/assetStatus';

const { missingCount, aiGeneratedCount, manualCount, fetchStatusCounts } = useStatusCounts();

useIntervalFn(() => {
  fetchStatusCounts();
}, 60000);

const formatNumber = (num: number): string => num.toLocaleString('de-DE');
</script>

<template>
  <div class="text-ap-dark-green">
    <p class="m-0 mb-1 text-xs">log</p>
    <div class="grid grid-cols-[max-content_max-content] gap-x-6 gap-y-0.5 text-base leading-[1.15] pt-1">
      <p class="m-0">{{ assetStatus[1] }}</p>
      <p class="m-0">{{ formatNumber(aiGeneratedCount) }}</p>
      <p class="m-0">{{ assetStatus[2] }}</p>
      <p class="m-0">{{ formatNumber(manualCount) }}</p>
      <p class="m-0">{{ assetStatus[0] }}</p>
      <p class="m-0">{{ formatNumber(missingCount) }}</p>
    </div>
  </div>
</template>
