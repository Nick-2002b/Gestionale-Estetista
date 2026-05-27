import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "../utils/axios";

export const useAppointmentStore = defineStore("appointments", () => {
  const appointmentsList = ref<any[]>([]);
  const isLoading = ref(false);

  const fetchAppointments = async () => {
    try {
      isLoading.value = true;
      const response = await api.get("/appointments");
      appointmentsList.value = response.data.appointments;
    } catch (error) {
      console.error("Errore durante il fetch degli appuntamenti:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const createAppointment = async (payload: any) => {
    try {
      isLoading.value = true;
      await api.post("/appointments", payload);
      await fetchAppointments(); // aggiornamento degli appuntamenti per includere il nuovo appuntamento inserito
    } catch (error) {
      console.error("Errore durante la creazione:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteAppointment = async (id: number | string) => {
    try {
      isLoading.value = true;
      await api.delete(`/appointments/${id}`);
      await fetchAppointments();
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    appointmentsList,
    isLoading,
    fetchAppointments,
    createAppointment,
    deleteAppointment,
  };
});
