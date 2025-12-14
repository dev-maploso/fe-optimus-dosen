import { useAuthStore } from "@/stores/auth";
import { useNilaiAccessStore } from "@/stores/nilaiAccess";

let sessionRestored = false;

export async function authGuard(to: any) {
  const auth = useAuthStore();
  const nilaiAccess = useNilaiAccessStore();

  // 🔹 restore session SEKALI seumur app
  if (!sessionRestored) {
    await auth.restoreSession();
    sessionRestored = true;
  }

  // 🔒 Route butuh login
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return "/login";
  }

  // 🔑 Sudah login tapi belum unlock nilai
  if (
    auth.isLoggedIn &&
    !nilaiAccess.unlockedMode &&
    to.path !== "/unlock-nilai" &&
    to.path !== "/login"
  ) {
    return "/unlock-nilai";
  }

  // ❌ Sudah unlock tapi masih ke halaman unlock
  if (
    auth.isLoggedIn &&
    nilaiAccess.unlockedMode &&
    to.path === "/unlock-nilai"
  ) {
    return "/dashboard";
  }

  // 🚫 Sudah login tidak boleh ke login lagi
  if (to.path === "/login" && auth.isLoggedIn) {
    return "/dashboard";
  }

  return true;
}
