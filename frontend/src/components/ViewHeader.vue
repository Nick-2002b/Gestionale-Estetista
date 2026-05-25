<script setup lang="ts">
defineProps<{
  title: string;
  buttonText?: string;
}>();

defineEmits<{
  (e: "action"): void;
}>();
</script>
<template>
  <div class="-mx-8 border-b border-gray-200 px-8 py-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-medium">{{ title }}</h1>

      <div class="flex items-center gap-2">
        <button
          v-if="buttonText"
          @click="$emit('action')"
          class="px-4 py-2 border border-gray-200 bg-primary hover:bg-primary/70 font-medium rounded-full shadow-sm flex items-center gap-2 cursor-pointer transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>
