<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const auth = useAuthStore()

// Cek auto-login jika token masih ada
onMounted(() => {
  auth.restoreSession()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">

    <!-- GLOBAL NAVBAR -->
    <header class="bg-white shadow px-4 py-3 flex items-center justify-between">
      <h1 class="font-semibold text-lg">SIAKAD</h1>

      <!-- Jika login, tampilkan foto/nama -->
      <div v-if="auth.isLoggedIn" class="flex items-center gap-2">
        <span class="text-sm text-gray-600">{{ auth.user?.name }}</span>
        <button
          class="text-red-500 text-sm"
          @click="auth.logout()"
        >
          Logout
        </button>
      </div>
    </header>

    <!-- PAGE CONTENT -->
    <main class="flex-1 p-4">
      <RouterView />
    </main>

    <!-- GLOBAL LOADER -->
    <transition name="fade">
      <div
        v-if="auth.loading"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div class="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    </transition>

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
