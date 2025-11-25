<script setup lang="ts">
const altText = defineModel<string>('altText', { required: true });

withDefaults(
  defineProps<{
    title: string;
    saveError?: string | null;
    generateError?: string | null;
    generationMessage?: string | null;
    generateSuccess?: string | null;
  }>(),
  {
    saveError: null,
    generateError: null,
    generationMessage: null,
    generateSuccess: null,
  },
);
</script>

<template>
  <div class="mt-auto w-full">
    <h3 class="text-lg font-medium">{{ title }}</h3>
    <textarea class="h-24 w-full resize-none border" v-model="altText" />
    <p v-if="saveError" class="mt-1 text-sm text-red-500">{{ saveError }}</p>
    <p v-if="generateError" class="mt-1 text-sm text-red-500">{{ generateError }}</p>
    <p v-if="generationMessage" class="mt-1 text-sm text-blue-500">{{ generationMessage }}</p>
    <p v-else-if="generateSuccess" class="mt-1 text-sm text-green-500">
      {{ generateSuccess }}
    </p>
  </div>
</template>
