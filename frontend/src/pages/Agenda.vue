<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import type { CalendarOptions } from "@fullcalendar/core";
import { useCalendar } from "../components/Calendar.ts";

const { calendarOptions } = useCalendar() as { calendarOptions: CalendarOptions };

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

const currentTitle = ref("");
const currentView = ref("timeGridWeek");

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

onMounted(async () => {
  await nextTick();
  updateCalendarState();
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div class="flex p-1 items-center rounded-full shadow-sm border border-gray-200 space-x-1 me-3">
        <button @click="goPrev" class="p-2 text-gray-600 transition-colors rounded-full hover:bg-pink-light">
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
        <button @click="goNext" class="p-2 text-gray-600 transition-colors rounded-full hover:bg-pink-light">
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
      <button @click="goToday" class="px-4 py-2 bg-surface border border-gray-200 rounded-full shadow-sm hover:bg-pink-light text-sm font-medium text-gray-700 transition-colors">Oggi</button>

      <h2 class="w-full text-center text-2xl font-bold text-text-main capitalize">
        {{ currentTitle }}
      </h2>

      <div class="flex bg-surface border border-gray-200 p-1 rounded-xl shadow-sm space-x-1">
        <button
          @click="changeView('timeGridDay')"
          :class="['px-4 py-2 text-sm font-medium rounded-lg transition-all', currentView === 'timeGridDay' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700']">
          Giorno
        </button>
        <button
          @click="changeView('timeGridWeek')"
          :class="['px-4 py-2 text-sm font-medium rounded-lg transition-all', currentView === 'timeGridWeek' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700']">
          Settimana
        </button>
        <button
          @click="changeView('dayGridMonth')"
          :class="['px-4 py-2 text-sm font-medium rounded-lg transition-all', currentView === 'dayGridMonth' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-gray-700']">
          Mese
        </button>
      </div>
    </div>

    <div class="bg-surface rounded-2xl shadow-sm outline-none overflow-hidden">
      <FullCalendar ref="calendarRef" :options="calendarOptions" />
    </div>
  </div>
</template>
