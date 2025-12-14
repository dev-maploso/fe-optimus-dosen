import { defineStore } from "pinia";
import { api } from "@/services/api";
import type { MataKuliahDosen } from "@/models/MataKuliahDosen";

export const useMataKuliahStore = defineStore("mataKuliah", {
  state: () => ({
    list: [] as MataKuliahDosen[],
    loading: false,
  }),

  actions: {
    async fetchMataKuliahDosen() {
      this.loading = true;
      try {
        const res = await api.get("/dosen/mata-kuliah");
        this.list = res.data.data.list_mata_kuliah;
      } catch (err) {
        console.error("Fetch mata kuliah error:", err);
      } finally {
        this.loading = false;
      }
    },
  },
});
