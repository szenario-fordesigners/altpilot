<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGlobalState } from '../composables/useGlobalState';

const { asset } = defineProps<{
  asset: Asset;
}>();

const { csrfToken, cpTrigger } = useGlobalState();
const altText = ref(asset.alt ?? '');
const saving = ref(false);
const saveError = ref<string | null>(null);
const originalAltText = ref(asset.alt ?? '');

const hasChanges = computed(() => altText.value !== originalAltText.value);

const handleSave = async () => {
  if (!csrfToken.value) {
    saveError.value = 'CSRF token not available';
    return;
  }

  saving.value = true;
  saveError.value = null;

  try {
    const formData = new FormData();
    formData.append('action', 'elements/save');
    formData.append('elementId', asset.id.toString());
    formData.append('alt', altText.value);
    formData.append(csrfToken.value.name, csrfToken.value.value);

    const response = await fetch('/actions/elements/save', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: formData,
      redirect: 'manual',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to save asset' }));
      throw new Error(
        errorData.error || errorData.message || `Request failed with status ${response.status}`,
      );
    }

    const data = await response.json();
    if (data.success === false || (data.error && !data.id)) {
      throw new Error(data.error || data.message || 'Failed to save asset');
    }

    // Update the original value after successful save
    originalAltText.value = altText.value;
  } catch (err) {
    saveError.value = err instanceof Error ? err.message : 'Unknown error';
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="flex h-full flex-col gap-2 border-2 border-black bg-white p-4">
    <img class="aspect-[4/3] w-full rounded object-cover" :src="asset.url" :alt="asset.title" />
    <div class="mt-auto">
      <h3 class="text-lg font-medium">{{ asset.title }}</h3>
      <textarea class="w-full border" v-model="altText" />
      <p v-if="saveError" class="mt-1 text-sm text-red-500">{{ saveError }}</p>
    </div>
    <div class="flex gap-2">
      <button class="button">Generate</button>
      <button
        class="button"
        :class="{ 'button--disabled': !hasChanges }"
        @click="handleSave"
        :disabled="saving || !hasChanges"
      >
        {{ saving ? 'Saving...' : 'Save' }}
      </button>
      <a
        v-if="cpTrigger"
        class="button"
        :href="`${cpTrigger}/assets/edit/${asset.id}`"
        target="_blank"
        >Control Panel</a
      >
    </div>
  </div>
</template>

<style scoped>
.button {
  border: 1px solid black;
  padding: 0.125rem 0.25rem;

  text-decoration: none;
}

.button--disabled,
.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #e5e5e5;
}
</style>
