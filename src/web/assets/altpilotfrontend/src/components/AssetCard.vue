<script setup lang="ts">
import { computed } from 'vue';
import { useAssetAltEditor } from '@/composables/useAssetAltEditor';
import { useGlobalState } from '@/composables/useGlobalState';
import { useAssetGeneration } from '@/composables/useAssetGeneration';
import type { Asset, MultiLanguageAsset } from '@/types/Asset';
import { assetStatus } from '@/utils/assetStatus';

const props = defineProps<{
  asset: MultiLanguageAsset;
}>();

const { sites, cpTrigger, primarySiteId } = useGlobalState();

const currentSiteId = computed(() => primarySiteId.value!);

const currentAsset = computed(() => props.asset[currentSiteId.value] as Asset);

const currentSiteHandle = computed(() => {
  return sites.value.find((site) => site.id === currentSiteId.value)?.handle ?? null;
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
</script>

<template>
  <div class="relative flex h-full flex-col items-start gap-2 overflow-hidden bg-ap-lavender-mist">
    <div
      v-if="anyGenerationFinished"
      class="asset-card-pulse pointer-events-none absolute inset-0 z-50 bg-ap-periwinkle/30"
    ></div>
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
          <div class="text-ap-periwinkle uppercase">{{ site.language }}</div>
          <div class="text-ap-periwinkle">{{ charactersRemaining(site.id) }}</div>
          <button
            class="rounded-full border px-2 transition-colors"
            :class="{
              'opacity-50': generatingBySite[site.id] || isGenerationActive(site.id),
              'hover:bg-white hover:text-ap-periwinkle':
                !generatingBySite[site.id] && !isGenerationActive(site.id),
            }"
            :disabled="generatingBySite[site.id] || isGenerationActive(site.id)"
            @click="generateForSite(site.id)"
          >
            <span v-if="generatingBySite[site.id] || isGenerationActive(site.id)">generating…</span>
            <span v-else>generate</span>
          </button>
        </div>
        <textarea v-model="altTexts[site.id]" class="w-full font-mono" rows="4" />
      </div>
    </div>
  </div>
</template>
