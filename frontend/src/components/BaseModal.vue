<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const handleClose = () => {
  emit("close");
};
</script>

<template>
  <Teleport to="body">
    <transition name="overlay">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40" @click="handleClose"></div>

        <div class="relative w-full bg-surface rounded-2xl shadow-2xl overflow-hidden max-w-lg flex flex-col">
          <div class="flex items-center justify-between gap-4 p-4 md:p-6 border-b border-gray-200 bg-gray-50 shrink-0">
            <slot name="header">
              <h2 class="text-xl font-bold text-gray-800">{{ title }}</h2>
            </slot>

            <button type="button" @click="handleClose" class="text-gray-400 cursor-pointer hover:text-pink transition-colors" aria-label="Chiudi modale">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-4 md:p-6 overflow-y-auto space-y-4 md:space-y-6 flex-1 min-h-0">
            <slot></slot>
          </div>

          <div class="p-4 md:p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3 sm:gap-0 sm:space-x-3 bg-gray-50 shrink-0">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.18s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
