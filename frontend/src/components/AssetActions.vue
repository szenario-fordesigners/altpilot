<script setup lang="ts">
import { computed } from 'vue';
import { useGlobalState } from '@/composables/useGlobalState';
import type { Asset, MultiLanguageAsset } from '@/types/Asset';

const props = withDefaults(
  defineProps<{
    isGenerating?: boolean;
    isGenerationActive?: boolean;
    isSaving?: boolean;
    canSave?: boolean;
    asset: MultiLanguageAsset;
  }>(),
  {
    isGenerating: false,
    isGenerationActive: false,
    isSaving: false,
    canSave: true,
  },
);

const { sites, cpTrigger, primarySiteId } = useGlobalState();

const emit = defineEmits<{
  (event: 'generate'): void;
  (event: 'save'): void;
}>();

const currentSiteId = computed(() => primarySiteId.value!);
const currentAsset = computed(() => props.asset[currentSiteId.value] as Asset);

const currentSiteHandle = computed(() => {
  const siteId = currentAsset.value.siteId ?? currentSiteId.value;
  return sites.value.find((site) => site.id === siteId)?.handle ?? null;
});
</script>

<template>
  <div class="flex gap-2">
    <button class="button" @click="emit('generate')" :disabled="isGenerating || isGenerationActive">
      {{ isGenerating || isGenerationActive ? 'Generating...' : 'Generate' }}
    </button>
    <button
      class="button"
      :class="{ 'button--disabled': !canSave }"
      @click="emit('save')"
      :disabled="isSaving || !canSave"
    >
      {{ isSaving ? 'Saving...' : 'Save' }}
    </button>
    <a
      v-if="cpTrigger"
      class="button"
      :href="`/${cpTrigger}/assets/edit/${currentAsset.id}?site=${currentSiteHandle ?? ''}`"
      target="_blank"
    >
      Control Panel
    </a>
  </div>
</template>

<style scoped>
.button {
  border: 1px solid black;
  padding: 0.125rem 0.25rem;
  text-decoration: none;
}

.button--disabled,
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #e5e5e5;
}
</style>
