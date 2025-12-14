<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useNilaiAccessStore } from "@/stores/nilaiAccess";

const router = useRouter();
const nilaiAccess = useNilaiAccessStore();

const inputKode = ref("");

const submitKode = () => {
  if (!nilaiAccess.unlockByCode(inputKode.value)) {
    alert("Kode salah");
    return;
  }

  router.push("/dashboard");
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-black text-green-400">
    <div class="p-8 rounded-2xl border border-green-500 w-96">
      <h2 class="text-xl font-bold mb-4 text-center">INPUT KODE AKSES</h2>

      <input
        v-model="inputKode"
        placeholder="Masukkan kode Akses"
        class="w-full p-3 mb-4 bg-neutral-900 border border-green-500 rounded-xl"
      />

      <button
        @click="submitKode"
        class="w-full p-3 bg-green-500 text-black font-bold rounded-xl"
      >
        Unlock
      </button>
    </div>
  </div>
</template>
