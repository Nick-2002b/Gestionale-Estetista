<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BaseModal from "./BaseModal.vue";
import { api } from "../utils/axios";
import { calculateEndTime } from "../utils/timeCalculator";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close", "save", "addNewClient"]);

const selectedClientId = ref<number | null>(null);
const date = ref("");
const startTime = ref("");
const endTime = ref("");
const notes = ref("");

interface TreatmentSelection {
  id: number;
  treatmentId: number | "";
  is_active?: boolean;
}

interface ClientOption {
  id: number;
  name: string;
  surname: string;
}

interface TreatmentOption {
  id: number;
  name: string;
  duration: number;
  is_active: number;
}

const clients = ref<ClientOption[]>([]);
const availableTreatments = ref<TreatmentOption[]>([]);
const selectedTreatments = ref<TreatmentSelection[]>([{ id: Date.now(), treatmentId: "" }]);

const totalDuration = computed(() => {
  return selectedTreatments.value.reduce((sum, selectedTreatment) => {
    const treatment = availableTreatments.value.find((item) => item.id === selectedTreatment.treatmentId);
    return sum + (treatment?.duration ?? 0);
  }, 0);
});

const syncEndTime = () => {
  endTime.value = calculateEndTime(startTime.value, totalDuration.value);
};

const loadFormData = async () => {
  const [clientsResponse, treatmentsResponse] = await Promise.all([api.get("/clients"), api.get("/treatments")]);

  clients.value = clientsResponse.data.clients ?? [];
  availableTreatments.value = treatmentsResponse.data.treatments ?? [];
};

watch(
  () => props.isOpen,
  async (isNowOpen) => {
    if (isNowOpen) {
      const today = new Date();

      date.value = today.toISOString().split("T")[0];

      selectedClientId.value = null;
      startTime.value = "";
      endTime.value = "";
      notes.value = "";
      selectedTreatments.value = [{ id: Date.now(), treatmentId: "" }];

      try {
        await loadFormData();
      } catch (error) {
        console.error("Errore caricamento clienti/trattamenti:", error);
      }
    }
  },
);

watch([startTime, totalDuration], syncEndTime, { immediate: true });

const addTreatment = () => {
  selectedTreatments.value.push({ id: Date.now(), treatmentId: "" });
};

const removeTreatment = (index: number) => {
  selectedTreatments.value.splice(index, 1);
};

const handleSave = () => {
  const payload = {
    clientId: selectedClientId.value,
    treatments: selectedTreatments.value.map((t) => t.treatmentId).filter((id): id is number => typeof id === "number"),
    date: date.value,
    startTime: startTime.value,
    endTime: endTime.value,
    notes: notes.value,
  };
  if (!payload.clientId || !payload.date || !payload.startTime) {
    alert("Compila i campi obbligatori");
    return;
  }
  emit("save", payload);
};
</script>

<template>
  <BaseModal :is-open="isOpen" title="Nuovo Appuntamento" @close="$emit('close')">
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-1"> Cliente <span class="text-red-500">*</span> </label>
      <select v-model="selectedClientId" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none bg-surface">
        <option value="" disabled>Seleziona un cliente</option>
        <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name }} {{ client.surname }}</option>
      </select>
      <button @click="$emit('addNewClient')" class="mt-2 text-sm text-primary hover:text-pink-500 flex items-center"><span class="mr-1">+</span> Aggiungi nuovo cliente</button>
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-1"> Trattamenti <span class="text-red-500">*</span> </label>
      <!-- SELECT TRATTAMENTI -->
      <div class="space-y-3 mb-3">
        <div v-for="(treatment, index) in selectedTreatments" :key="treatment.id" class="flex">
          <select v-model="treatment.treatmentId" class="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none bg-surface">
            <option value="" disabled>Seleziona un trattamento</option>
            <option v-for="t in availableTreatments" :key="t.id" :value="t.id" :disabled="!t.is_active" :class="!t.is_active ? 'text-gray-400 bg-gray-50' : 'text-gray-900'">
              {{ t.name }}
            </option>
          </select>

          <button v-if="selectedTreatments.length > 1" @click="removeTreatment(index)" class="ms-2 p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      <button @click="addTreatment" class="w-full py-2.5 bg-pink-50 shadow-sm border border-pink-200 text-primary font-medium rounded-lg hover:bg-pink-100 transition-colors">
        <span class="text-lg">+</span> Aggiungi un altro trattamento
      </button>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1"> Data <span class="text-red-500">*</span> </label>
        <input type="date" v-model="date" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none" />
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1"> Ora Inizio <span class="text-red-500">*</span> </label>
        <input type="time" v-model="startTime" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none" />
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1"> Ora Fine <span class="text-red-500">*</span> </label>
        <input type="time" v-model="endTime" readonly class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none" />
      </div>
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-1">Note</label>
      <textarea
        v-model="notes"
        rows="2"
        placeholder="Note aggiuntive..."
        class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 outline-none"></textarea>
    </div>

    <template #footer>
      <button @click="$emit('close')" class="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors bg-white shadow-sm">Annulla</button>
      <button @click="handleSave" class="px-5 py-2.5 font-medium rounded-xl bg-primary hover:bg-primary/70 transition-colors shadow-sm">Crea Appuntamento</button>
    </template>
  </BaseModal>
</template>
