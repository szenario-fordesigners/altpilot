<script setup lang="ts">
import AltPilotLogo from '@/components/AltPilotLogo.vue';
import AltPilotStatsItem from '@/components/AltPilotStatsItem.vue';
import { useStatusCounts } from '@/composables/useStatusCounts';

const { total, missingCount, aiGeneratedCount, manualCount } = useStatusCounts();
</script>

<template>
  <div class="grid grid-cols-8">
    <div class="col-span-1 flex flex-col items-start">
      <div class="text-xl">altpilot</div>
      <AltPilotLogo class="w-1/2" />
    </div>

    <AltPilotStatsItem label="alt-texts (total)" :content="String(total)" />
    <AltPilotStatsItem />
    <AltPilotStatsItem label="AI-generated" :content="String(aiGeneratedCount)" />
    <AltPilotStatsItem />
    <AltPilotStatsItem label="manually" :content="String(manualCount)" />
    <AltPilotStatsItem />
    <AltPilotStatsItem label="missing" :content="String(missingCount)" />
    <div class="col-span-1"></div>
  </div>
</template>

<style scoped></style>
