<script setup lang="ts">
import { RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Navbar from "@/components/Navbar.vue";

const auth = useAuthStore();


</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">

    <!-- Tampilkan navbar hanya ketika sudah login -->
    <Navbar v-if="auth.isLoggedIn" :user="auth.user" @logout="auth.logout" />

    <main :class="auth.isLoggedIn ? 'flex-1 p-4' : 'flex-1 p-0'">
      <RouterView />
    </main>

    <!-- Loader -->
    <transition name="fade">
      <div v-if="auth.loading" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    </transition>
  </div>
</template>
