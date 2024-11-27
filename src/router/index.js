import { createMemoryHistory, createRouter } from 'vue-router';
import { useStore } from "vuex";
import Dashboard from "@/features/dashboard/Dashboard.vue";
import AuthLogin from "@/features/auth/AuthLogin.vue";

const routes = [
  { path: "/", redirect: "/dashboard" },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  { path: "/auth/login", component: AuthLogin, meta: { requiresGuest: true } },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const store = useStore();

  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next("/auth/login");
  } else if (to.meta.requiresGuest && store.getters.isAuthenticated) {
    next("/dashboard");
  } else {
    next(); // Proceed to route
  }
});

export default router;
