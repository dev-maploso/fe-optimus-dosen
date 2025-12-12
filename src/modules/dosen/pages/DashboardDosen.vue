<script setup lang="ts">
import { useAuthStore } from "../../../stores/auth";
const auth = useAuthStore();
</script>

<template>
  <h1>Selamat datang, {{ auth.user?.name }}</h1>
</template>
