<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "../../../stores/auth";
import { useMataKuliahStore } from "../../../stores/mataKuliah";

const auth = useAuthStore();
const mkStore = useMataKuliahStore();

onMounted(() => {
  mkStore.fetchMataKuliahDosen();
});
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-semibold">
      Selamat datang, {{ auth.user?.nama }}
    </h1>

    <div>
      <h2 class="font-medium mb-2">Mata Kuliah yang Diampu</h2>

      <div v-if="mkStore.loading">Loading...</div>

      <ul v-else class="space-y-2">
        <li v-for="mk in mkStore.list" :key="mk.id" class="border rounded p-3 hover:bg-gray-50 cursor-pointer" @click="$router.push({
          name: 'dosen-mata-kuliah-detail',
          params: { id: mk.id }
        })">

          <div class="font-semibold">{{ mk.mata_kuliah }}</div>
          <div class="text-sm text-gray-600">
            Kelas {{ mk.kelas }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
