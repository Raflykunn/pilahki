<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  KeyRound
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { signInWithEmail, authError } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isSubmitting = ref(false)
const isSuccess = ref(false)
const localError = ref('')
const successMessage = ref('')

// Modal Lupa Kata Sandi (Recovery PIN)
const isForgotModalOpen = ref(false)
const recoveryPin = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const forgotAlert = ref('')
const isSavingForgot = ref(false)

const handleLogin = async () => {
  localError.value = ''
  successMessage.value = ''
  if (!email.value || !password.value) {
    localError.value = 'Mohon masukkan email dan kata sandi Anda.'
    return
  }

  isSubmitting.value = true

  try {
    const res = await signInWithEmail(email.value, password.value)
    if (res.success) {
      isSuccess.value = true
      successMessage.value = 'Login berhasil! Menghubungkan ke aplikasi...'
      setTimeout(() => {
        const dest = (typeof route.query.redirect === 'string' && route.query.redirect) ? route.query.redirect : '/pilah'
        router.push(dest)
      }, 800)
    } else {
      localError.value = res.error || 'Email atau kata sandi tidak valid.'
    }
  } catch (err) {
    localError.value = 'Terjadi kesalahan sistem saat mencoba masuk.'
  } finally {
    isSubmitting.value = false
  }
}

// Handler Pemulihan PIN
const handleForgotSubmit = () => {
  forgotAlert.value = ''

  if (recoveryPin.value.length < 4) {
    forgotAlert.value = 'PIN pemulihan minimal terdiri dari 4-6 angka.'
    return
  }

  if (newPassword.value.length < 6) {
    forgotAlert.value = 'Kata sandi baru minimal harus 6 karakter.'
    return
  }

  if (newPassword.value !== confirmNewPassword.value) {
    forgotAlert.value = 'Konfirmasi kata sandi tidak cocok.'
    return
  }

  isSavingForgot.value = true

  setTimeout(() => {
    isSavingForgot.value = false
    isForgotModalOpen.value = false
    recoveryPin.value = ''
    newPassword.value = ''
    confirmNewPassword.value = ''
    successMessage.value = 'Kata sandi baru Anda berhasil disimpan! Silakan masuk.'
  }, 600)
}
</script>

<template>
  <div class="bg-[#ebf4ed] text-slate-800 font-sans min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-brand-500 selection:text-white">
    <!-- Modal Login Card (2 Kolom) -->
    <main class="w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-brand-100/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[560px]">
      
      <!-- KOLOM KIRI: Panel Ringkasan PilahKi' -->
      <div class="hidden md:flex md:col-span-5 bg-gradient-to-br from-brand-900 via-brand-800 to-[#0b2216] text-white p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
        <!-- Dekorasi Cahaya Halus -->
        <div class="absolute -top-20 -left-20 w-56 h-56 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-20 -right-20 w-56 h-56 bg-accent-light/15 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Header Brand Sisi Kiri -->
        <div class="relative z-10">
          <router-link to="/" class="inline-flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl overflow-hidden bg-white p-1 shadow-sm group-hover:scale-105 transition-transform">
              <img src="/img/logo.jpeg" alt="Logo PilahKi'" class="w-full h-full object-contain" />
            </div>
            <span class="text-2xl font-black tracking-tight text-white">
              Pilah<span class="text-accent-light">Ki'</span>
            </span>
          </router-link>
        </div>

        <!-- Pesan Inspiratif & Poin Ringkas -->
        <div class="relative z-10 my-auto py-6 space-y-6">
          <blockquote class="text-xl lg:text-2xl font-bold leading-snug text-white/95">
            “Mulai dari Pilahan, Ciptakan Perubahan”
          </blockquote>
          
          <div class="space-y-3 pt-2 text-xs text-brand-100/90">
            <div class="flex items-center gap-2.5">
              <CheckCircle2 class="w-4 h-4 text-accent-light flex-shrink-0" />
              <span>Kenali jenis & cara kelola sampah</span>
            </div>
            <div class="flex items-center gap-2.5">
              <CheckCircle2 class="w-4 h-4 text-accent-light flex-shrink-0" />
              <span>Temukan Bank Sampah & cek jadwal angkut</span>
            </div>
            <div class="flex items-center gap-2.5">
              <CheckCircle2 class="w-4 h-4 text-accent-light flex-shrink-0" />
              <span>Asisten percakapan cerdas PilahAI</span>
            </div>
          </div>
        </div>

        <!-- Footer Info Sisi Kiri -->
        <div class="relative z-10 pt-4 border-t border-white/10 text-xs text-white/70">
          &copy; {{ new Date().getFullYear() }} PilahKi' Makassar. All rights reserved.
        </div>
      </div>

      <!-- KOLOM KANAN: Form Login -->
      <div class="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
        
        <div class="mb-8 text-left">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-brand-900 tracking-tight">Login</h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Masuk ke platform PilahKi' untuk mengelola dan memantau pemilahan sampah.
          </p>
        </div>

        <!-- Info jika diarahkan dari halaman PilahAI -->
        <div v-if="route.query.redirect && String(route.query.redirect).includes('pilah-ai')" class="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
          <Lock class="w-4 h-4 text-amber-600 shrink-0" />
          <span>Silakan masuk ke akun warga Anda untuk mengakses asisten pintar PilahAI.</span>
        </div>

        <!-- Notification / Error Toast -->
        <div v-if="localError || authError" class="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
          <AlertCircle class="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{{ localError || authError }}</span>
        </div>

        <div v-if="successMessage" class="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{{ successMessage }}</span>
        </div>

        <!-- Form Login -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          
          <!-- Input Email -->
          <div>
            <label for="email" class="block text-sm font-semibold text-slate-700 mb-2 text-left">
              Email atau Username
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Mail class="w-4 h-4" />
              </span>
              <input 
                v-model="email"
                type="text" 
                id="email" 
                required 
                placeholder="nama@email.com atau username" 
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent transition-all"
                :disabled="isSubmitting"
              />
            </div>
          </div>

          <!-- Input Kata Sandi -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="password" class="block text-sm font-semibold text-slate-700">
                Kata Sandi
              </label>
              <button 
                type="button" 
                @click="isForgotModalOpen = true" 
                class="text-xs font-medium text-brand-700 hover:text-brand-800 hover:underline focus:outline-none cursor-pointer"
              >
                Lupa kata sandi?
              </button>
            </div>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Lock class="w-4 h-4" />
              </span>
              <input 
                v-model="password"
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                required 
                placeholder="Masukkan kata sandi Anda" 
                class="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent transition-all"
                :disabled="isSubmitting"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Ingat Saya -->
          <div class="flex items-center pt-1">
            <label class="flex items-center gap-2.5 cursor-pointer text-sm text-slate-600 select-none">
              <input v-model="rememberMe" type="checkbox" id="remember" class="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300" />
              <span>Ingat saya di perangkat ini</span>
            </label>
          </div>

          <!-- Tombol Masuk -->
          <button 
            type="submit" 
            :disabled="isSubmitting"
            :class="[
              'w-full py-3.5 rounded-xl font-bold text-white shadow-sm hover:shadow transition-all duration-200 text-sm mt-2 flex items-center justify-center gap-2 cursor-pointer',
              isSuccess 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-brand-800 hover:bg-brand-700'
            ]"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            <CheckCircle2 v-else-if="isSuccess" class="w-4 h-4" />
            <span>{{ isSubmitting ? 'Memproses...' : (isSuccess ? 'Berhasil Masuk' : 'Masuk') }}</span>
          </button>

        </form>

        <!-- Navigasi Bawah -->
        <div class="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-3 sm:flex-row sm:justify-between text-center sm:text-left text-sm">
          <p class="text-slate-600">
            Belum punya akun? 
            <router-link to="/register" class="font-bold text-brand-800 hover:text-brand-600 hover:underline ml-0.5">
              Daftar
            </router-link>
          </p>
          <router-link to="/" class="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors">
            Kembali ke Beranda
          </router-link>
        </div>

      </div>

    </main>

    <!-- Modal Lupa Kata Sandi (Recovery PIN Sesuai login.html) -->
    <div
      v-if="isForgotModalOpen"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      @click.self="isForgotModalOpen = false"
    >
      <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150 border border-slate-100">
        <button 
          type="button" 
          @click="isForgotModalOpen = false"
          class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="mb-5 text-left">
          <div class="w-10 h-10 rounded-xl bg-brand-50 text-brand-800 flex items-center justify-center mb-3">
            <KeyRound class="w-5 h-5" />
          </div>
          <h2 class="text-xl font-bold text-brand-900">Pemulihan Kata Sandi</h2>
          <p class="text-xs text-slate-500 mt-1">Masukkan PIN pemulihan Anda untuk membuat kata sandi baru.</p>
        </div>

        <div v-if="forgotAlert" class="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {{ forgotAlert }}
        </div>

        <form @submit.prevent="handleForgotSubmit" class="space-y-4 text-left">
          <div>
            <label for="recovery-pin" class="block text-xs font-semibold text-slate-700 mb-1.5">
              PIN Pemulihan (6 Angka)
            </label>
            <input 
              v-model="recoveryPin"
              type="password" 
              id="recovery-pin" 
              maxlength="6" 
              required 
              placeholder="••••••" 
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all font-mono"
            />
            <p class="text-[11px] text-slate-400 mt-1">PIN 6-angka keamanan akun warga Anda.</p>
          </div>

          <div>
            <label for="new-password" class="block text-xs font-semibold text-slate-700 mb-1.5">
              Kata Sandi Baru
            </label>
            <input 
              v-model="newPassword"
              type="password" 
              id="new-password" 
              required 
              placeholder="Minimal 6 karakter" 
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label for="confirm-new-password" class="block text-xs font-semibold text-slate-700 mb-1.5">
              Ulangi Kata Sandi Baru
            </label>
            <input 
              v-model="confirmNewPassword"
              type="password" 
              id="confirm-new-password" 
              required 
              placeholder="Ketik ulang kata sandi baru" 
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>

          <div class="pt-3 flex items-center justify-end gap-2.5">
            <button 
              type="button" 
              @click="isForgotModalOpen = false"
              class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit" 
              :disabled="isSavingForgot"
              class="px-5 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-75 flex items-center gap-1.5"
            >
              <Loader2 v-if="isSavingForgot" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ isSavingForgot ? 'Menyimpan...' : 'Simpan Sandi Baru' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>
