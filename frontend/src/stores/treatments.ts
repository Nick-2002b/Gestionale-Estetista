import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "../utils/axios";

export interface Treatment {
  id: number;
  name: string;
  category_id: number;
  category_name: string;
  description: string;
  duration: number;
  price: number;
  is_active: number;
}
export interface Category {
  id: number;
  name: string;
  treatments_count?: number;
}

export const useTreatmentStore = defineStore("treatments", () => {
  const treatmentsList = ref<Treatment[]>([]);
  const categoriesList = ref<Category[]>([]);

  const fetchData = async () => {
    try {
      const [treatmentsRes, categoriesRes] = await Promise.all([api.get("/treatments"), api.get("/treatments/categories")]);
      treatmentsList.value = treatmentsRes.data.treatments;
      categoriesList.value = categoriesRes.data.categories;
    } catch (err) {
      console.error("Errore fetch treatments/categories", err);
      throw err;
    }
  };

  const createTreatment = async (payload: Partial<Treatment>) => {
    try {
      await api.post("/treatments", payload);
      await fetchData();
    } catch (error) {
      console.error("Errore createTreatment", error);
      throw error;
    }
  };
  const createCategory = async (name: string) => {
    try {
      const response = await api.post(`/treatments/categories`, { name });
      await fetchData();
      return response.data.category;
    } catch (error) {
      console.error("Errore createCategory", error);
      throw error;
    }
  };

  const updateCategory = async (id: number, name: string) => {
    try {
      await api.post(`/treatments/categories/${id}`, { name });
      await fetchData();
    } catch (error) {
      console.error("Errore updateCategory", error);
      throw error;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await api.delete(`/treatments/categories/${id}`);
      await fetchData();
    } catch (error) {
      console.error("Errore deleteCategory", error);
      throw error;
    }
  };

  const toggleStatus = async (id: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 0 ? 1 : 0;
      await api.post(`/treatments/${id}/status`, { is_active: newStatus });
      await fetchData();
    } catch (error) {
      console.error("Errore toggleStatus", error);
      throw error;
    }
  };
  const editTreatment = async (id: number, payload: Partial<Treatment>) => {
    try {
      await api.post(`/treatments/${id}`, payload);
      await fetchData();
    } catch (error) {
      console.error("Errore updateTreatment", error);
      throw error;
    }
  };

  const deleteTreatment = async (id: number) => {
    try {
      await api.delete(`/treatments/${id}`);
      await fetchData();
    } catch (error) {
      console.error("Errore deleteTreatment", error);
      throw error;
    }
  };
  return {
    treatmentsList,
    categoriesList,
    fetchData,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleStatus,
    editTreatment,
    deleteTreatment,
    createTreatment,
  };
});
