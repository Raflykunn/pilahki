<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogIn, UserPlus, AlertCircle, CheckCircle2, Lock, Mail, Loader2, Sparkles } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Masuk ke Pilahki',
  },
  subtitle: {
    type: String,
    default: 'Masuk dengan email dan kata sandi untuk mengakses fitur lengkap Pilahki.',
  },
})

const emit = defineEmits(['close', 'auth-success'])

const {
  loading,
  authError,
  signInWithEmail,
  signUpWithEmail,
} = useAuth()

const isRegisterMode = ref(false)
const email = ref('')
const password = ref('')
const successMessage = ref('')

const resetForm = () => {
  email.value = ''
  password.value = ''
  successMessage.value = ''
}

const handleClose = () => {
  resetForm()
  emit('close')
}

const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  successMessage.value = ''
}

const handleSubmit = async () => {
  successMessage.value = ''
  if (!email.value || !password.value) return

  if (isRegisterMode.value) {
    const res = await signUpWithEmail(email.value, password.value)
    if (res.success) {
      successMessage.value = 'Pendaftaran berhasil! Silakan periksa email Anda atau langsung masuk.'
      setTimeout(() => {
        emit('auth-success')
        handleClose()
      }, 1500)
    }
  } else {
    const res = await signInWithEmail(email.value, password.value)
    if (res.success) {
      emit('auth-success')
      handleClose()
    }
  }
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="(val) => !val && handleClose()">
    <DialogContent class="max-w-md p-6 sm:p-8">
      <DialogHeader class="text-left mb-6 space-y-2">
        <div class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-1">
          <Sparkles class="h-5 w-5" />
        </div>
        <DialogTitle class="text-xl font-bold text-zinc-900">
          {{ isRegisterMode ? 'Buat Akun Pilahki' : title }}
        </DialogTitle>
        <DialogDescription class="text-sm text-zinc-500">
          {{ isRegisterMode ? 'Daftar sekarang untuk menyimpan riwayat pemilahan dan jadwal angkut.' : subtitle }}
        </DialogDescription>
      </DialogHeader>

      <!-- Alert Error -->
      <div
        v-if="authError"
        class="mb-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 leading-relaxed"
        role="alert"
      >
        <AlertCircle class="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
        <span>{{ authError }}</span>
      </div>

      <!-- Alert Success -->
      <div
        v-if="successMessage"
        class="mb-4 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 leading-relaxed"
        role="status"
      >
        <CheckCircle2 class="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
        <span>{{ successMessage }}</span>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-1.5">
          <label for="auth-email" class="text-xs font-semibold text-zinc-700">Email</label>
          <div class="relative">
            <Mail class="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              id="auth-email"
              v-model="email"
              type="email"
              placeholder="nama@email.com"
              class="pl-9"
              required
              :disabled="loading"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label for="auth-password" class="text-xs font-semibold text-zinc-700">Kata Sandi</label>
          <div class="relative">
            <Lock class="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              id="auth-password"
              v-model="password"
              type="password"
              placeholder="Minimal 6 karakter"
              class="pl-9"
              required
              minlength="6"
              :disabled="loading"
            />
          </div>
        </div>

        <div class="pt-2">
          <Button
            type="submit"
            class="w-full h-11 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30"
            :disabled="loading"
          >
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            <LogIn v-else-if="!isRegisterMode" class="mr-2 h-4 w-4" />
            <UserPlus v-else class="mr-2 h-4 w-4" />
            <span>{{ isRegisterMode ? 'Daftar Akun Baru' : 'Masuk Sekarang' }}</span>
          </Button>
        </div>
      </form>

      <!-- Switch Mode Footer -->
      <div class="mt-6 border-t border-zinc-100 pt-4 text-center">
        <p class="text-xs text-zinc-500">
          {{ isRegisterMode ? 'Sudah memiliki akun Pilahki?' : 'Belum memiliki akun?' }}
          <button
            type="button"
            class="ml-1 font-semibold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
            @click="toggleMode"
          >
            {{ isRegisterMode ? 'Masuk di sini' : 'Daftar sekarang' }}
          </button>
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>
