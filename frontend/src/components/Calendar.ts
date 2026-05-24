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
        slotLabelFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
      },
    },
    // headerToolbar: {
    //   left: "prev,next today",
    //   center: "title",
    //   right: "timeGridDay,timeGridWeek,dayGridMonth",
    // },
    headerToolbar: false,

    slotDuration: "00:10:00", // Righe create ogni 10 min
    slotLabelInterval: "01:00:00", // Testp dell'ora stampato solo ogni ora
    titleFormat: { year: "numeric", month: "long", day: "numeric", weekday: "long" },
    dayHeaderFormat: { weekday: "short", day: "numeric" },
    slotLabelFormat: { hour: "2-digit", minute: "2-digit", hour12: false },

    slotMinTime: "08:00:00",
    slotMaxTime: "21:00:00",
    allDaySlot: false,
    expandRows: true,

    events: [],
  });

  return {
    calendarOptions,
  };
}
