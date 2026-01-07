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

const { altTexts, hasChanges, saving, save } = useAssetAltEditor(props.asset);

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
</script>

<template>
  <div class="relative flex h-full flex-col items-start gap-2 overflow-hidden bg-ap-lavender-mist">
    <div
      v-if="anyGenerationFinished"
      class="asset-card-pulse pointer-events-none absolute inset-0 z-50 bg-ap-periwinkle/30"
    ></div>
    <div
      class="flex h-32 w-full flex-col gap-0"
      :class="[isAssetStatusMissing ? 'bg-ap-red' : 'bg-ap-periwinkle']"
    >
      <img
        class="aspect-[4/3] h-full w-1/2 cursor-pointer object-cover"
        :src="currentAsset.url"
        :alt="currentAsset.title"
        @click="emit('click-image', currentAsset.id)"
      />

      <div
        class="flex h-full w-1/2 flex-col items-end justify-between p-2 text-end text-xl text-white"
      >
        <div>
          {{ isAssetStatusMissing ? assetStatus[0] : '' }}
        </div>
        <button
          class="rounded-full border px-2 transition-all"
          :class="{
            'opacity-0': saving || !hasChanges,
            'hover:bg-white hover:text-ap-periwinkle': !saving && hasChanges,
          }"
          :disabled="saving || !hasChanges"
          @click="save"
        >
          <span v-if="saving">saving…</span>
          <span v-else>save</span>
        </button>
      </div>
    </div>

    <div v-if="cpTrigger" class="flex max-w-full flex-col p-3">
      <a
        :href="`/${cpTrigger}/assets/edit/${currentAsset.id}?site=${currentSiteHandle ?? ''}`"
        target="_blank"
        class="w-full overflow-x-hidden text-sm text-ellipsis whitespace-nowrap text-ap-periwinkle underline"
        >{{ currentAsset.title }}</a
      >
    </div>

    <div class="flex p-3">
      <div v-for="site in sites" :key="site.id" class="mb-4 flex w-full">
        <div class="flex w-full justify-between border-b">
          <div class="text-ap-periwinkle uppercase">
            {{ site.language }} ({{ assetStatus[props.asset[site.id]?.status ?? 0] }})
          </div>
          <div class="text-ap-periwinkle">{{ charactersRemaining(site.id) }}</div>
          <button
            class="mb-1 rounded-full border p-1 transition-colors"
            :class="{
              'opacity-50': generatingBySite[site.id] || isGenerationActive(site.id),
              'hover:bg-white hover:text-ap-periwinkle':
                !generatingBySite[site.id] && !isGenerationActive(site.id),
            }"
            :disabled="generatingBySite[site.id] || isGenerationActive(site.id)"
            @click="handleGenerateClick(site.id)"
          >
            <svg
              class="regenerate-icon"
              :class="{ 'animate-spin': generatingBySite[site.id] || isGenerationActive(site.id) }"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="m410.168 133.046l-28.958-28.958l82.807-.088l-.034-32L328 72.144V208h32v-79.868l27.541 27.541A152.5 152.5 0 0 1 279.972 416l.056 32a184.5 184.5 0 0 0 130.14-314.954M232.028 104l-.056-32a184.5 184.5 0 0 0-130.14 314.954L130.878 416H48v32h136V312h-32v79.868l-27.541-27.541A152.5 152.5 0 0 1 232.028 104"
              />
            </svg>
          </button>
        </div>
        <textarea v-model="altTexts[site.id]" class="w-full font-mono" rows="4" />
      </div>
    </div>

    <OverwriteConfirmationDialog
      v-model:open="confirmationOpen"
      :site-name="sites.find((s) => s.id === pendingGenerationSiteId)?.language ?? ''"
      @confirm="handleConfirmOverwrite"
      @cancel="handleCancelOverwrite"
    />
  </div>
</template>

<style scoped>
.regenerate-icon {
  width: 1rem;
  height: 1rem;
}
</style>
