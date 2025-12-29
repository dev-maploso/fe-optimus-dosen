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

    // kosong = belum diisi → bukan error
    if (nilai === null || nilai === undefined) return false;
    if (Number.isNaN(nilai)) return false;

    if (modeNilai.value === "harian") {
      return nilai < 67.5 || nilai > 100;
    }

    return nilai < 10 || nilai > 100;
  };

  const hasInvalidNilai = computed(() => mahasiswa.value.some(isInvalidNilai));

  /* =======================
   * SIMPAN NILAI
   * ======================= */
  const simpanNilai = async (showToast = true) => {
  saving.value = true;
  try {
    const nilai = mahasiswa.value
      .map((mhs) => {
        const base = {
          kelas_mata_kuliah_mahasantri_id: mhs.mahasantri_id,
        };

        if (modeNilai.value === "harian") {
          if (
            mhs.nilai_harian === null ||
            mhs.nilai_harian === undefined ||
            Number.isNaN(mhs.nilai_harian)
          ) {
            return null; // ⬅️ JANGAN DIKIRIM
          }
          return { ...base, nilai_harian: mhs.nilai_harian };
        }

        if (modeNilai.value === "uas") {
          if (
            mhs.nilai_uas === null ||
            mhs.nilai_uas === undefined ||
            Number.isNaN(mhs.nilai_uas)
          ) {
            return null;
          }
          return { ...base, nilai_uas: mhs.nilai_uas };
        }

        if (
          mhs.nilai_absensi === null ||
          mhs.nilai_absensi === undefined ||
          Number.isNaN(mhs.nilai_absensi)
        ) {
          return null;
        }

        return { ...base, nilai_absensi: mhs.nilai_absensi };
      })
      .filter(Boolean);

    // ⛔ tidak ada nilai → tidak perlu request
    if (nilai.length === 0) {
      saving.value = false;
      return;
    }

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
