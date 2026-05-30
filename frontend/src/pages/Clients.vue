<script setup lang="ts">
import PageHeader from "../components/ViewHeader.vue";
import ClientsModal from "../components/ClientsModal.vue";
import { ref, onMounted, computed } from "vue";
import { useClientStore } from "../stores/clients.js";

const clientStore = useClientStore();

onMounted(() => {
  clientStore.fetchClients();
});

const isModalOpen = ref(false);
const isEditing = ref(false);
const currentClientId = ref<number | null>(null);

const clientForm = ref({
  name: "",
  surname: "",
  email: "",
  phone: "",
  sex: "F" as "M" | "F" | "Altro",
  birth_date: "",
  notes: "",
});
const resetModalForm = () => {
  clientForm.value = { name: "", surname: "", email: "", phone: "", sex: "Altro", notes: "", birth_date: "" };
  isEditing.value = false;
  currentClientId.value = null;
};

const openModal = () => {
  resetModalForm();
  isModalOpen.value = true;
};

const editClient = (id: number) => {
  const clientToEdit = clientStore.clientsList.find((c) => c.id === id);
  if (clientToEdit) {
    clientForm.value = {
      name: clientToEdit.name,
      surname: clientToEdit.surname,
      email: clientToEdit.email,
      phone: clientToEdit.phone,
      sex: clientToEdit.sex,
      birth_date: clientToEdit.birth_date || "",
      notes: clientToEdit.notes,
    };
    isEditing.value = true;
    currentClientId.value = id;
    isModalOpen.value = true;
  }
};

const saveClient = async (payload: any) => {
  try {
    if (isEditing.value && currentClientId.value) {
      await clientStore.editClient(currentClientId.value, payload);
    } else {
      await clientStore.createClient(payload);
    }

    isModalOpen.value = false;
  } catch (error) {
    console.error("Errore durante il salvataggio del cliente:", error);
  }
};

const deleteClient = async (id: number) => {
  if (confirm("Sei sicuro di voler eliminare questo cliente?")) {
    try {
      await clientStore.deleteClient(id);
    } catch (error) {
      console.error("Errore durante l'eliminazione del cliente:", error);
    }
  }
};

const searchQuery = ref("");
const sortBy = ref("name");
const filteredAndSortedClients = computed(() => {
  let result = clientStore.clientsList;

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((client) => client.name.toLowerCase().includes(q) || client.surname.toLowerCase().includes(q) || client.email.toLowerCase().includes(q) || client.phone.includes(q));
  }

  return result.sort((a, b) => {
    if (sortBy.value === "name") {
      return a.surname.localeCompare(b.surname);
    } else if (sortBy.value === "recent") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy.value === "appointments") {
      return b.appointment_count - a.appointment_count;
    }
    return 0;
  });
});

const getInitials = (name: string, surname: string) => {
  return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
};
</script>
<template>
  <div class="space-y-4 relative">
    <PageHeader title="Clienti" button-text="Nuovo Cliente" @action="openModal" />
    <ClientsModal :is-open="isModalOpen" @close="isModalOpen = false" @save="saveClient" />
    <div class="bg-surface flex-col flex-1">
      <div class="pb-2">
        <div class="flex space-x-4">
          <div class="relative w-full max-w-md">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input v-model="searchQuery" type="text" placeholder="Cerca per nome, email o telefono" class="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-light transition-shadow" />
          </div>

          <select v-model="sortBy" class="bg-surface border border-gray-300 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-light cursor-pointer">
            <option value="name">Ordina: Nome</option>
            <option value="recent">Ordina: Più recenti</option>
            <option value="appointments">Ordina: Più appuntamenti</option>
          </select>
        </div>
      </div>

      <div>
        <table class="w-full text-left overflow-hidden rounded-3xl">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
              <th class="py-3 px-6 font-semibold">Cliente</th>
              <th class="py-3 px-6 font-semibold">Contatti</th>
              <th class="py-3 px-6 font-semibold text-center">Sesso</th>
              <th class="py-3 px-6 font-semibold text-center">Appuntamenti</th>
              <th class="py-3 px-6 font-semibold text-right">Azioni</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="client in filteredAndSortedClients" :key="client.id" class="hover:bg-gray-100/50 transition-colors"></tr>

            <tr v-if="filteredAndSortedClients.length === 0">
              <td colspan="5" class="py-12 text-center text-gray-500">Nessun cliente trovato con i filtri attuali.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
