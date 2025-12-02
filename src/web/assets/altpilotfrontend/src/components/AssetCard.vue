<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AssetActions from '@/components/AssetActions.vue';
import AssetAltEditor from './AssetAltEditor.vue';
import { useAssetAltEditor } from '../composables/useAssetAltEditor';
import { useAssetGeneration } from '../composables/useAssetGeneration';
import { useGlobalState } from '../composables/useGlobalState';
import type { Asset, MultiLanguageAsset } from '../types/Asset';

const props = defineProps<{
  asset: MultiLanguageAsset;
}>();

const { cpTrigger, selectedSiteId } = useGlobalState();

const thisSelectedSiteId = ref(selectedSiteId.value);
const currentAsset = computed(() => props.asset[thisSelectedSiteId.value] as Asset);

// override when global changes
watch(selectedSiteId, (newSelectedSiteId) => {
  thisSelectedSiteId.value = newSelectedSiteId;
});

const {
  altText,
  hasChanges,
  saving,
  error: saveError,
  save,
} = useAssetAltEditor(props.asset, thisSelectedSiteId);

const {
  generating,
  error: generateError,
  success: generateSuccess,
  generationMessage,
  isGenerationActive,
  generate,
} = useAssetGeneration(props.asset, thisSelectedSiteId);

const handleSelectSite = (siteId: number) => {
  thisSelectedSiteId.value = siteId;
};
</script>

<template>
  <div class="flex h-full flex-col gap-2 border-2 border-black bg-white p-4">
    <img
      class="aspect-[4/3] w-full rounded object-cover"
      :src="currentAsset.url"
      :alt="currentAsset.title"
    />

    <AssetAltEditor
      :this-selected-site-id="thisSelectedSiteId"
      v-model:altText="altText"
      :title="currentAsset.title"
      :save-error="saveError"
      :generate-error="generateError"
      :generation-message="generationMessage"
      :generate-success="generateSuccess"
      @select-site="handleSelectSite"
    />

    <AssetActions
      :asset="props.asset"
      :this-selected-site-id="thisSelectedSiteId"
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
