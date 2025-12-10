<script setup lang="ts">
defineProps<{
  label?: string;
  content?: string;
}>();
</script>

<template>
  <div class="col-span-1 flex flex-col items-start">
    <div v-if="label" class="text-xl">{{ label }}</div>
    <div v-if="content" class="text-6xl">{{ content }}</div>
  </div>
</template>
