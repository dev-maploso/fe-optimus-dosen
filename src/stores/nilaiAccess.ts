import { defineStore } from "pinia";
import { NILAI_SECRET_MAP } from "@/config/nilaiAccess";
import type { ModeNilai } from "@/models/nilai/ModeNilai";

export const useNilaiAccessStore = defineStore("nilaiAccess", {
  state: () =>
    ({
      unlockedMode: (localStorage.getItem("unlockedMode") as ModeNilai) || null,
    } as { unlockedMode: ModeNilai | null }),

  getters: {
    canAccess: (state) => (mode: ModeNilai) => state.unlockedMode === mode,
  },

  actions: {
    unlockByCode(code: string) {
      const mode = NILAI_SECRET_MAP[code.toUpperCase()];
      if (!mode) return false;

      this.unlockedMode = mode;

      // ✅ simpan ke localStorage agar tetap tersedia setelah refresh
      localStorage.setItem("unlockedMode", mode);

      return true;
    },

    reset() {
      this.unlockedMode = null;

      // ✅ hapus dari localStorage saat logout atau reset
      localStorage.removeItem("unlockedMode");
    },
  },
});
