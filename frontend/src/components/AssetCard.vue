<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAssetAltEditor } from '@/composables/useAssetAltEditor';
import { useGlobalState } from '@/composables/useGlobalState';
import { useAssetGeneration } from '@/composables/useAssetGeneration';
import { useStorage } from '@vueuse/core';
import type { Asset, MultiLanguageAsset } from '@/types/Asset';
import { assetStatusShort } from '@/utils/assetStatus';
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

const charactersRemaining = (siteId: number) => {
  const value = altTexts[siteId] ?? '';
  return 150 - value.length;
};

const { altTexts, hasChanges, hasSiteChanges, saving, save, resetChanges } = useAssetAltEditor(props.asset);

const { generateForSite, generatingBySite, isGenerationActive, isGenerationFinished } =
  useAssetGeneration(props.asset);

const isGeneratingSite = (siteId: number) => {
  return generatingBySite[siteId] || isGenerationActive(siteId);
};

const getTextareaValue = (siteId: number) => {
  return isGeneratingSite(siteId) ? '...' : altTexts[siteId] ?? '';
};

const handleTextareaInput = (siteId: number, event: Event) => {
  if (isGeneratingSite(siteId)) {
    return;
  }

  altTexts[siteId] = (event.target as HTMLTextAreaElement).value;
};

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
    class="relative flex h-full flex-col items-start gap-0 overflow-hidden bg-white border-[#ECECEC] border rounded-[1.25rem] shadow-xl">
    <div class="h-32 w-full relative">
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



    <div class="flex w-full pt-2 gap-0">
      <div v-for="site in sites" :key="site.id"
        class="mb-4 flex gap-0 w-full border-b border-[#ECECEC] last:border-b-0 last:mb-0">
        <div class="relative flex w-full items-center px-3">
          <div class="text-ap-dark-green uppercase">
            {{ site.language }}: {{ assetStatusShort[props.asset[site.id]?.status ?? 0] }}
          </div>

          <div class="absolute left-1/2 -translate-x-1/2 text-center text-[#AEAEAE]"
            :class="charactersRemaining(site.id) < 0 ? 'text-ap-red' : ''">{{
              charactersRemaining(site.id) }}</div>

          <button
            class="mb-1 ml-auto rounded-full border p-1 transition-colors text-ap-dark-green hover:bg-ap-light-green/30"
            :class="{
              'bg-ap-light-green/30': generatingBySite[site.id] || isGenerationActive(site.id),
            }" :disabled="generatingBySite[site.id] || isGenerationActive(site.id)"
            @click="handleGenerateClick(site.id)">
            <svg class="regenerate-icon"
              :class="{ 'animate-spin': generatingBySite[site.id] || isGenerationActive(site.id) }"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="currentColor"
                d="M101.83,133.05c-34.52,34.52-53.94,81.31-54.03,130.13-.18,101.9,82.28,184.65,184.17,184.83l.06-32c-40.35-.07-79.02-16.13-107.56-44.66-59.56-59.55-59.56-156.11-.01-215.67l27.54-27.54v79.87s32,0,32,0V72.14s-135.98-.14-135.98-.14l-.03,32,82.81.09-28.96,28.96M279.97,104c40.35.07,79.02,16.13,107.56,44.66,59.56,59.55,59.56,156.11.01,215.67l-27.54,27.54v-79.87s-32,0-32,0v136s136,0,136,0v-32s-82.88,0-82.88,0l29.05-29.05c34.52-34.52,53.94-81.31,54.03-130.13.18-101.9-82.28-184.65-184.17-184.83l-.06,32" />
            </svg>
          </button>
        </div>


        <div class="w-full px-3 py-1">
          <textarea :value="getTextareaValue(site.id)" :disabled="isGeneratingSite(site.id)"
            @input="handleTextareaInput(site.id, $event)"
            class="resize-none w-full px-2 py-1 rounded-lg transition-colors focus:outline-none focus:ring-0 text-base leading-[1.1] focus:border focus:border-ap-light-green text-[#555] hover:border-ap-light-green"
            :class="{
              'border border-green-500 bg-green-50/40 text-ap-dark-green animate-pulse': isGeneratingSite(site.id),
              'border border-ap-light-green': !isGeneratingSite(site.id) && hasSiteChanges(site.id),
              'border border-ap-red': !isGeneratingSite(site.id) && !hasSiteChanges(site.id) && !altTexts[site.id]?.length,
              'border border-transparent':
                !isGeneratingSite(site.id) && !hasSiteChanges(site.id) && !!altTexts[site.id]?.length,
              'textarea-finish-pulse': !isGeneratingSite(site.id) && isGenerationFinished(site.id),
            }" rows="4" />
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

.textarea-finish-pulse {
  animation: textarea-finish-pulse 0.45s ease-in-out 2;
}

@keyframes textarea-finish-pulse {
  0% {
    background-color: #ffffff;
  }

  50% {
    background-color: rgba(204, 255, 203, 0.5);
  }

  100% {
    background-color: #ffffff;
  }
}
</style>