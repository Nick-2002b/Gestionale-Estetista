<script setup lang="ts">
import { ref, watch } from "vue";
import BaseModal from "./BaseModal.vue";
import type { Treatment, Category } from "../stores/treatments";
import { useTreatmentStore } from "../stores/treatments";

const props = defineProps<{
  isOpen: boolean;
  isEditing?: boolean;
  treatment?: Partial<Treatment>;
  categories: Category[];
}>();

const emit = defineEmits(["close", "save"]);

const store = useTreatmentStore();

const name = ref("");
const categoryId = ref<number | "">("");
const duration = ref<number | "">(30);
const price = ref<number | "">(0);
const description = ref("");
const showNewCategoryForm = ref(false);
const newCategoryName = ref("");

const resetFields = () => {
  name.value = "";
  categoryId.value = "";
  duration.value = 30;
  price.value = 0;
  description.value = "";
  showNewCategoryForm.value = false;
  newCategoryName.value = "";
};

const fillFields = (treatment?: Partial<Treatment>) => {
  if (!treatment) {
    resetFields();
    return;
  }

  name.value = treatment.name ?? "";
  categoryId.value = treatment.category_id ?? "";
  duration.value = treatment.duration ?? 30;
  price.value = treatment.price ?? 0;
  description.value = treatment.description ?? "";
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      fillFields(props.treatment);
      return;
    }

    resetFields();
  },
);

const handleSave = () => {
  if (!name.value || !categoryId.value) {
    alert("I campi Nome e Categoria sono obbligatori.");
    return;
  }

  const payload: Treatment = {
    id: props.treatment?.id ?? 0,
    name: name.value,
    category_id: Number(categoryId.value),
    category_name: props.categories.find((category) => category.id === Number(categoryId.value))?.name ?? "",
    duration: Number(duration.value),
    price: Number(price.value),
    description: description.value,
    is_active: props.treatment?.is_active ?? 1,
  };

  emit("save", payload);
};

const openNewCategoryForm = () => {
  showNewCategoryForm.value = true;
  newCategoryName.value = "";
};

const closeNewCategoryModal = () => {
  showNewCategoryForm.value = false;
  newCategoryName.value = "";
};

const handleCreateCategory = async () => {
  const trimmedName = newCategoryName.value.trim();

  if (!trimmedName) {
    alert("Inserisci il nome della categoria.");
    return;
  }

  try {
    const createdCategory = await store.createCategory(trimmedName);
    categoryId.value = createdCategory.id;
    closeNewCategoryModal();
  } catch (error) {
    alert("Errore durante la creazione della categoria.");
  }
};
</script>

<template>
  <BaseModal :is-open="isOpen" :title="isEditing ? 'Modifica Trattamento' : 'Nuovo Trattamento'" @close="emit('close')">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Nome Trattamento <span class="text-red-500">*</span></label>
        <input v-model="name" type="text" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none" placeholder="Nome trattamento" />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Categoria <span class="text-red-500">*</span></label>
        <div class="flex gap-2">
          <select v-model="categoryId" class="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none bg-surface">
            <option value="" disabled>Seleziona categoria...</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
          </select>
          <button type="button" @click="openNewCategoryForm" class="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">+ Nuova</button>
        </div>
        <!-- Form aggiunta nuova categoria -->
        <div v-if="showNewCategoryForm" class="mt-3 rounded-lg border border-dashed border-pink-200 bg-pink-50/60 p-3 space-y-3">
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Nome nuova categoria</label>
            <input v-model="newCategoryName" type="text" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none bg-white" placeholder="Es. Massaggi" @keyup.enter="handleCreateCategory" />
          </div>

          <div class="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <button type="button" @click="closeNewCategoryModal" class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors">Annulla</button>
            <button type="button" @click="handleCreateCategory" class="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/80 transition-colors">Aggiungi categoria</button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Durata (min) <span class="text-red-500">*</span></label>
          <input v-model="duration" type="number" min="5" step="5" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Prezzo (€)</label>
          <input v-model="price" type="number" min="0" step="0.5" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Descrizione</label>
        <textarea v-model="description" rows="3" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none" placeholder="Note, dettagli trattamento..."></textarea>
      </div>
    </div>

    <template #footer>
      <button @click="emit('close')" class="w-full sm:w-auto px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors bg-white shadow-sm">Annulla</button>
      <button @click="handleSave" class="w-full sm:w-auto px-5 py-2.5 font-medium rounded-xl bg-primary hover:bg-primary/70 transition-colors shadow-sm">{{ isEditing ? "Salva Modifiche" : "Crea Trattamento" }}</button>
    </template>
  </BaseModal>
</template>
