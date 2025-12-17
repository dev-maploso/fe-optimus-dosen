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
  <div class="flex items-center justify-center min-h-screen
              bg-gradient-to-br from-green-400 via-green-500 to-green-700
              font-sans relative overflow-hidden">

    <!-- Animated Waves Background -->
    <div class="absolute w-full h-full top-0 left-0 overflow-hidden">
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
    </div>

    <!-- Decorative Circles -->
    <div class="absolute top-0 left-0 w-72 h-72 bg-green-200/30 rounded-full -translate-x-1/3 -translate-y-1/3 animate-pulse-slow"></div>
    <div class="absolute bottom-0 right-0 w-80 h-80 bg-green-300/20 rounded-full translate-x-1/4 translate-y-1/4 animate-pulse-slow"></div>

    <!-- Login Card -->
    <div class="relative z-10 w-full max-w-md p-10
                bg-white shadow-xl rounded-2xl
                border border-green-300
                transform transition-transform duration-700
                hover:scale-[1.02] hover:shadow-2xl
                animate-fade-in">

      <h1 class="text-4xl font-bold text-green-700 text-center mb-6 animate-slide-down">
        Portal Akademik
      </h1>

      <p class="text-center text-gray-600 mb-8 animate-slide-up">
        Masuk dengan akun kampus Anda
      </p>

      <div class="flex flex-col gap-4">
        <input v-model="email" type="email" placeholder="Email" 
          class="p-3 rounded-lg border border-green-300
                 focus:ring-2 focus:ring-green-400
                 focus:border-green-400 transition-all animate-input" />

        <input v-model="password" type="password" placeholder="Password"
          class="p-3 rounded-lg border border-green-300
                 focus:ring-2 focus:ring-green-400
                 focus:border-green-400 transition-all animate-input" />

        <button @click="submit" :disabled="auth.loading"
          class="p-3 mt-2 rounded-lg bg-gradient-to-r from-green-600 to-green-500
                 text-white font-semibold shadow hover:from-green-500 hover:to-green-400
                 transform hover:scale-[1.03] active:scale-[0.97] transition-all animate-bounce-slow">
          {{ auth.loading ? "Authenticating..." : "Login" }}
        </button>
      </div>

      <p class="mt-6 text-center text-green-600 text-sm animate-fade-in-delay">
        Hak akses hanya untuk civitas akademika.
      </p>

    </div>
  </div>
</template>

<style scoped>
/* Waves animation */
.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 10%, transparent 70%);
  border-radius: 40%;
  animation: waveMove 20s linear infinite;
  opacity: 0.6;
}

.wave2 {
  animation-duration: 35s;
  opacity: 0.4;
}

@keyframes waveMove {
  0% { transform: rotate(0deg) translateX(0) translateY(0); }
  50% { transform: rotate(180deg) translateX(20px) translateY(-20px); }
  100% { transform: rotate(360deg) translateX(0) translateY(0); }
}

/* Pulse animation for circles */
@keyframes pulseSlow {
  0%, 100% { transform: scale(1) }
  50% { transform: scale(1.05) }
}
.animate-pulse-slow {
  animation: pulseSlow 6s ease-in-out infinite;
}

/* Fade in and slide animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 1s ease forwards;
}

@keyframes fadeInDelay {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
.animate-fade-in-delay {
  animation: fadeInDelay 1.5s ease forwards;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-down {
  animation: slideDown 0.8s ease forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp 0.8s ease forwards;
}

@keyframes inputFocus {
  0% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  50% { transform: translateX(2px); }
  75% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
}
.animate-input:focus {
  animation: inputFocus 0.3s ease;
}

@keyframes bounceSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.animate-bounce-slow {
  animation: bounceSlow 2s ease-in-out infinite;
}

/* Input focus and button hover already exist */
input:focus {
  outline: none;
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.6);
}

button:hover {
  box-shadow: 0 0 16px rgba(34, 197, 94, 0.5);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
