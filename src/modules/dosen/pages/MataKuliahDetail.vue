<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useNilaiMahasantri } from "@/composables/dosen/useNilaiMahasantri";
import { useNilaiAccessStore } from "@/stores/nilaiAccess";
import type { ModeNilai } from "@/models/nilai/ModeNilai";

const route = useRoute();
const kelasId = Number(route.params.id);

const nilaiAccess = useNilaiAccessStore();

// ✅ SATU-SATUNYA SUMBER MODE
const modes: ModeNilai[] = ["harian", "uas", "absensi"];

const {
  kelas,
  mahasiswa,
  modeNilai,
  loading,
  saving,
  fetchNilai,
  simpanNilai,
  isInvalidNilai,
  hasInvalidNilai,
} = useNilaiMahasantri(kelasId);

// ✅ Sinkronkan unlock → mode aktif
watch(
  () => nilaiAccess.unlockedMode,
  (unlocked) => {
    if (unlocked) {
      modeNilai.value = unlocked;
    }
  },
  { immediate: true }
);

onMounted(fetchNilai);
</script>

<template>
  <div class="space-y-6">
    <!-- ================= HEADER ================= -->
    <div class="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800
             text-white p-6 shadow-lg">
      <h1 class="text-2xl font-semibold tracking-wide">
        {{ kelas?.mata_kuliah }}
      </h1>
      <p class="text-sm text-slate-300 mt-1">
        Kelas {{ kelas?.kelas }}
      </p>
    </div>

    <!-- ================= MODE SELECTOR ================= -->
    <div class="flex gap-2">
      <template v-for="mode in modes" :key="mode">
        <button v-if="nilaiAccess.canAccess(mode)" @click="modeNilai = mode"
          class="px-4 py-2 rounded-lg text-sm font-semibold transition" :class="modeNilai === mode
            ? 'bg-blue-600 text-white shadow'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'">
          {{ mode.toUpperCase() }}
        </button>
      </template>
    </div>




    <!-- ================= LOADING ================= -->
    <div v-if="loading" class="text-center text-slate-500">
      Memuat data mahasiswa...
    </div>

    <!-- ================= TABLE ================= -->
    <div v-else class="rounded-xl border border-slate-200 overflow-hidden
             shadow-md bg-white">
      <table class="w-full text-sm">
        <thead class="bg-slate-100 text-slate-700">
          <tr>
            <th class="p-3 border text-center w-12">No</th>
            <th class="p-3 border text-left">Nama Mahasiswa</th>

            <th v-if="modeNilai === 'harian'" class="p-3 border text-center">
              Nilai Harian
            </th>
            <th v-if="modeNilai === 'uas'" class="p-3 border text-center">
              Nilai UAS
            </th>
            <th v-if="modeNilai === 'absensi'" class="p-3 border text-center">
              Nilai Absensi
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mhs, index) in mahasiswa" :key="mhs.mahasantri_id" :class="[
            'transition',
            isInvalidNilai(mhs)
              ? 'bg-red-50'
              : 'hover:bg-slate-50'
          ]">

            <td class="border p-2 text-center text-slate-500">
              {{ index + 1 }}
            </td>

            <td class="border p-2 font-medium text-slate-800">
              {{ mhs.nama }}
            </td>

            <td v-if="modeNilai === 'harian'" class="border p-2 text-center">
              <input type="number" v-model.number="mhs.nilai_harian" min="0" max="100" class="nilai-input"
                :class="isInvalidNilai(mhs) && 'ring-2 ring-red-400'" />

              <p v-if="isInvalidNilai(mhs)" class="text-xs text-red-600 mt-1">
                Nilai harus antara 0 – 100
              </p>
            </td>



            <td v-if="modeNilai === 'uas'" class="border p-2 text-center">
              <input type="number" v-model.number="mhs.nilai_uas" min="0" max="100" class="nilai-input"
                :class="isInvalidNilai(mhs) && 'ring-2 ring-red-400'" />

              <p v-if="isInvalidNilai(mhs)" class="text-xs text-red-600 mt-1">
                Nilai harus antara 0 – 100
              </p>
            </td>


            <td v-if="modeNilai === 'absensi'" class="border p-2 text-center">
              <input type="number" v-model.number="mhs.nilai_absensi" min="0" max="100" class="nilai-input"
                :class="isInvalidNilai(mhs) && 'ring-2 ring-red-400'" />

              <p v-if="isInvalidNilai(mhs)" class="text-xs text-red-600 mt-1">
                Nilai harus antara 0 – 100
              </p>
            </td>

          </tr>
        </tbody>
      </table>
    </div>

    <!-- ================= ACTION ================= -->
    <div class="flex justify-end">
      <button class="px-6 py-3 rounded-xl bg-gradient-to-r
         from-blue-600 to-cyan-500 text-white font-semibold
         shadow-lg hover:scale-105 active:scale-95
         transition disabled:opacity-40 disabled:cursor-not-allowed" :disabled="saving || hasInvalidNilai"
        @click="simpanNilai">
        {{ saving ? "Menyimpan..." : "💾 Simpan Nilai" }}
      </button>

    </div>
  </div>
</template>
