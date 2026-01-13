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
</script>

<template>
  <div class="grid grid-cols-8">
    <div class="col-span-1 flex flex-col items-start">
      <div class="text-xl">altpilot</div>
      <AltPilotLogo class="w-1/2" />
    </div>

    <AltPilotStatsItem label="alt-texts (total)" :content="String(total)" />
    <AltPilotStatsItem />
    <AltPilotStatsItem :label="assetStatus[1]" :content="String(aiGeneratedCount)" />
    <AltPilotStatsItem />
    <AltPilotStatsItem :label="assetStatus[2]" :content="String(manualCount)" />
    <AltPilotStatsItem />
    <AltPilotStatsItem :label="assetStatus[0]" :content="String(missingCount)" />
    <div class="col-span-1"></div>
  </div>
</template>

<style scoped></style>
