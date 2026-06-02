<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppointmentModal from "../components/AppointmentModal.vue";
import ClientsModal from "../components/ClientsModal.vue";
import ConfirmDialog from "../components/ConfirmDialog.vue";
import { useAppointmentStore } from "../stores/appointments";
import { useClientStore } from "../stores/clients";

type ClientPayload = {
  name: string;
  surname: string;
  email: string;
  phone: string;
  sex: "M" | "F" | "Altro";
  birth_date: string;
  notes: string;
};

const route = useRoute();
const router = useRouter();
const clientStore = useClientStore();
const appointmentStore = useAppointmentStore();

const isLoading = ref(true);
const isEditOpen = ref(false);
const isDeleteOpen = ref(false);
const isAppointmentEditOpen = ref(false);
const currentEditAppointmentId = ref<string | null>(null);
const selectedClient = ref<ClientPayload | undefined>();

const clientId = Number(route.params.id);

const loadData = async () => {
  isLoading.value = true;
  try {
    await Promise.all([clientStore.fetchClients(), appointmentStore.fetchAppointments()]);
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadData);

const currentClient = computed(() => clientStore.clientsList.find((client) => client.id === clientId));

const clientAppointments = computed(() =>
  appointmentStore.appointmentsList
    .filter((appointment) => Number(appointment.client_id) === clientId)
    .slice()
    .sort((a, b) => new Date(`${b.date}T${b.start_time}`).getTime() - new Date(`${a.date}T${a.start_time}`).getTime()),
);

const getInitials = (name: string, surname: string) => `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();

const formatDate = (value?: string) => {
  if (!value) return "-";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "long", year: "numeric" }).format(parsedDate);
};

const getAge = (birthDate?: string) => {
  if (!birthDate) return null;

  const parsedDate = new Date(birthDate);
  if (Number.isNaN(parsedDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - parsedDate.getFullYear();
  const monthDiff = today.getMonth() - parsedDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsedDate.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
};

const formatAppointmentDate = (value: string) => {
  const parsedDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return new Intl.DateTimeFormat("it-IT", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).format(parsedDate);
};

const formatCurrency = (value?: number) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(value ?? 0);

const formatDuration = (appointment: any) => {
  if (appointment.total_duration > 0) {
    return `${appointment.total_duration} min`;
  }

  const durationFromTreatments = (appointment.treatments ?? []).reduce((total: number, treatment: any) => total + Number(treatment.duration || 0), 0);
  return durationFromTreatments > 0 ? `${durationFromTreatments} min` : "Durata non disponibile";
};

const formatTreatmentNames = (appointment: any) => {
  const names = (appointment.treatments ?? []).map((treatment: any) => treatment.name).filter(Boolean);
  return names.length ? names.join(", ") : "Nessun trattamento";
};

const openEditClient = () => {
  if (!currentClient.value) return;

  selectedClient.value = {
    name: currentClient.value.name,
    surname: currentClient.value.surname,
    email: currentClient.value.email,
    phone: currentClient.value.phone,
    sex: currentClient.value.sex,
    birth_date: currentClient.value.birth_date || "",
    notes: currentClient.value.notes,
  };

  isEditOpen.value = true;
};

const saveClient = async (payload: ClientPayload) => {
  if (!currentClient.value) return;

  await clientStore.editClient(currentClient.value.id, payload);
  isEditOpen.value = false;
  await loadData();
};

const openEditAppointment = (appointmentId: number) => {
  currentEditAppointmentId.value = String(appointmentId);
  isAppointmentEditOpen.value = true;
};

const saveAppointment = async (payload: any) => {
  if (!currentEditAppointmentId.value) return;

  await appointmentStore.updateAppointment(currentEditAppointmentId.value, payload);
  isAppointmentEditOpen.value = false;
  currentEditAppointmentId.value = null;
  await appointmentStore.fetchAppointments();
};

const closeAppointmentModal = () => {
  isAppointmentEditOpen.value = false;
  currentEditAppointmentId.value = null;
};

const askDeleteClient = () => {
  isDeleteOpen.value = true;
};

const confirmDeleteClient = async () => {
  if (!currentClient.value) return;

  await clientStore.deleteClient(currentClient.value.id);
  isDeleteOpen.value = false;
  router.push({ name: "Clients" });
};

const goBack = () => {
  router.push({ name: "Clients" });
};
</script>

<template>
  <div class="space-y-4 md:space-y-5 p-4">
    <ClientsModal :is-open="isEditOpen" :is-editing="true" :client="selectedClient" @close="isEditOpen = false" @save="saveClient" />
    <AppointmentModal :is-open="isAppointmentEditOpen" :edit-appointment-id="currentEditAppointmentId" @close="closeAppointmentModal" @save="saveAppointment" />
    <ConfirmDialog :is-open="isDeleteOpen" title="Elimina Cliente" message="Sei sicuro di voler eliminare questo cliente?" @confirm="confirmDeleteClient" @cancel="isDeleteOpen = false" />

    <div class="flex items-center justify-end gap-2">
      <button @click="goBack" class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-surface px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Indietro
      </button>
      <button @click="openEditClient" class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-surface text-gray-600 shadow-sm transition-colors hover:bg-gray-50" aria-label="Modifica cliente">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
      <button @click="askDeleteClient" class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-surface text-red-500 shadow-sm transition-colors hover:bg-red-50" aria-label="Elimina cliente">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <div v-if="isLoading" class="rounded-3xl border border-dashed border-gray-200 bg-surface px-6 py-12 text-center text-gray-500 shadow-sm">Caricamento dettagli cliente...</div>

    <template v-else-if="currentClient">
      <section class="rounded-3xl border border-gray-200 bg-surface p-5 md:p-6 shadow-sm">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-4 min-w-0">
            <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-pink-100 text-lg font-bold text-gray-800">
              {{ getInitials(currentClient.name, currentClient.surname) }}
            </div>

            <div class="min-w-0">
              <h1 class="truncate text-2xl md:text-3xl font-semibold text-gray-900">{{ currentClient.name }} {{ currentClient.surname }}</h1>
              <p class="mt-1 text-sm text-gray-500">Cliente dal {{ formatDate(currentClient.created_at) }} • {{ currentClient.sex }}</p>

              <div class="mt-3 flex flex-wrap gap-2 text-sm text-gray-600">
                <span v-if="currentClient.phone" class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {{ currentClient.phone }}
                </span>
                <span v-if="currentClient.email" class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {{ currentClient.email }}
                </span>
                <span v-if="currentClient.birth_date" class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 2v4m8-4v4m-9 4h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Nato il {{ formatDate(currentClient.birth_date) }}
                  <span v-if="getAge(currentClient.birth_date) !== null">• {{ getAge(currentClient.birth_date) }} anni</span>
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="inline-flex items-center rounded-full bg-pink-50 px-3 py-1.5 text-sm font-semibold text-gray-700">{{ currentClient.appointment_count }} appuntamenti</span>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-gray-200 bg-surface p-5 md:p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-900">Storico appuntamenti</h2>

        <div v-if="clientAppointments.length === 0" class="mt-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-gray-500">Nessun appuntamento registrato per questo cliente.</div>

        <div v-else class="mt-5 space-y-3">
          <article v-for="appointment in clientAppointments" :key="appointment.id" class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-surface p-4 transition-colors hover:bg-gray-50 md:flex-row md:items-center md:justify-between">
            <div class="flex items-start gap-3 min-w-0">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div class="min-w-0">
                <h3 class="truncate text-sm font-semibold text-gray-900">{{ formatTreatmentNames(appointment) }}</h3>
                <p class="mt-1 text-xs text-gray-500">{{ formatAppointmentDate(appointment.date) }} • {{ appointment.start_time.slice(0, 5) }} - {{ appointment.end_time.slice(0, 5) }} • {{ formatDuration(appointment) }}</p>
                <p v-if="appointment.notes" class="mt-2 text-sm text-gray-600">{{ appointment.notes }}</p>
              </div>
            </div>

            <div class="flex items-center justify-between gap-3 md:justify-end">
              <div class="text-right">
                <div class="text-sm font-semibold text-gray-800">{{ formatCurrency(appointment.total_price) }}</div>
              </div>

              <button @click="openEditAppointment(appointment.id)" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800" aria-label="Modifica appuntamento">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </article>
        </div>
      </section>
    </template>

    <div v-else class="rounded-3xl border border-dashed border-gray-200 bg-surface px-6 py-12 text-center shadow-sm">
      <p class="text-gray-600">Cliente non trovato.</p>
      <button @click="goBack" class="mt-4 inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-primary/70">Torna alla lista clienti</button>
    </div>
  </div>
</template>
