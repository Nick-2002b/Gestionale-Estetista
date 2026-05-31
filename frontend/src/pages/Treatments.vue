<script setup lang="ts">
import PageHeader from "../components/ViewHeader.vue";
import TreatmentModal from "../components/TreatmentModal.vue";
import { ref, computed, onMounted } from "vue";
import { useTreatmentStore } from "../stores/treatments";
import type { Treatment } from "../stores/treatments";
import ConfirmDialog from "../components/ConfirmDialog.vue";

const store = useTreatmentStore();

onMounted(() => {
  store.fetchData();
});

const searchQuery = ref("");
const selectedCategoryId = ref<number | "all">("all");
const isConfirmOpen = ref(false);
const treatmentToDelete = ref<number | null>(null);

const confirmDelete = async () => {
  if (treatmentToDelete.value) {
    try {
      await store.deleteTreatment(treatmentToDelete.value);
    } catch (error) {
      console.error("Errore durante l'eliminazione del trattamento:", error);
    }
  }
  isConfirmOpen.value = false;
};

const cancelDelete = () => {
  isConfirmOpen.value = false;
};
const askDeleteTreatment = (id: number) => {
  isConfirmOpen.value = true;
  treatmentToDelete.value = id;
};
const filteredTreatments = computed(() => {
  return store.treatmentsList.filter((t: Treatment) => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCategory = selectedCategoryId.value === "all" || t.category_id === selectedCategoryId.value;
    return matchSearch && matchCategory;
  });
});

const isModalOpen = ref(false);
const selectedTreatment = ref<Partial<Treatment> | undefined>(undefined);

const closeModal = () => {
  isModalOpen.value = false;
  selectedTreatment.value = undefined;
};

const handleAddTreatment = () => {
  selectedTreatment.value = {
    id: 0,
    name: "",
    category_id: 0,
    category_name: "",
    duration: 30,
    price: 0,
    description: "",
    is_active: 1,
  };
  isModalOpen.value = true;
};

const handleEdit = (t: Treatment) => {
  selectedTreatment.value = { ...t };
  isModalOpen.value = true;
};

const handleSave = async (payload: Treatment) => {
  try {
    if (payload.id && payload.id > 0) {
      await store.editTreatment(payload.id, payload);
    } else {
      await store.createTreatment(payload);
    }
    await store.fetchData();
    closeModal();
  } catch (err) {
    alert("Errore nel salvataggio del trattamento.");
  }
};

</script>

<template>
  <div class="space-y-6 relative">
    <PageHeader title="Trattamenti" button-text="Nuovo Trattamento" @action="handleAddTreatment" />
    <ConfirmDialog :is-open="isConfirmOpen" title="Elimina Trattamento" message="Sei sicuro di voler eliminare questo trattamento?" @confirm="confirmDelete" @cancel="cancelDelete" />
    <TreatmentModal :is-open="isModalOpen" :treatment="selectedTreatment" :categories="store.categoriesList" :is-editing="!!selectedTreatment?.id" @close="closeModal" @save="handleSave" />

    <div class="flex flex-col sm:flex-row gap-4 items-center">
      <div class="relative w-full md:max-w-md">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="Cerca un Trattamento..." class="w-full pl-10 pr-4 py-2.5 shadow-sm bg-surface border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition-shadow" />
      </div>

      <select v-model="selectedCategoryId" class="w-full sm:w-auto bg-surface border border-gray-300 shadow-sm rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer">
        <option value="all">Tutte le categorie</option>
        <option v-for="cat in store.categoriesList" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>

      <div class="w-full sm:w-auto sm:ml-auto">
        <button class="w-full sm:w-auto bg-surface border border-gray-300 shadow-sm rounded-full py-2.5 px-4 text-sm hover:bg-pink-light cursor-pointer">Gestisci categorie</button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="t in filteredTreatments" :key="t.id" class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
        <div class="flex items-center mb-4">
          <div class="inline-flex items-center px-3 py-1 bg-gray-50 border border-gray-100 rounded-full">
            <svg class="w-4 h-4 text-gray-500 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span class="text-xs font-bold text-gray-800 uppercase tracking-widest">{{ t.category_name }}</span>
          </div>
        </div>

        <h3 class="text-xl font-serif font-bold text-gray-900 mb-2">{{ t.name }}</h3>
        <p class="text-sm text-gray-500 line-clamp-2 mb-5 flex-1">{{ t.description }}</p>

        <div class="flex gap-3 mb-6">
          <span class="inline-flex items-center px-3 py-1.5 bg-pink-50 text-gray-700 text-sm font-semibold rounded-full">
            <svg class="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {{ t.duration }} min
          </span>
          <span class="inline-flex items-center px-3 py-1.5 bg-yellow-100 text-gray-700 text-sm font-semibold rounded-full"> € {{ t.price.toFixed(2) }} </span>
        </div>

        <div class="h-px bg-gray-100 w-full mb-4"></div>

        <div class="flex items-center justify-between">
          <label class="flex items-center cursor-pointer relative">
            <input type="checkbox" class="sr-only peer" :checked="t.is_active === 1" @change="store.toggleStatus(t.id, t.is_active)" />
            <div
              class="w-11 h-6 bg-gray-200 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            <span class="ml-3 text-sm font-medium text-gray-600">{{ t.is_active === 1 ? "Attivo" : "Disattivo" }}</span>
          </label>

          <div class="flex space-x-3">
            <button class="text-gray-400 hover:text-gray-900 transition-colors" @click="handleEdit(t)">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button @click="askDeleteTreatment(t.id)" class="text-red-400 hover:text-red-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
