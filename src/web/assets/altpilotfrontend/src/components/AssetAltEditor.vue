<script setup lang="ts">
import { useGlobalState } from '../composables/useGlobalState';

const altText = defineModel<string>('altText', { required: true });
const { sites } = useGlobalState();

withDefaults(
  defineProps<{
    title: string;
    saveError?: string | null;
    generateError?: string | null;
    generationMessage?: string | null;
    generateSuccess?: string | null;
    thisSelectedSiteId: number;
  }>(),
  {
    saveError: null,
    generateError: null,
    generationMessage: null,
    generateSuccess: null,
    thisSelectedSiteId: 1,
  },
);

const emit = defineEmits<{
  (e: 'selectSite', siteId: number): void;
}>();
</script>

<template>
  <div class="flex w-full">
    <button
      class="rounded border p-2"
      :class="{ 'bg-gray-200': site.id === thisSelectedSiteId }"
      v-for="site in sites"
      :key="site.id"
      @click="emit('selectSite', site.id)"
    >
      {{ site.language }}
    </button>
  </div>
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
