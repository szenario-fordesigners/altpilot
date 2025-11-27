<script setup lang="ts">
import { computed } from 'vue';
import { useGlobalState } from '../composables/useGlobalState';

const props = withDefaults(
  defineProps<{
    isGenerating?: boolean;
    isGenerationActive?: boolean;
    isSaving?: boolean;
    canSave?: boolean;
    cpTrigger?: string | null;
    asset: MultiLanguageAsset;
  }>(),
  {
    isGenerating: false,
    isGenerationActive: false,
    isSaving: false,
    canSave: true,
    cpTrigger: null,
  },
);

const emit = defineEmits<{
  (event: 'generate'): void;
  (event: 'save'): void;
}>();

const { selectedSiteId } = useGlobalState();
const currentAsset = computed(() => props.asset[selectedSiteId.value] as Asset);
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
      :href="`${cpTrigger}/assets/edit/${currentAsset.id}`"
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
