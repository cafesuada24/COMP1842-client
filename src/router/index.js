import { createMemoryHistory, createRouter } from 'vue-router';
//import { useStore } from "vuex";
import Dashboard from "@/features/dashboard/Dashboard.vue";
import Income from "@/features/income/Income.vue";
import IncomeReport from "@/features/income/IncomeReport.vue";
import Expense from "@/features/expense/Expense.vue";
import ExpenseReport from "@/features/expense/ExpenseReport.vue";
import SavingGoal from "@/features/saving-goal/SavingGoal.vue";
import SavingGoalReport from "@/features/saving-goal/SavingGoalReport.vue";
import AuthLogin from "@/features/auth/AuthLogin.vue";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/income',
    name: "Income",
    component: Income,
    meta: { requiresAuth: true },
  },
  {
    path: '/income/report',
    name: "Income Report",
    component: IncomeReport,
    meta: { requiresAuth: true },
  },
  {
    path: '/expense',
    name: "Expense",
    component: Expense,
    meta: { requiresAuth: true },
  },
  {
    path: '/expense/report',
    name: "Expense Report",
    component: ExpenseReport,
    meta: { requiresAuth: true },
  },
  {
    path: '/saving-goal',
    name: "Saving Goal",
    component: SavingGoal,
    meta: { requiresAuth: true },
  },
  {
    path: '/saving-goal/report',
    name: "Saving Goal Report",
    component: SavingGoalReport,
    meta: { requiresAuth: true },
  },
  {
    path: "/auth/login",
    component: AuthLogin,
    meta: { requiresGuest: true }
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

//router.beforeEach((to, _, next) => {
//  const store = useStore();
//
//  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
//    next("/auth/login");
//  //} else if (to.meta.requiresGuest && store.getters.isAuthenticated) {
//  //  next("/dashboard");
//  } else {
//    next(to.path); // Proceed to route
//  }
//});

export default router;
