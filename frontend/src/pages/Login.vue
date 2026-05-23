<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const name = ref("");
const surname = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const isLogin = ref(true);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const resetRegisterFields = () => {
  name.value = "";
  surname.value = "";
  confirmPassword.value = "";
};

const toggleMode = (loginMode: boolean) => {
  isLogin.value = loginMode;
  errorMessage.value = "";
  if (loginMode) {
    resetRegisterFields();
  }
};

const handleLogin = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    await authStore.login({
      email: email.value,
      password: password.value,
    });

    router.push({ name: "Agenda" });
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || "Errore imprevisto durante il login.";
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    if (password.value !== confirmPassword.value) {
      errorMessage.value = "Le password non coincidono.";
      return;
    }

    await authStore.register({
      name: name.value,
      surname: surname.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });

    resetRegisterFields();
    password.value = "";
    isLogin.value = true;
  } catch (error: any) {
    errorMessage.value = error.response?.data?.error || "Errore imprevisto durante la registrazione.";
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = () => {
  return isLogin.value ? handleLogin() : handleRegister();
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
    <div class="flex flex-col items-center justify-center bg-surface p-6">
      <div class="mb-4 md:hidden">
        <div class="w-32 h-32 rounded-full shadow-lg bg-white">
          <img src="../../public/img/logo.png" alt="Logo" />
        </div>
      </div>
      <div class="flex items-center justify-center w-full">
        <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-800 md:hidden mb-2">CC Beauty Lab</h2>
            <h3 class="text-xl font-semibold text-gray-600">Accedi al tuo gestionale</h3>
          </div>
          <!-- Switch registrati/login -->
          <div class="flex bg-background p-1 rounded-lg mb-8">
            <button
              @click="toggleMode(true)"
              :class="['flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200', isLogin ? 'bg-surface shadow-sm' : 'text-gray-500 hover:text-gray-700']">
              Accedi
            </button>
            <button
              @click="toggleMode(false)"
              :class="['flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200', !isLogin ? 'bg-surface shadow-sm ' : 'text-gray-500 hover:text-gray-700']">
              Registrati
            </button>
          </div>
          <!-- Forms -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <transition name="fade">
              <div v-if="errorMessage" class="rounded-lg border border-pink-light px-4 py-3 text-sm bg-background">
                {{ errorMessage }}
              </div>
            </transition>

            <transition name="fade">
              <div v-if="!isLogin" class="grid gap-4 md:grid-cols-2">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
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
                      class="lucide lucide-user absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                      aria-hidden="true">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <input
                      type="text"
                      id="name"
                      v-model="name"
                      required
                      class="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-light focus:border-pink-light outline-none transition-colors"
                      placeholder="Nome" />
                  </div>
                </div>

                <div>
                  <label for="surname" class="block text-sm font-medium text-gray-700 mb-1">Cognome</label>
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
                      class="lucide lucide-user-round absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                      aria-hidden="true">
                      <path d="M2 21a8 8 0 0 1 16 0"></path>
                      <circle cx="10" cy="8" r="5"></circle>
                    </svg>
                    <input
                      type="text"
                      id="surname"
                      v-model="surname"
                      required
                      class="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-light focus:border-pink-light outline-none transition-colors"
                      placeholder="Cognome" />
                  </div>
                </div>
              </div>
            </transition>

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
                <button v-if="password.length > 0" @click="showPassword = !showPassword" type="button" class="absolute right-3 top-1/2 -translate-y-1/2">
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

            <transition name="fade">
              <div v-if="!isLogin">
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Conferma password</label>
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
                    class="lucide lucide-lock-keyhole absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    aria-hidden="true">
                    <path d="M3 11h18"></path>
                    <rect x="3" y="7" width="18" height="12" rx="2"></rect>
                    <circle cx="12" cy="13" r="1"></circle>
                  </svg>
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    id="confirmPassword"
                    v-model="confirmPassword"
                    required
                    class="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-light focus:border-pink-light outline-none transition-colors"
                    placeholder="••••••••" />
                  <button v-if="confirmPassword.length > 0" @click="showConfirmPassword = !showConfirmPassword" type="button" class="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg
                      v-if="!showConfirmPassword"
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
            </transition>
            <!-- Button Submit -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-primary hover:bg-primary/70 disabled:cursor-not-allowed disabled:opacity-70 text-text-main font-semibold py-3 px-4 rounded-lg transition-colors duration-200">
              {{ isLoading ? "Attendere..." : isLogin ? "Accedi" : "Registrati" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  border-width: 0;
  transform: translateY(-8px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  max-height: var(--max-h, 200px);
  transform: translateY(0);
}
</style>
