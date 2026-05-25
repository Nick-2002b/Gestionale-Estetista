<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import type { CalendarOptions } from "@fullcalendar/core";
import { useCalendar } from "../components/Calendar.ts";
import PageHeader from "../components/ViewHeader.vue";
import AppointmentModal from "../components/AppointmentModal.vue";

const { calendarOptions } = useCalendar() as { calendarOptions: CalendarOptions };

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

const currentTitle = ref("");
const currentView = ref("timeGridWeek");
const isModalOpen = ref(false);

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

const handleSaveAppointment = () => {
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
</script>

<template>
  <div class="space-y-4">
    <PageHeader title="Agenda" button-text="Nuovo Appuntamento" @action="handleAddAppointment" />
    <AppointmentModal :is-open="isModalOpen" @close="handleCloseAppointmentModal" @save="handleSaveAppointment" />

    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div class="flex p-1 items-center rounded-full shadow-sm border border-gray-200 space-x-1 me-3">
        <button @click="goPrev" class="p-2 text-gray-600 transition-colors rounded-full hover:bg-pink-light cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
            aria-hidden="true">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </button>
        <button @click="goNext" class="p-2 text-gray-600 transition-colors rounded-full hover:bg-pink-light cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
            aria-hidden="true">
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </button>
      </div>
      <button @click="goToday" class="px-4 py-2 bg-surface border border-gray-200 rounded-full shadow-sm hover:bg-pink-light text-sm font-medium text-gray-700 transition-colors cursor-pointer">
        Oggi
      </button>

      <h2 class="w-full text-center text-2xl font-bold text-text-main capitalize">
        {{ currentTitle }}
      </h2>

      <div class="flex bg-gray-100 border border-gray-200 rounded-full shadow-sm">
        <div class="flex p-1 space-x-2">
          <button
            v-for="viewMode in viewModes"
            :key="viewMode.value"
            @click="changeView(viewMode.value)"
            :class="[
              'px-4 py-1 text-sm font-medium rounded-full transition-all cursor-pointer',
              currentView === viewMode.value ? 'bg-surface shadow-sm text-gray-900' : 'text-gray-500 hover:bg-gray-200',
            ]">
            {{ viewMode.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="rounded-2xl bg-gray-200 p-px shadow-sm">
      <div class="overflow-hidden rounded-2xl bg-surface">
        <FullCalendar ref="calendarRef" :options="calendarOptions">
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
        </FullCalendar>
      </div>
    </div>
  </div>
</template>
