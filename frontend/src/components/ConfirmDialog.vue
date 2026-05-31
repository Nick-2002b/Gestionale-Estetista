<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <Teleport to="body">
    <transition name="dialog">
      <div v-if="isOpen" class="fixed inset-0 z-100 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40" @click="emit('cancel')"></div>

        <div class="relative w-full max-w-sm bg-surface rounded-2xl shadow-2xl p-6 text-center overflow-hidden">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h3>
          <p class="text-sm text-gray-500 mb-6">{{ message }}</p>

          <div class="flex flex-col sm:flex-row justify-center gap-3">
            <button @click="emit('cancel')" class="w-full sm:w-auto flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium rounded-xl transition-colors">
              {{ cancelText || "Annulla" }}
            </button>
            <button @click="emit('confirm')" class="w-full sm:w-auto flex-1 px-4 py-2 bg-red-500 text-white hover:bg-red-600 font-medium rounded-xl transition-colors shadow-sm">
              {{ confirmText || "Elimina" }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.18s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
</style>
