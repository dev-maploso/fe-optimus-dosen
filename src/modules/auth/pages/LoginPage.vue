<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../../stores/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");

const auth = useAuthStore();
const router = useRouter();

const submit = async () => {
  const success = await auth.login(email.value, password.value);

  if (success) {
    router.push("/dashboard");
  } else {
    alert("Email atau password salah!");
  }
};
</script>

<template>
  <div class="login-page">
    <h2>Login Dosen</h2>

    <input v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />

    <button @click="submit" :disabled="auth.loading">
      {{ auth.loading ? "Loading..." : "Login" }}
    </button>
  </div>
</template>
