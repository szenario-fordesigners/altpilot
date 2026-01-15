<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core';
import AltPilotLogo from '@/components/AltPilotLogo.vue';
import AltPilotStatsItem from '@/components/AltPilotStatsItem.vue';
import { useStatusCounts } from '@/composables/useStatusCounts';
import { assetStatus } from '@/utils/assetStatus';

const { total, missingCount, aiGeneratedCount, manualCount, fetchStatusCounts } = useStatusCounts();

useIntervalFn(() => {
  fetchStatusCounts();
}, 60000);

const formatNumber = (num: number): string => {
  return num.toLocaleString('de-DE');
};
</script>

<template>
  <div class="grid grid-cols-8">
    <div class="col-span-1 flex flex-col items-start">
      <div class="text-xl">altpilot</div>
      <AltPilotLogo class="w-1/2" />
    </div>

    <AltPilotStatsItem label="alt-texts (total)" :content="formatNumber(total)" />
    <AltPilotStatsItem />
    <AltPilotStatsItem :label="assetStatus[1]" :content="formatNumber(aiGeneratedCount)" />
    <AltPilotStatsItem />
    <AltPilotStatsItem :label="assetStatus[2]" :content="formatNumber(manualCount)" />
    <AltPilotStatsItem />
    <AltPilotStatsItem :label="assetStatus[0]" :content="formatNumber(missingCount)" />
    <div class="col-span-1"></div>
  </div>
</template>

<style scoped></style>
