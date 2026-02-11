<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAssetAltEditor } from '@/composables/useAssetAltEditor';
import { useGlobalState } from '@/composables/useGlobalState';
import { useAssetGeneration } from '@/composables/useAssetGeneration';
import { useStorage } from '@vueuse/core';
import type { Asset, MultiLanguageAsset } from '@/types/Asset';
import { assetStatus } from '@/utils/assetStatus';
import OverwriteConfirmationDialog from '@/components/OverwriteConfirmationDialog.vue';

const props = defineProps<{
  asset: MultiLanguageAsset;
}>();

const emit = defineEmits<{
  (e: 'click-image', id: number): void;
}>();

const { sites, cpTrigger, primarySiteId } = useGlobalState();
const suppressOverwriteWarning = useStorage('altpilot-suppress-overwrite-warning', false);
const confirmationOpen = ref(false);
const pendingGenerationSiteId = ref<number | null>(null);

const currentSiteId = computed(() => primarySiteId.value!);

const currentAsset = computed(() => props.asset[currentSiteId.value] as Asset);

const currentSiteHandle = computed(() => {
  return sites.value.find((site) => site.id === currentSiteId.value)?.handle ?? null;
});

const isAssetStatusMissing = computed(() => {
  const isMissing = Object.values(props.asset).some((asset) => asset.status === 0);
  return isMissing;
});

const charactersRemaining = (siteId: number) => {
  const value = altTexts[siteId] ?? '';
  return 150 - value.length;
};

const { altTexts, hasChanges, hasSiteChanges, saving, save, resetChanges } = useAssetAltEditor(props.asset);

const { generateForSite, generatingBySite, isGenerationActive, isGenerationFinished } =
  useAssetGeneration(props.asset);

const anyGenerationFinished = computed(() => {
  return sites.value.some((site) => isGenerationFinished(site.id));
});

const handleGenerateClick = (siteId: number) => {
  const currentText = altTexts[siteId] ?? '';

  if (currentText.trim() === '' || suppressOverwriteWarning.value) {
    generateForSite(siteId);
    return;
  }

  pendingGenerationSiteId.value = siteId;
  confirmationOpen.value = true;
};

const handleConfirmOverwrite = () => {
  if (pendingGenerationSiteId.value !== null) {
    generateForSite(pendingGenerationSiteId.value);
    pendingGenerationSiteId.value = null;
  }
};

const handleCancelOverwrite = () => {
  pendingGenerationSiteId.value = null;
};

const handleSave = async () => {
  if (!hasChanges.value || saving.value) {
    return;
  }
  await save();
};

const handleCancel = () => {
  if (saving.value || !hasChanges.value) {
    return;
  }
  resetChanges();
};
</script>

<template>
  <div
    class="relative flex h-full flex-col items-start gap-0 overflow-hidden bg-white border-[#ECECEC] border rounded-[1.25rem]">
    <div v-if="anyGenerationFinished"
      class="asset-card-pulse pointer-events-none absolute inset-0 z-50 bg-ap-periwinkle/30"></div>
    <div class="h-32 w-full relative" :class="[isAssetStatusMissing ? 'bg-ap-red' : 'bg-ap-periwinkle']">
      <img class="aspect-[4/3] h-full w-full cursor-pointer object-cover" :src="currentAsset.url"
        :alt="currentAsset.title" @click="emit('click-image', currentAsset.id)" />

      <div v-if="cpTrigger" class="absolute left-2 bottom-2">
        <a :href="`/${cpTrigger}/assets/edit/${currentAsset.id}?site=${currentSiteHandle ?? ''}`" target="_blank"
          class="w-full overflow-x-hidden text-xs text-ellipsis whitespace-nowrap text-white underline">{{
            currentAsset.title }}</a>
      </div>


      <div
        class="absolute left-2 right-2 top-2 bottom-2 flex justify-between items-center rounded-2xl p-4 transition-all duration-300 ease-out"
        :class="[
          hasChanges
            ? 'opacity-100 pointer-events-auto bg-ap-light-green'
            : 'opacity-0 pointer-events-none bg-ap-light-green'
        ]">

        <button class="text-ap-dark-green rounded-full border border-ap-dark-green px-3 text-xl disabled:opacity-60"
          :disabled="saving || !hasChanges" @click="handleSave">
          {{ saving ? 'saving…' : 'save' }}
        </button>
        <button class="text-ap-dark-green disabled:opacity-60" :disabled="saving || !hasChanges" @click="handleCancel">
          cancel
        </button>
      </div>
    </div>



    <div class="flex w-full py-2 gap-0">
      <div v-for="site in sites" :key="site.id"
        class="mb-4 flex gap-0 w-full border-b border-[#ECECEC] last:border-b-0">
        <div class="flex w-full justify-between px-3">
          <div class="text-ap-dark-green uppercase">
            {{ site.language }} ({{ assetStatus[props.asset[site.id]?.status ?? 0] }})
          </div>
          <div class="text-[#AEAEAE]">{{ charactersRemaining(site.id) }}</div>
          <button class="mb-1 rounded-full border p-1 transition-colors text-[#AEAEAE] hover:text-black" :class="{
            'text-black': generatingBySite[site.id] || isGenerationActive(site.id),
          }" :disabled="generatingBySite[site.id] || isGenerationActive(site.id)"
            @click="handleGenerateClick(site.id)">
            <svg class="regenerate-icon"
              :class="{ 'animate-spin': generatingBySite[site.id] || isGenerationActive(site.id) }"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="currentColor"
                d="m410.168 133.046l-28.958-28.958l82.807-.088l-.034-32L328 72.144V208h32v-79.868l27.541 27.541A152.5 152.5 0 0 1 279.972 416l.056 32a184.5 184.5 0 0 0 130.14-314.954M232.028 104l-.056-32a184.5 184.5 0 0 0-130.14 314.954L130.878 416H48v32h136V312h-32v79.868l-27.541-27.541A152.5 152.5 0 0 1 232.028 104" />
            </svg>
          </button>
        </div>
        <div class="w-full p-3 pt-1">
          <textarea v-model="altTexts[site.id]" class="w-full font-mono px-2 rounded focus:outline-none focus:ring-0"
            :class="hasSiteChanges(site.id) ? 'border border-ap-light-green' : (!altTexts[site.id]?.length ? 'border border-red-500' : 'border border-transparent')"
            rows="4" />
        </div>
      </div>
    </div>

    <OverwriteConfirmationDialog v-model:open="confirmationOpen"
      :site-name="sites.find((s) => s.id === pendingGenerationSiteId)?.language ?? ''" @confirm="handleConfirmOverwrite"
      @cancel="handleCancelOverwrite" />
  </div>
</template>

<style scoped>
.regenerate-icon {
  width: 1rem;
  height: 1rem;
}
</style>
