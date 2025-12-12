import { useAuthStore } from "@/stores/auth";

export function authGuard(to: any) {
  const auth = useAuthStore();

  // Jika route butuh login & user belum login → redirect
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return "/login";
  }

  // Jika user sudah login dan mencoba akses /login → redirect ke dashboard
  if (to.path === "/login" && auth.isLoggedIn) {
    return "/dashboard";
  }

  // Default: biarkan lanjut
  return true;
}
