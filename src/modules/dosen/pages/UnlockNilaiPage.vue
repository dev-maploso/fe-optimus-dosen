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
  <div class="flex items-center justify-center min-h-screen
              bg-gradient-to-br from-green-400 via-green-500 to-green-700
              relative overflow-hidden font-sans">

    <!-- Animated Waves Background -->
    <div class="absolute w-full h-full top-0 left-0 overflow-hidden">
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
    </div>

    <!-- Decorative Circles -->
    <div class="absolute top-0 left-0 w-72 h-72 bg-green-200/30 rounded-full -translate-x-1/3 -translate-y-1/3 animate-pulse-slow"></div>
    <div class="absolute bottom-0 right-0 w-80 h-80 bg-green-300/20 rounded-full translate-x-1/4 translate-y-1/4 animate-pulse-slow"></div>

    <!-- Access Code Card -->
    <div class="relative z-10 p-8 rounded-2xl border border-green-300 w-96
                bg-white shadow-xl
                transform transition-transform duration-700
                hover:scale-[1.02] hover:shadow-2xl
                animate-fade-in">

      <h2 class="text-xl font-bold mb-4 text-center text-green-700 animate-slide-down">
        INPUT KODE AKSES
      </h2>

      <input
        v-model="inputKode"
        placeholder="Masukkan kode Akses"
        class="w-full p-3 mb-4 bg-white border border-green-300 rounded-xl
               focus:ring-2 focus:ring-green-400 focus:border-green-400 text-green-700 transition-all animate-input"
      />

      <button
        @click="submitKode"
        class="w-full p-3 bg-gradient-to-r from-green-600 to-green-500
               text-white font-bold rounded-xl shadow hover:from-green-500 hover:to-green-400
               transform hover:scale-[1.03] active:scale-[0.97] transition-all animate-bounce-slow"
      >
        Unlock
      </button>
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

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-down {
  animation: slideDown 0.8s ease forwards;
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

/* Input focus and button hover */
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
