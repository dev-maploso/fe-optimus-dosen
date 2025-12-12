<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const kelasId = route.params.kelas_id;
</script>

<template>
  <h2>Input Nilai - Kelas {{ kelasId }}</h2>
</template>
