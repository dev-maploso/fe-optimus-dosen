import { defineStore } from "pinia";
import { api } from "@/services/api";
import router from "@/router";
import type { Dosen } from "@/models/Dosen";
import { useNilaiAccessStore } from "@/stores/nilaiAccess";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as Dosen | null,
    token: localStorage.getItem("token") || "",
    loading: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      try {
        const res = await api.post("/dosen/login", { email, password });

        // Simpan token dulu
        this.token = res.data.data.token;
        localStorage.setItem("token", this.token);

        // Baru set user
        this.user = res.data.data.dosen as Dosen;

        useNilaiAccessStore().reset();

        return true;
      } catch (err) {
        console.error("LOGIN ERROR:", err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = "";
      localStorage.removeItem("token");

      router.push("/login");
    },

    async restoreSession() {
      const token = localStorage.getItem("token");
      if (!token) return;

      this.loading = true;
      try {
        const res = await api.get("/dosen/me");
        this.user = res.data.data as Dosen;
      } catch (err) {
        console.error("Restore session error:", err);
        this.logout();
      } finally {
        this.loading = false;
      }
    },
  },
});
