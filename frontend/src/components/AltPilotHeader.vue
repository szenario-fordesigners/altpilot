<script setup lang="ts">
import AltPilotSearch from '@/components/AltPilotSearch.vue';
import AltPilotHeaderTotal from '@/components/AltPilotHeaderTotal.vue';
import AltPilotHeaderStats from '@/components/AltPilotHeaderStats.vue';
import AltPilotFilter from '@/components/AltPilotFilter.vue';
</script>

<template>
  <div>
    <div
      class="grid grid-cols-[max-content_max-content_1fr] items-start gap-x-6 gap-y-4 border-b border-ap-dark-green max-md:grid-cols-2 max-md:pb-4"
    >
      <div class="justify-self-start">
        <AltPilotHeaderTotal />
      </div>
      <div class="justify-self-start">
        <AltPilotHeaderStats />
      </div>
      <div class="w-full max-w-lg justify-self-end pt-1">
        <AltPilotSearch />
      </div>
    </div>
    <AltPilotFilter class="mt-4" />
  </div>
</template>
