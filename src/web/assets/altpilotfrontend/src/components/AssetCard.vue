<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AssetActions from '@/components/AssetActions.vue';
import AssetAltEditor from '@/components/AssetAltEditor.vue';
import { useAssetAltEditor } from '@/composables/useAssetAltEditor';
import { useAssetGeneration } from '@/composables/useAssetGeneration';
import { useGlobalState } from '@/composables/useGlobalState';
import type { Asset, MultiLanguageAsset } from '@/types/Asset';
import { assetStatus } from '@/utils/assetStatus';

const props = defineProps<{
  asset: MultiLanguageAsset;
}>();

const { sites, cpTrigger, selectedSiteId } = useGlobalState();

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
  <div class="flex h-full flex-col items-start gap-2 bg-ap-lavender-mist">
    <div class="flex h-22 w-full flex-col gap-0 bg-ap-periwinkle">
      <img
        class="aspect-[4/3] h-full w-1/2 object-cover"
        :src="currentAsset.url"
        :alt="currentAsset.title"
      />

      <div
        class="flex h-full w-1/2 flex-col items-end justify-between p-2 text-end text-xl text-white"
      >
        <div>
          {{ assetStatus[currentAsset.status] }}
        </div>
        <button
          class="rounded-full border px-2 transition-colors hover:bg-white hover:text-ap-periwinkle"
        >
          save
        </button>
      </div>
    </div>

    <div class="flex flex-col p-3">
      <a
        :href="`/${cpTrigger}/assets/edit/${currentAsset.id}?site=${sites.find((site) => site.id === thisSelectedSiteId)?.handle}`"
        target="_blank"
        class="text-sm text-ap-periwinkle underline"
        >{{ currentAsset.title }}</a
      >
    </div>

    <div class="flex p-3">
      <div v-for="site in sites" :key="site.id" class="mb-4 flex w-full">
        <div class="flex w-full justify-between border-b">
          <div class="text-ap-periwinkle uppercase">{{ site.language }}</div>
          <div class="text-ap-periwinkle">{{ 150 - (asset[site.id]?.alt?.length || 0) }}</div>
        </div>
        <textarea :value="asset[site.id]?.alt" class="w-full font-mono" rows="4" />
      </div>
    </div>

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
