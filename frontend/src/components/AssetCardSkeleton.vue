<template>
  <div
    class="relative flex h-full flex-col items-start gap-0 overflow-hidden rounded-[1.25rem] border border-[#ECECEC] bg-white"
  >
    <div class="relative h-32 w-full">
      <div class="skeleton-shimmer h-full w-full bg-gray-200" />
    </div>

    <div class="flex w-full flex-col pt-2">
      <div
        v-for="i in 2"
        :key="`site-skeleton-${i}`"
        class="mb-4 flex w-full border-b border-[#ECECEC] last:mb-0 last:border-b-0"
      >
        <div class="relative flex w-full items-center px-3">
          <div class="skeleton-shimmer h-4 w-24 rounded bg-gray-200" />
          <div
            class="skeleton-shimmer absolute left-1/2 h-4 w-10 -translate-x-1/2 rounded bg-gray-200"
          />
          <div
            class="skeleton-shimmer mb-1 ml-auto h-7 w-7 rounded-full border border-gray-300 bg-gray-100"
          />
        </div>

        <div class="w-full px-3 py-1">
          <div class="skeleton-shimmer h-20 w-full rounded-lg border border-gray-200 bg-gray-100" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-shimmer {
  position: relative;
  overflow: hidden;
}

.skeleton-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 45%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0.5) 55%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: skeleton-shimmer 1.3s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
