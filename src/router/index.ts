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
      path: "/unlock-nilai",
      component: () => import("../modules/dosen/pages/UnlockNilaiPage.vue"),
    },
    {
      path: "/dashboard",
      component: () => import("../modules/dosen/pages/DashboardDosen.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/dosen/mata-kuliah/:id",
      name: "dosen-mata-kuliah-detail",
      component: () => import("../modules/dosen/pages/MataKuliahDetail.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(authGuard);

export default router;
