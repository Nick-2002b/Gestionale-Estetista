import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "../utils/axios";

export interface Client {
  id: number;
  name: string;
  surname: string;
  sex: "M" | "F" | "Altro";
  birth_date?: string;
  phone: string;
  email: string;
  notes: string;
  created_at: string;
  appointment_count: number;
}

export const useClientStore = defineStore("clients", () => {
  const clientsList = ref<Client[]>([]);
  const isLoading = ref(false);

  const fetchClients = async () => {
    try {
      isLoading.value = true;
      const response = await api.get("/clients");
      clientsList.value = response.data.clients;
    } catch (error) {
      console.error("Errore durante il fetch dei clienti:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const createClient = async (payload: Record<string, any>) => {
    try {
      isLoading.value = true;
      await api.post("/clients", payload);
      await fetchClients();
    } catch (error) {
      console.error("Errore durante la creazione del cliente:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteClient = async (id: number) => {
    try {
      isLoading.value = true;
      await api.delete(`/clients/${id}`);
      await fetchClients();
    } catch (error) {
      console.error("Errore durante l'eliminazione del cliente:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const editClient = async (id: number, payload: Record<string, any>) => {
    try {
      isLoading.value = true;
      await api.post(`/clients/${id}`, payload);
      await fetchClients();
    } catch (error) {
      console.error("Errore durante l'aggiornamento del cliente:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };
  return {
    clientsList,
    isLoading,
    fetchClients,
    createClient,
    deleteClient,
    editClient,
  };
});
