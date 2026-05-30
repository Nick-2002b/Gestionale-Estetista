import { ref } from "vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import itLocale from "@fullcalendar/core/locales/it";
export function useCalendar() {
  const calendarOptions = ref({
    plugins: [timeGridPlugin, interactionPlugin, dayGridPlugin],
    initialView: "timeGridWeek",
    locales: [itLocale],
    locale: "it",

    views: {
      timeGridWeek: {
        titleFormat: { year: "numeric", month: "short", day: "numeric" },
        dayHeaderFormat: { weekday: "short", day: "numeric" },
      },
      dayGridMonth: {
        titleFormat: { year: "numeric", month: "short", day: "numeric" },
      },
    },
    headerToolbar: false,

    slotDuration: "00:05:00", // Righe create ogni 10 min
    slotLabelInterval: "00:30:00", // Testo dell'ora stampato solo ogni
    titleFormat: { year: "numeric", month: "long", day: "numeric", weekday: "long" },
    dayHeaderFormat: { weekday: "short", day: "numeric" },
    slotLabelFormat: { hour: "2-digit", minute: "2-digit", hour12: false },

    slotMinTime: "08:00:00",
    slotMaxTime: "20:00:00",
    allDaySlot: false,
    expandRows: true,
    height: "100%",
    // eventMinHeight: 45,

    eventBackgroundColor: "transparent",
    eventBorderColor: "transparent",

    selectable: true,

    events: [],
  });

  return {
    calendarOptions,
  };
}
