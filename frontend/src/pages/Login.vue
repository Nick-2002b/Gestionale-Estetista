<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const isLogin = ref(true);
const showPassword = ref(false);

const handleLogin = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    await authStore.login({
      email: email.value,
      password: password.value,
    });

    router.push({ name: "Dashboard" });
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || "Errore imprevisto durante il login.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="h-screen w-full grid md:grid-cols-2 font-sans">
    <!-- Prima meta -->
    <div class="hidden md:flex flex-col items-center justify-center bg-linear-to-br from-pink-light via-primary/30 to-gold-light text-white p-8">
      <div class="w-50 h-50 rounded-full flex items-center mb-6 overflow-hidden shadow-2xl">
        <img src="../../public/img/logo.png" alt="Logo" />
      </div>
      <h1 class="text-3xl font-bold text-foreground mb-4 text-balance text-black">CC Beauty Lab</h1>
    </div>
    <!-- Second Meta -->
    <div class="flex items-center justify-center bg-surface p-6">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800 md:hidden mb-2">CC Beauty Lab</h2>
          <h3 class="text-xl font-semibold text-gray-600">Accedi al tuo gestionale</h3>
        </div>
        <!-- Switch registrati/login -->
        <div class="flex bg-background p-1 rounded-lg mb-8">
          <button @click="isLogin = true" :class="['flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200', isLogin ? 'bg-surface shadow-sm' : 'text-gray-500 hover:text-gray-700']">
            Accedi
          </button>
          <button
            @click="isLogin = false"
            :class="['flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200', !isLogin ? 'bg-surface shadow-sm ' : 'text-gray-500 hover:text-gray-700']">
            Registrati
          </button>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div class="relative">
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
                class="lucide lucide-mail absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true">
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              </svg>
              <input
                type="email"
                id="email"
                v-model="email"
                required
                class="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-light focus:border-pink-light outline-none transition-colors"
                placeholder="admin@ccbeautylab.it" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
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
                class="lucide lucide-lock absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                required
                class="w-full pl-12 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-light focus:border-pink-light outline-none transition-colors"
                placeholder="••••••••" />
              <button @click="showPassword = !showPassword" type="button" class="absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  v-if="!showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-eye h-4 w-4"
                  aria-hidden="true">
                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-eye-off h-4 w-4"
                  aria-hidden="true">
                  <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"></path>
                  <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"></path>
                  <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"></path>
                  <path d="m2 2 20 20"></path>
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" class="w-full bg-primary hover:bg-primary/70 text-text-main font-semibold py-3 px-4 rounded-lg transition-colors duration-200">
            {{ isLogin ? "Accedi" : "Registrati" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
