export interface MataKuliahDosen {
  id: number;
  mata_kuliah: string;
  kelas: string;
  hari: string | null;
  jam_mulai: string | null;
  jam_selesai: string | null;
  ruang: string | null;
}
