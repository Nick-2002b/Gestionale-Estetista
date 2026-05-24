<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { onClickOutside } from "@vueuse/core";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const showDropdown = ref(false);
const dropdownRef = ref(null);

onClickOutside(dropdownRef, () => {
  showDropdown.value = false;
});

const userInitials = computed(() => {
  if (!authStore.user) return "";

  return `${authStore.user.name.charAt(0)}${authStore.user.surname.charAt(0)}`.toUpperCase();
});

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: "Login" });
};

const navigation = [
  { name: "Agenda", path: "/", icon: "calendar" },
  { name: "Clienti", path: "/clients", icon: "users" },
  { name: "Trattamenti", path: "/treatments", icon: "sparkles" },
];

const isActiveRoute = (path: string) => route.path === path;
</script>

<template>
  <div class="flex bg-surface font-sans">
    <aside class="w-64 bg-surface border-r border-gray-200">
      <div class="h-20 flex items-center px-6 border-b border-gray-100">
        <div class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
          <img src="../../public/img/logo.png" alt="Logo" />
        </div>
        <h1 class="text-gray-800 text-lg">CC Beauty Lab</h1>
      </div>
      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.path"
          class="flex px-4 py-3 text-sm font-medium rounded-full transition-colors"
          :class="[route.path === item.path ? 'bg-pink-50 ' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
          <svg
            v-if="item.icon === 'calendar'"
            :class="['w-5 h-5 mr-3', isActiveRoute(item.path) ? 'text-pink-400' : 'text-gray-400']"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <svg
            v-if="item.icon === 'users'"
            :class="['w-5 h-5 mr-3', isActiveRoute(item.path) ? 'text-pink-400' : 'text-gray-400']"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg
            v-if="item.icon === 'sparkles'"
            :class="['w-5 h-5 mr-3', isActiveRoute(item.path) ? 'text-pink-400' : 'text-gray-400']"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>

          {{ item.name }}
        </RouterLink>
      </nav>
    </aside>
    <!-- TopBar -->
    <div class="flex-1">
      <header class="h-20 bg-white border-b border-gray-200 flex items-center justify-end px-8">
        <div ref="dropdownRef" class="relative border border-gray-200 p-1.5 rounded-full hover:bg-pink-100">
          <button @click="showDropdown = !showDropdown" class="flex items-center space-x-3 cursor-pointer">
            <div class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center font-bold text-sm">
              {{ userInitials }}
            </div>
            <div class="hidden md:block text-left">
              <p class="text-sm font-semibold text-gray-900 leading-tight">{{ authStore.user?.name }} {{ authStore.user?.surname }}</p>
              <p class="text-xs text-gray-500 capitalize">{{ authStore.user?.role }}</p>
            </div>
            <svg class="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <!-- Dropdown -->
          <transition name="dropdown-fade">
            <div v-if="showDropdown" class="absolute origin-top right-0 mt-3 p-2 bg-white rounded-lg shadow-lg border border-gray-100 w-full z-50">
              <div class="flex font-semibold py-1 px-1 text-sm overflow-hidden text-ellipsis">{{ authStore.user?.email }}</div>
              <div class="-mx-2 my-1 h-px border border-gray-100"></div>
              <div class="px-1 mt-1 hover:bg-pink-100 flex items-center justify-between rounded-sm transition-colors" @click="handleLogout">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mr-1 h-4 w-4"
                  aria-hidden="true">
                  <path d="m16 17 5-5-5-5"></path>
                  <path d="M21 12H9"></path>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                </svg>
                <button class="block text-left px-1 py-1 text-sm w-full cursor-pointer">Esci</button>
              </div>
            </div>
          </transition>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto px-8 pb-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: scaleY(0.95) translateY(-10px);
}

.dropdown-fade-enter-to,
.dropdown-fade-leave-from {
  opacity: 1;
  transform: scaleY(1) translateY(0);
}
</style>
