import { ref, computed } from "vue";
import { api } from "@/services/api";
import { useToast } from "vue-toastification";
import type { MahasantriNilai, ModeNilai } from "@/models/nilai";

export function useNilaiMahasantri(kelasId: number) {
  /* =======================
   * STATE
   * ======================= */
  const toast = useToast();
  const loading = ref(false);
  const saving = ref(false);

  const kelas = ref<{
    kelas: string;
    mata_kuliah: string;
  } | null>(null);

  const mahasiswa = ref<MahasantriNilai[]>([]);
  const modeNilai = ref<ModeNilai>("harian");

  /* =======================
   * FETCH
   * ======================= */
  const fetchNilai = async () => {
    loading.value = true;
    try {
      const res = await api.get(`/dosen/nilai/${kelasId}`);

      kelas.value = {
        kelas: res.data.data.kelas,
        mata_kuliah: res.data.data.mata_kuliah,
      };

      mahasiswa.value = res.data.data.mahasiswa;
    } catch {
      toast.error("Gagal memuat data nilai");
    } finally {
      loading.value = false;
    }
  };

  /* =======================
   * NILAI AKTIF
   * ======================= */
  const getNilaiAktif = (mhs: MahasantriNilai) => {
    switch (modeNilai.value) {
      case "harian":
        return mhs.nilai_harian;
      case "uas":
        return mhs.nilai_uas;
      case "absensi":
        return mhs.nilai_absensi;
      default:
        return null;
    }
  };

  /* =======================
   * VALIDATION
   * ======================= */
  const isInvalidNilai = (mhs: MahasantriNilai) => {
  const nilai = getNilaiAktif(mhs);

  // 👉 kosong = belum diisi = TIDAK error
  if (nilai === null || nilai === undefined) return false;
  if (typeof nilai !== "number" || isNaN(nilai)) return false;

  if (modeNilai.value === "harian") {
    return nilai < 67.5 || nilai > 100;
  }

  return nilai < 0 || nilai > 100;
};


  const hasInvalidNilai = computed(() => mahasiswa.value.some(isInvalidNilai));

  /* =======================
   * SIMPAN NILAI
   * ======================= */
  const simpanNilai = async (showToast = true) => {
    saving.value = true;
    try {
      const nilai = mahasiswa.value.map((mhs) => {
        const base = {
          kelas_mata_kuliah_mahasantri_id: mhs.mahasantri_id,
        };

        if (modeNilai.value === "harian") {
          return { ...base, nilai_harian: mhs.nilai_harian ?? 0 };
        }

        if (modeNilai.value === "uas") {
          return { ...base, nilai_uas: mhs.nilai_uas ?? 0 };
        }

        return { ...base, nilai_absensi: mhs.nilai_absensi ?? 0 };
      });

      await api.post("/dosen/nilai-massal", {
        kelas_mata_kuliah_id: kelasId,
        nilai,
      });
      if (showToast) toast.success("Nilai berhasil disimpan ✅");
    } catch (err: any) {
      if (showToast)
        toast.error(err.response?.data?.message || "Gagal menyimpan nilai");
    } finally {
      saving.value = false;
    }
  };

  /* =======================
   * EXPORT
   * ======================= */
  return {
    // state
    kelas,
    mahasiswa,
    modeNilai,
    loading,
    saving,

    // actions
    fetchNilai,
    simpanNilai,

    // validation
    getNilaiAktif,
    isInvalidNilai,
    hasInvalidNilai,
  };
}
