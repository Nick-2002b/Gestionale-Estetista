import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useAuthStore } from "../stores/auth";

import Login from "../pages/Login.vue";
import Agenda from "../pages/Agenda.vue";
import Treatments from "../pages/Treatments.vue";
import Clients from "../pages/Clients.vue";
import Layout from "../layouts/MainLayout.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true },
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
      },
      {
        path: "treatments",
        name: "Treatments",
        component: Treatments,
      },
      {
        path: "clients",
        name: "Clients",
        component: Clients,
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
});

export default router;
