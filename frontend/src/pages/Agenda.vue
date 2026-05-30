<script setup lang="ts">
import { ref, onMounted, nextTick, computed, onUnmounted } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import type { CalendarOptions } from "@fullcalendar/core";
import { useCalendar } from "../components/Calendar.ts";
import PageHeader from "../components/ViewHeader.vue";
import AppointmentModal from "../components/AppointmentModal.vue";
import { useAppointmentStore } from "../stores/appointments";
import ConfirmDialog from "../components/ConfirmDialog.vue";

const appointmentStore = useAppointmentStore();

const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  eventId: null as string | null,
});

const openContextMenu = (event: MouseEvent, calendarEvent: any) => {
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    eventId: calendarEvent.id,
  };
};

const closeContextMenu = () => {
  contextMenu.value.visible = false;
};

const handleDeleteAppointment = async () => {
  if (!contextMenu.value.eventId) return;
  try {
    await appointmentStore.deleteAppointment(contextMenu.value.eventId);
  } catch (error) {
    alert("Errore durante l'eliminazione");
  }
  closeContextMenu();
  isConfirmOpen.value = false;
};
const askDelete = () => {
  isConfirmOpen.value = true;
};

const cancelDelete = () => {
  isConfirmOpen.value = false;
};

onMounted(() => {
  appointmentStore.fetchAppointments();
  document.addEventListener("click", closeContextMenu);
});

const calendarEvents = computed(() => {
  return appointmentStore.appointmentsList.map((appt) => {
    // Uniamo i nomi dei trattamenti in una singola stringa separata da virgola per poterli passare a FullCalendar
    const serviceNames = appt.treatments.map((t: any) => t.name).join(", ");

    return {
      id: String(appt.id),
      title: `${appt.client_name} ${appt.client_surname}`,
      start: `${appt.date}T${appt.start_time}:00`,
      end: `${appt.date}T${appt.end_time}:00`,
      extendedProps: {
        service: serviceNames,
        notes: appt.notes,
      },
    };
  });
});
const { calendarOptions } = useCalendar();

const finalCalendarOptions = computed(() => {
  return {
    ...calendarOptions.value,
    events: calendarEvents.value,
  } as CalendarOptions;
});

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

const handleSaveAppointment = async (payload: any) => {
  try {
    await appointmentStore.createAppointment(payload);
    isModalOpen.value = false;
  } catch (error) {
    console.error("Errore salvataggio:", error);
    alert("Non è stato possibile salvare l'appuntamento.");
  }
};

const currentTitle = ref("");
const currentView = ref("timeGridWeek");
const isModalOpen = ref(false);
const isConfirmOpen = ref(false);

const viewModes = [
  { label: "Giorno", value: "timeGridDay" },
  { label: "Settimana", value: "timeGridWeek" },
  { label: "Mese", value: "dayGridMonth" },
];

const handleAddAppointment = () => {
  isModalOpen.value = true;
};

const handleCloseAppointmentModal = () => {
  isModalOpen.value = false;
};

const getCalendarApi = () => {
  return calendarRef.value?.getApi();
};

const updateCalendarState = () => {
  const api = getCalendarApi();
  if (api) {
    currentTitle.value = api.view.title;
    currentView.value = api.view.type;
  }
};

const goNext = () => {
  const api = getCalendarApi();
  api?.next();
  updateCalendarState();
};
const goPrev = () => {
  const api = getCalendarApi();
  api?.prev();
  updateCalendarState();
};
const goToday = () => {
  const api = getCalendarApi();
  api?.today();
  updateCalendarState();
};
const changeView = (viewName: string) => {
  const api = getCalendarApi();
  api?.changeView(viewName);
  updateCalendarState();
};

const formatDayName = (date: Date) => {
  return new Intl.DateTimeFormat("it-IT", { weekday: "short" }).format(date);
};

onMounted(async () => {
  await nextTick();
  updateCalendarState();
});

onUnmounted(() => {
  document.removeEventListener("click", closeContextMenu);
});
</script>

<template>
  <div class="space-y-4 relative">
    <!-- Menu Contestuale (Click Destro) -->
    <div v-if="contextMenu.visible" :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }" class="fixed z-50 bg-white border border-gray-200 rounded-full shadow-sm w-32 m-0 overflow-hidden">
      <button @click="askDelete" class="text-left w-full p-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" x2="10" y1="11" y2="17" />
          <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
        <span>Elimina</span>
      </button>
    </div>

    <PageHeader title="Agenda" button-text="Nuovo Appuntamento" @action="handleAddAppointment" />
    <AppointmentModal :is-open="isModalOpen" @close="handleCloseAppointmentModal" @save="handleSaveAppointment" />
    <ConfirmDialog :is-open="isConfirmOpen" title="Elimina Appuntamento" message="Sei sicuro di voler eliminare questo appuntamento?" @confirm="handleDeleteAppointment" @cancel="cancelDelete" />
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div class="flex p-1 items-center rounded-full shadow-sm border border-gray-200 space-x-1 me-3">
        <button @click="goPrev" class="p-2 text-gray-600 transition-colors rounded-full hover:bg-pink-light cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </button>
        <button @click="goNext" class="p-2 text-gray-600 transition-colors rounded-full hover:bg-pink-light cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true">
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </button>
      </div>
      <button @click="goToday" class="px-4 py-2 bg-surface border border-gray-200 rounded-full shadow-sm hover:bg-pink-light text-sm font-medium text-gray-700 transition-colors cursor-pointer">Oggi</button>

      <h2 class="w-full text-center text-2xl font-bold text-text-main capitalize">
        {{ currentTitle }}
      </h2>

      <div class="flex bg-gray-100 border border-gray-200 rounded-full shadow-sm">
        <div class="flex p-1 space-x-2">
          <button v-for="viewMode in viewModes" :key="viewMode.value" @click="changeView(viewMode.value)" :class="['px-4 py-1 text-sm font-medium rounded-full transition-all cursor-pointer', currentView === viewMode.value ? 'bg-surface shadow-sm text-gray-900' : 'text-gray-500 hover:bg-gray-200']">
            {{ viewMode.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="rounded-2xl bg-gray-200 p-px shadow-sm">
      <div class="overflow-hidden rounded-2xl bg-surface">
        <FullCalendar ref="calendarRef" :options="finalCalendarOptions">
          <template v-slot:dayHeaderContent="arg">
            <div class="flex flex-col items-center justify-center py-2">
              <span class="text-xs font-medium text-gray-400 uppercase mb-1 tracking-wider">
                {{ formatDayName(arg.date) }}
              </span>

              <span :class="['font-semibold w-8 h-8 flex items-center justify-center rounded-full transition-colors', arg.isToday ? 'bg-pink  shadow-sm' : 'text-gray-800']">
                {{ arg.date.getDate() }}
              </span>
            </div>
          </template>

          <template v-slot:eventContent="arg">
            <!-- Se l'appuntamento e meno di 15 min usiamo un layout diverso per l'evento -->
            <div
              v-if="((arg.event.end?.getTime() || 0) - (arg.event.start?.getTime() || 0)) / 60000 <= 15"
              @contextmenu.prevent="openContextMenu($event, arg.event)"
              class="h-full w-full pt-0.5 px-1.5 rounded-xl border-l-4 bg-blue-50 border-primary text-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-start justify-start gap-1 leading-none">
              <div class="text-xs text-left font-bold text-primary whitespace-nowrap">
                {{ arg.timeText }}
              </div>
              <div class="text-xs text-left font-semibold truncate leading-tight">
                {{ arg.event.title }}
              </div>
            </div>

            <div
              v-else
              @contextmenu.prevent="openContextMenu($event, arg.event)"
              class="h-full w-full flex flex-col pt-0.5 px-1.5 pb-1 rounded-xl border-l-4 bg-blue-50 border-primary text-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer items-start justify-start leading-none gap-0.5">
              <div class="flex items-start justify-start gap-1 w-full overflow-hidden">
                <div class="text-xs font-bold text-primary whitespace-nowrap">
                  {{ arg.timeText }}
                </div>
                <div class="text-xs font-semibold text-left truncate leading-tight">
                  {{ arg.event.title }}
                </div>
              </div>

              <div v-if="arg.event.extendedProps.notes" class="text-xs text-gray-500 text-left w-full truncate mt-auto">Note: {{ arg.event.extendedProps.notes }}</div>
            </div>
          </template>
        </FullCalendar>
      </div>
    </div>
  </div>
</template>
