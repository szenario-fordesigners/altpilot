<script setup lang="ts">
import AltPilotSearch from '@/components/AltPilotSearch.vue';
import AltPilotHeaderTotal from '@/components/AltPilotHeaderTotal.vue';
import AltPilotHeaderStats from '@/components/AltPilotHeaderStats.vue';
import AltPilotFilter from '@/components/AltPilotFilter.vue';
</script>

<template>
  <div>
    <div class="grid grid-cols-1 gap-4 grid-cols-3 items-start">
      <div class="justify-self-start w-3/4">
        <AltPilotSearch />
      </div>
      <div class="justify-self-center">
        <AltPilotHeaderTotal />
      </div>
      <div class="justify-self-end pr-12">
        <AltPilotHeaderStats />
      </div>
    </div>
    <AltPilotFilter class="mt-4" />
  </div>
</template>
