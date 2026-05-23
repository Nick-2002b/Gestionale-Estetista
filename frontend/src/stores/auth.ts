import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "../utils/axios";

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref<boolean>(false);
  const isReady = ref<boolean>(false);

  const checkAuth = async (): Promise<void> => {
    try {
      const response = await api.get("/auth/me");
      user.value = response.data.user;
      isAuthenticated.value = true;
    } catch (error) {
      user.value = null;
      isAuthenticated.value = false;
    } finally {
      isReady.value = true;
    }
  };

  const login = async (credentials: Record<string, string>): Promise<void> => {
    const response = await api.post("/auth/login", credentials);
    user.value = response.data.user;
    isAuthenticated.value = true;
  };

  const logout = async (): Promise<void> => {
    await api.post("/auth/logout");
    user.value = null;
    isAuthenticated.value = false;
  };

  return { user, isAuthenticated, isReady, checkAuth, login, logout };
});
