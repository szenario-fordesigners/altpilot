<script setup lang="ts">
import { computed } from 'vue';
import AssetActions from './AssetActions.vue';
import AssetAltEditor from './AssetAltEditor.vue';
import { useAssetAltEditor } from '../composables/useAssetAltEditor';
import { useAssetGeneration } from '../composables/useAssetGeneration';
import { useGlobalState } from '../composables/useGlobalState';

const props = defineProps<{
  asset: MultiLanguageAsset;
}>();

const { cpTrigger, selectedSiteId } = useGlobalState();

const currentAsset = computed(() => props.asset[selectedSiteId.value] as Asset);

const { altText, hasChanges, saving, error: saveError, save } = useAssetAltEditor(props.asset);

const {
  generating,
  error: generateError,
  success: generateSuccess,
  generationMessage,
  isGenerationActive,
  generate,
} = useAssetGeneration(props.asset);
</script>

<template>
  <div class="flex h-full flex-col gap-2 border-2 border-black bg-white p-4">
    <img
      class="aspect-[4/3] w-full rounded object-cover"
      :src="currentAsset.url"
      :alt="currentAsset.title"
    />

    <AssetAltEditor
      v-model:altText="altText"
      :title="currentAsset.title"
      :save-error="saveError"
      :generate-error="generateError"
      :generation-message="generationMessage"
      :generate-success="generateSuccess"
    />

    <AssetActions
      :asset="props.asset"
      :is-generating="generating"
      :is-generation-active="isGenerationActive"
      :is-saving="saving"
      :can-save="hasChanges"
      :cp-trigger="cpTrigger"
      @generate="generate"
      @save="save"
    />
  </div>
</template>
