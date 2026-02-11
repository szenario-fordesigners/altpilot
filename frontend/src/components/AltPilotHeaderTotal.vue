<script setup lang="ts">
import { useStatusCounts } from '@/composables/useStatusCounts';

const { total } = useStatusCounts();

const formatNumber = (num: number): string => {
  return num.toLocaleString('de-DE');
};
</script>

<template>
  <div class="text-ap-dark-green">
    <p class="m-0 text-xs">alt-texts (total DE and EN)</p>
    <p class="m-0 mt-2 text-[3.75rem] leading-[1]">{{ formatNumber(total) }}</p>
  </div>
</template>
