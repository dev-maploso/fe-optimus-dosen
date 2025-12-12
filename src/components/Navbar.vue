<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
</script>

<template>
  <header class="bg-white shadow px-4 py-3 flex items-center justify-between">
    <h1 class="font-semibold text-lg">SIAKAD</h1>

    <div v-if="auth.isLoggedIn" class="flex items-center gap-2">
      <span class="text-sm text-gray-600">
        {{ auth.user?.nama }}
      </span>

      <button
        class="text-red-500 text-sm hover:underline"
        @click="auth.logout()"
      >
        Logout
      </button>
    </div>
  </header>
</template>
