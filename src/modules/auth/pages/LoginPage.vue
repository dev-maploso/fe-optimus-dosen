<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../../stores/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");

const auth = useAuthStore();
const router = useRouter();

const loginSound = new Audio("/sounds/transformer-success.mp3");

const submit = async () => {
  const success = await auth.login(email.value, password.value);

  if (success) {
    loginSound.play().catch(() => {});

    await auth.restoreSession();

    router.push("/unlock-nilai");
  } else {
    alert("Email atau password salah!");
  }
};
</script>

<template>
  <div
    class="flex items-center justify-center min-h-screen
           bg-gradient-to-br from-black via-neutral-900 to-black
           text-green-400 font-[Consolas] relative overflow-hidden">

    <!-- Cyberpunk Grid -->
    <div class="absolute inset-0 opacity-20"
         style="background-image: linear-gradient(#0f0 1px, transparent 1px),
                                   linear-gradient(90deg, #0f0 1px, transparent 1px);
                background-size: 50px 50px;">
    </div>

    <!-- Neon Rings -->
    <div class="absolute w-[500px] h-[500px] rounded-full border border-green-500/40 animate-ping"></div>
    <div class="absolute w-[300px] h-[300px] rounded-full border border-green-500/20 animate-pulse"></div>

    <div class="relative z-10 w-full max-w-sm p-8
                bg-black/70 border border-green-500/60
                rounded-3xl shadow-[0_0_25px_#00ff00]
                backdrop-blur-xl">

      <h1 class="text-3xl font-extrabold text-green-400 text-center mb-6 tracking-widest drop-shadow-[0_0_10px_#0f0]">
        ACCESS LOGIN
      </h1>

      <div class="flex flex-col gap-4">
        <input v-model="email" type="email" placeholder="Email"
          class="p-3 rounded-xl bg-neutral-900 border border-green-500/60
                 text-green-300 placeholder-green-600
                 focus:outline-none focus:ring-2 focus:ring-green-400
                 shadow-[0_0_15px_#00ff0066] transition-all" />

        <input v-model="password" type="password" placeholder="Password"
          class="p-3 rounded-xl bg-neutral-900 border border-green-500/60
                 text-green-300 placeholder-green-600
                 focus:outline-none focus:ring-2 focus:ring-green-400
                 shadow-[0_0_15px_#00ff0066] transition-all" />

        <button @click="submit" :disabled="auth.loading"
          class="p-3 mt-2 rounded-xl bg-gradient-to-r from-green-500 to-green-700
                 hover:from-green-400 hover:to-green-600
                 font-bold text-black shadow-[0_0_20px_#00ff00]
                 transform hover:scale-[1.04] active:scale-[0.97]
                 transition-all">
          {{ auth.loading ? "Authenticating..." : "Login" }}
        </button>
      </div>

      <p class="mt-4 text-center text-green-600 text-sm tracking-wide">
        Authorized personnel only.
      </p>
    </div>
  </div>
</template>

<style scoped>
input:focus {
  box-shadow: 0 0 15px #00ff00, 0 0 30px #00ff00;
}

button:hover {
  box-shadow: 0 0 25px #00ff00, 0 0 40px #00ff00;
}
</style>
