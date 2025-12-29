<script setup lang="ts">
import { onMounted, watch, computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useNilaiMahasantri } from "@/composables/dosen/useNilaiMahasantri";
import { useNilaiAccessStore } from "@/stores/nilaiAccess";
import type { ModeNilai } from "@/models/nilai/ModeNilai";

const route = useRoute();
const kelasId = Number(route.params.id);

const nilaiAccess = useNilaiAccessStore();
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

// ----------------- SORTED MAHASISWA -----------------
const mahasiswaSorted = computed(() => {
  return [...mahasiswa.value].sort((a, b) => a.nama.localeCompare(b.nama));
});

// ----------------- MODE SYNC -----------------
watch(
  () => nilaiAccess.unlockedMode,
  (unlocked) => {
    if (unlocked) modeNilai.value = unlocked;
  },
  { immediate: true }
);

onMounted(fetchNilai);

// ----------------- AUTO SAVE -----------------
const saveTimeout = ref<number | null>(null);
const autoSaveDelay = 1000; // 1 detik
const lastSaved = ref<Date | null>(null);
const autoSaving = ref(false);

// Auto-save tanpa toast
async function simpanNilaiAuto() {
  if (hasInvalidNilai.value) return;
  autoSaving.value = true;
  try {
    await simpanNilai(false);
    lastSaved.value = new Date(); // update timestamp setelah selesai
  } finally {
    autoSaving.value = false;
  }
}

watch(
  mahasiswa,
  () => {
    if (saveTimeout.value) clearTimeout(saveTimeout.value);
    saveTimeout.value = window.setTimeout(() => {
      simpanNilaiAuto();
    }, autoSaveDelay);
  },
  { deep: true }
);

// ----------------- MANUAL SAVE -----------------
const manualSaved = ref(false);

async function handleManualSave() {
  manualSaved.value = false;
  await simpanNilai(true);
  manualSaved.value = true; // ini yang bisa ditampilkan sebagai toast
}
</script>

<template>
  <div class="space-y-6">

    <!-- HEADER -->
    <div class="rounded-xl bg-gradient-to-r from-green-700 to-green-500
                text-white p-6 shadow-lg animate-fade-in">
      <h1 class="text-2xl font-semibold tracking-wide">{{ kelas?.mata_kuliah }}</h1>
      <p class="text-sm text-green-100 mt-1">Kelas {{ kelas?.kelas }}</p>
    </div>

    <!-- MODE SELECTOR -->
    <div class="flex gap-2">
      <template v-for="mode in modes" :key="mode">
        <button v-if="nilaiAccess.canAccess(mode)" @click="modeNilai = mode"
          class="px-4 py-2 rounded-lg text-sm font-semibold transition-transform duration-200"
          :class="modeNilai === mode
            ? 'bg-green-600 text-white shadow-lg scale-105'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105'">
          {{ mode.toUpperCase() }}
        </button>
      </template>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-center text-slate-500 animate-fade-in">
      Memuat data mahasiswa...
    </div>

    <!-- TABLE -->
    <div v-else class="rounded-xl overflow-hidden shadow-md bg-white animate-fade-in">
      <table class="w-full text-sm table-auto">
        <thead class="bg-green-600 text-white">
          <tr>
            <th class="p-3 border border-green-500 text-center w-12">No</th>
            <th class="p-3 border border-green-500 text-left">Nama Mahasiswa</th>
            <th v-if="modeNilai === 'harian'" class="p-3 border border-green-500 text-center">Nilai Harian</th>
            <th v-if="modeNilai === 'uas'" class="p-3 border border-green-500 text-center">Nilai UAS</th>
            <th v-if="modeNilai === 'absensi'" class="p-3 border border-green-500 text-center">Nilai Absensi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mhs, index) in mahasiswaSorted" :key="mhs.mahasantri_id"
              :class="[ 
                'transition-all duration-200 hover:bg-green-50',
                index % 2 === 0 ? 'bg-green-50/50' : '',
                isInvalidNilai(mhs) ? 'bg-red-50 animate-pulse-invalid' : ''
              ]">
            <td class="border border-green-200 p-2 text-center text-green-800 font-medium">{{ index + 1 }}</td>
            <td class="border border-green-200 p-2 text-green-900 font-medium">{{ mhs.nama }}</td>

            <td v-if="modeNilai === 'harian'" class="border border-green-200 p-2 text-center">
              <input type="number" v-model.number="mhs.nilai_harian" min="0" max="100"
                class="w-full rounded-md px-2 py-1 border border-green-300 text-center transition-all duration-200 focus:ring-2 focus:ring-green-400 focus:border-green-400"
                :class="isInvalidNilai(mhs) && 'ring-2 ring-red-400'" />
              <p v-if="isInvalidNilai(mhs)" class="text-xs text-red-600 mt-1">🥹. Nilai harus antara 67.5 – 100</p>
            </td>

            <td v-if="modeNilai === 'uas'" class="border border-green-200 p-2 text-center">
              <input type="number" v-model.number="mhs.nilai_uas" min="0" max="100"
                class="w-full rounded-md px-2 py-1 border border-green-300 text-center transition-all duration-200 focus:ring-2 focus:ring-green-400 focus:border-green-400"
                :class="isInvalidNilai(mhs) && 'ring-2 ring-red-400'" />
              <p v-if="isInvalidNilai(mhs)" class="text-xs text-red-600 mt-1">🥹. Nilai harus antara 10 – 100</p>
            </td>

            <td v-if="modeNilai === 'absensi'" class="border border-green-200 p-2 text-center">
              <input type="number" v-model.number="mhs.nilai_absensi" min="0" max="100"
                class="w-full rounded-md px-2 py-1 border border-green-300 text-center transition-all duration-200 focus:ring-2 focus:ring-green-400 focus:border-green-400"
                :class="isInvalidNilai(mhs) && 'ring-2 ring-red-400'" />
              <p v-if="isInvalidNilai(mhs)" class="text-xs text-red-600 mt-1">🥹. Nilai harus antara 10 – 100</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ACTION -->
    <div class="flex justify-between items-center">
      <div>
        <span v-if="autoSaving" class="text-xs text-slate-500">Menyimpan otomatis...</span>
        <span v-else-if="lastSaved" class="text-xs text-green-600">
          Tersimpan otomatis pada {{ lastSaved.toLocaleTimeString() }}
        </span>
      </div>

      <div class="flex flex-col items-end">
        <button class="px-6 py-3 rounded-xl bg-gradient-to-r
           from-green-800 to-green-500 text-white font-semibold
           shadow-lg hover:scale-105 active:scale-95
           transition-all animate-bounce-slow disabled:opacity-40 disabled:cursor-not-allowed"
           :disabled="saving || hasInvalidNilai"
           @click="handleManualSave">
          {{ saving ? "Menyimpan..." : "💾 Simpan Nilai" }}
        </button>
        <span v-if="manualSaved" class="text-xs text-green-700 mt-1 animate-fade-in">💾 Nilai tersimpan!</span>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Animations */
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
.animate-fade-in { animation: fadeIn 0.8s ease forwards; }

/* Bounce button idle */
@keyframes bounceSlow { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-3px);} }
.animate-bounce-slow { animation: bounceSlow 2s ease-in-out infinite; }

/* Pulsing invalid input */
@keyframes pulseInvalid {0%,100%{background-color: rgba(254,202,202,0.5);}50%{background-color: rgba(254,202,202,0.3);}}
.animate-pulse-invalid { animation: pulseInvalid 1.5s ease-in-out infinite; }

/* Input focus glow */
input:focus { outline: none; box-shadow: 0 0 8px rgba(34,197,94,0.6); }

/* Fade-in untuk manual save */
@keyframes fadeInText { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fadeInText 0.8s ease forwards; }
</style>
