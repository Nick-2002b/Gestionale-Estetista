<script setup lang="ts">
import PageHeader from "../components/ViewHeader.vue";
import ClientsModal from "../components/ClientsModal.vue";
import { ref, onMounted, computed } from "vue";
import { useClientStore } from "../stores/clients.js";
import ConfirmDialog from "../components/ConfirmDialog.vue";

type ClientPayload = {
  name: string;
  surname: string;
  email: string;
  phone: string;
  sex: "M" | "F" | "Altro";
  birth_date: string;
  notes: string;
};

const clientStore = useClientStore();

onMounted(() => {
  clientStore.fetchClients();
});

const isModalOpen = ref(false);
const isEditing = ref(false);
const currentClientId = ref<number | null>(null);
const isConfirmOpen = ref(false);
const clientToDelete = ref<number | null>(null);

const selectedClient = ref<ClientPayload | undefined>();

const openModal = () => {
  selectedClient.value = undefined;
  isEditing.value = false;
  currentClientId.value = null;
  isModalOpen.value = true;
};

const editClient = (id: number) => {
  const clientToEdit = clientStore.clientsList.find((c) => c.id === id);
  if (clientToEdit) {
    selectedClient.value = {
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

const saveClient = async (payload: ClientPayload) => {
  try {
    if (isEditing.value && currentClientId.value !== null) {
      await clientStore.editClient(currentClientId.value, payload);
    } else {
      await clientStore.createClient(payload);
    }

    isModalOpen.value = false;
  } catch (error) {
    console.error("Errore durante il salvataggio del cliente:", error);
  }
};
const askDeleteClient = (id: number) => {
  isConfirmOpen.value = true;
  clientToDelete.value = id;
};

const confirmDelete = async () => {
  if (clientToDelete.value) {
    try {
      await clientStore.deleteClient(clientToDelete.value);
    } catch (error) {
      console.error("Errore durante l'eliminazione del cliente:", error);
    }
  }
  isConfirmOpen.value = false;
};

const cancelDelete = () => {
  isConfirmOpen.value = false;
};

const searchQuery = ref("");
const sortBy = ref("name");
const filteredAndSortedClients = computed(() => {
  let result = [...clientStore.clientsList];

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((client) => {
      const name = client.name?.toLowerCase() ?? "";
      const surname = client.surname?.toLowerCase() ?? "";
      const email = client.email?.toLowerCase() ?? "";
      const phone = client.phone?.toLowerCase() ?? "";

      return name.includes(q) || surname.includes(q) || email.includes(q) || phone.includes(q);
    });
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
    <ClientsModal :is-open="isModalOpen" :is-editing="isEditing" :client="selectedClient" @close="isModalOpen = false" @save="saveClient" />
    <ConfirmDialog :is-open="isConfirmOpen" title="Elimina Cliente" message="Sei sicuro di voler eliminare questo cliente?" @confirm="confirmDelete" @cancel="cancelDelete" />
    <div class="bg-surface flex-col flex-1">
      <div class="pb-2">
        <div class="flex space-x-4">
          <div class="relative w-full max-w-md">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input v-model="searchQuery" type="search" placeholder="Cerca per nome, email o telefono" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-pink-light transition-shadow" />
          </div>

          <select v-model="sortBy" class="bg-surface border border-gray-300 rounded-full shadow-sm px-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-light cursor-pointer">
            <option value="name">Ordina: Nome</option>
            <option value="recent">Ordina: Più recenti</option>
            <option value="appointments">Ordina: Più appuntamenti</option>
          </select>
        </div>
      </div>

      <div class="overflow-hidden rounded-3xl border border-gray-300 shadow-sm">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
              <th class="py-3 px-6 font-semibold">Cliente</th>
              <th class="py-3 px-6 font-semibold">Contatti</th>
              <th class="py-3 px-6 font-semibold text-center">Sesso</th>
              <th class="py-3 px-6 font-semibold text-center">Appuntamenti</th>
              <th class="py-3 px-6 font-semibold text-center">Azioni</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="client in filteredAndSortedClients" :key="client.id" class="hover:bg-gray-100/50 transition-colors">
              <!-- Colonna Cliente -->
              <td class="py-4 px-4 flex">
                <div class="h-10 w-10 flex rounded-full bg-pink-100 justify-center items-center font-bold text-sm">
                  {{ getInitials(client.name, client.surname) }}
                </div>
                <div class="ms-3">
                  <div class="font-bold">{{ client.name }} {{ client.surname }}</div>
                  <div class="text-xs text-gray-500">Cliente dal {{ client.created_at }}</div>
                </div>
              </td>

              <!-- Colonna Contatti -->
              <td class="space-y-1">
                <div v-if="client.phone" class="flex items-center text-sm text-gray-600">
                  <svg class="w-3.5 h-3.5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {{ client.phone }}
                </div>
                <div v-if="client.email" class="flex items-center text-sm text-gray-600">
                  <svg class="w-3.5 h-3.5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {{ client.email }}
                </div>
                <div v-if="!client.phone && !client.email" class="text-sm text-gray-400 italic">Nessun contatto</div>
              </td>
              <!-- Colonna Sesso -->
              <td class="text-center">
                <span v-if="client.sex" class="inline-flex justify-center border border-gray-200 rounded-full text-xs h-6 items-center shadow-sm" :class="client.sex === 'Altro' ? 'px-2' : 'w-6'">{{ client.sex }}</span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <!-- Colonna Totale appuntamenti -->
              <td class="text-center">
                <span class="inline-flex items-center bg-pink-50 rounded-full px-2 py-1">
                  <svg class="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ client.appointment_count }}
                </span>
              </td>
              <!-- Colonna Bottoni azioni -->
              <td class="text-center">
                <button @click="editClient(client.id)" class="text-gray-400 hover:text-gray-900 transition-colors rounded-lg p-1 hover:bg-pink-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="none" viewBox="0 2 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button @click="askDeleteClient(client.id)" class="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="none" viewBox="0 2 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="filteredAndSortedClients.length === 0">
              <td colspan="5" class="py-12 text-center text-gray-500">Nessun cliente trovato con i filtri attuali.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
