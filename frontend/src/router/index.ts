import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useAuthStore } from "../stores/auth";

import Login from "../pages/Login.vue";
import Agenda from "../pages/Agenda.vue";
import Treatments from "../pages/Treatments.vue";
import Clients from "../pages/Clients.vue";
import ClientDetail from "../pages/ClientDetail.vue";
import Layout from "../layouts/MainLayout.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true, title: "CCBeautyLab | Login" },
  },
  {
    path: "/",
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Agenda",
        component: Agenda,
        meta: { title: "CCBeautyLab | Agenda" },
      },
      {
        path: "treatments",
        name: "Treatments",
        component: Treatments,
        meta: { title: "CCBeautyLab | Trattamenti" },
      },
      {
        path: "clients",
        name: "Clients",
        component: Clients,
        meta: { title: "CCBeautyLab | Clienti" },
      },
      {
        path: "clients/:id",
        name: "ClientDetail",
        component: ClientDetail,
        meta: { title: "CCBeautyLab | Dettaglio Cliente" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  const pageTitle = to.meta.title;

  //se e il primo caricmaneto dell'app, interroghiamo il backend
  if (!authStore.isReady) {
    await authStore.checkAuth();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "Login" }); // reindirizza l'utente se non si e autenticato
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: "Agenda" });
  } else {
    next();
  }
  if (pageTitle) {
    document.title = pageTitle as string;
  }
});

export default router;
