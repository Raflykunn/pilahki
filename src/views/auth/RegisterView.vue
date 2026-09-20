<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { signUpWithEmail, authError } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)
const isSuccess = ref(false)
const localError = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  localError.value = ''
  successMessage.value = ''

  if (!email.value || !password.value) {
    localError.value = 'Mohon isi semua bidang yang diperlukan.'
    return
  }

  if (password.value !== passwordConfirm.value) {
    localError.value = 'Konfirmasi kata sandi tidak cocok.'
    return
  }

  if (password.value.length < 6) {
    localError.value = 'Kata sandi minimal 6 karakter.'
    return
  }

  isSubmitting.value = true

  try {
    const res = await signUpWithEmail(email.value, password.value, name.value)
    if (res.success) {
      isSuccess.value = true
      successMessage.value = 'Pendaftaran berhasil! Mengarahkan ke aplikasi...'
      setTimeout(() => {
        const dest = (typeof route.query.redirect === 'string' && route.query.redirect) ? route.query.redirect : '/pilah'
        router.push(dest)
      }, 800)
    } else {
      localError.value = res.error || 'Gagal mendaftar. Silakan coba lagi.'
    }
  } catch (err) {
    localError.value = 'Terjadi kesalahan sistem saat mendaftar.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="bg-[#ebf4ed] text-slate-800 font-sans min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-brand-500 selection:text-white">
    <!-- Modal Register Card (2 Kolom) -->
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
          &copy; {{ new Date().getFullYear() }} Binfinity. All rights reserved.
        </div>
      </div>

      <!-- KOLOM KANAN: Form Register -->
      <div class="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
        
        <div class="mb-6 text-left">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-brand-900 tracking-tight">Daftar Akun Baru</h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Bergabunglah bersama warga Makassar untuk hidup lebih bersih dan tertata.
          </p>
        </div>

        <!-- Info jika diarahkan dari halaman PilahAI -->
        <div v-if="route.query.redirect && String(route.query.redirect).includes('pilah-ai')" class="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
          <Lock class="w-4 h-4 text-amber-600 shrink-0" />
          <span>Daftar akun warga gratis untuk mulai bertanya ke asisten cerdas PilahAI.</span>
        </div>

        <!-- Notification / Error Alert -->
        <div v-if="localError || authError" class="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
          <AlertCircle class="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{{ localError || authError }}</span>
        </div>

        <div v-if="successMessage" class="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 class="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{{ successMessage }}</span>
        </div>

        <!-- Form Register -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          
          <!-- Nama Lengkap -->
          <div>
            <label for="reg-name" class="block text-xs font-semibold text-slate-700 mb-1.5 text-left">
              Nama Lengkap
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <User class="w-4 h-4" />
              </span>
              <input 
                v-model="name"
                type="text" 
                id="reg-name" 
                placeholder="Contoh: Ibu Rina" 
                class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent transition-all"
                :disabled="isSubmitting"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="reg-email" class="block text-xs font-semibold text-slate-700 mb-1.5 text-left">
              Alamat Email <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Mail class="w-4 h-4" />
              </span>
              <input 
                v-model="email"
                type="email" 
                id="reg-email" 
                required 
                placeholder="nama@email.com" 
                class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent transition-all"
                :disabled="isSubmitting"
              />
            </div>
          </div>

          <!-- Kata Sandi -->
          <div>
            <label for="reg-password" class="block text-xs font-semibold text-slate-700 mb-1.5 text-left">
              Kata Sandi <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Lock class="w-4 h-4" />
              </span>
              <input 
                v-model="password"
                :type="showPassword ? 'text' : 'password'" 
                id="reg-password" 
                required 
                minlength="6"
                placeholder="Minimal 6 karakter" 
                class="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent transition-all"
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

          <!-- Konfirmasi Kata Sandi -->
          <div>
            <label for="reg-confirm" class="block text-xs font-semibold text-slate-700 mb-1.5 text-left">
              Ulangi Kata Sandi <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Lock class="w-4 h-4" />
              </span>
              <input 
                v-model="passwordConfirm"
                :type="showPassword ? 'text' : 'password'" 
                id="reg-confirm" 
                required 
                minlength="6"
                placeholder="Ulangi kata sandi" 
                class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent transition-all"
                :disabled="isSubmitting"
              />
            </div>
          </div>

          <!-- Tombol Daftar -->
          <button 
            type="submit" 
            :disabled="isSubmitting"
            :class="[
              'w-full py-3.5 rounded-xl font-bold text-white shadow-sm hover:shadow transition-all duration-200 text-sm mt-4 flex items-center justify-center gap-2 cursor-pointer',
              isSuccess 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-brand-800 hover:bg-brand-700'
            ]"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            <CheckCircle2 v-else-if="isSuccess" class="w-4 h-4" />
            <span>{{ isSubmitting ? 'Mendaftarkan...' : (isSuccess ? 'Berhasil Terdaftar' : 'Daftar Sekarang') }}</span>
          </button>

        </form>

        <!-- Navigasi Bawah -->
        <div class="mt-6 pt-4 border-t border-slate-100 text-center text-sm">
          <p class="text-slate-600">
            Sudah punya akun? 
            <router-link to="/login" class="font-bold text-brand-800 hover:text-brand-600 hover:underline ml-0.5">
              Masuk
            </router-link>
          </p>
        </div>

      </div>

    </main>
  </div>
</template>
