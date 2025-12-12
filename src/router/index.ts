import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "./guards";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      component: () => import("../modules/auth/pages/LoginPage.vue"),
    },
    {
      path: "/dashboard",
      component: () => import("../modules/dosen/pages/DashboardDosen.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/input-nilai/:kelas_id",
      component: () => import("../modules/dosen/pages/InputNilaiPage.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(authGuard);

export default router;
