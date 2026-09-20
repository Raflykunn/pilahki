<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { X, LogOut, CheckCircle2 } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const router = useRouter()
const { userEmail, isAuthenticated, signOut } = useAuth()

const userName = computed(() => {
  try {
    const raw = localStorage.getItem('pilahki_user')
    if (raw) {
      const u = JSON.parse(raw)
      return u.name || 'Warga PilahKi'
    }
  } catch (e) {}
  return userEmail.value ? userEmail.value.split('@')[0] : "Warga PilahKi'"
})

const userInitial = computed(() => {
  return userName.value.trim().charAt(0).toUpperCase()
})

const handleLogout = async () => {
  emit('close')
  await signOut()
  router.push('/login')
}

const handleGoLogin = () => {
  emit('close')
  router.push('/login')
}

const handleGoRegister = () => {
  emit('close')
  router.push('/register')
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 relative animate-in zoom-in-95 duration-150 border border-slate-100">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 class="text-base font-bold text-slate-900">Profil Warga</h3>
        <button
          type="button"
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Mode Tamu (Belum Login) -->
      <div v-if="!isAuthenticated" class="space-y-4 py-2">
        <div class="flex items-center gap-3">
          <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xl select-none">
            <span>T</span>
          </div>
          <div class="truncate">
            <h4 class="text-base font-bold text-slate-900 truncate">Pengunjung Tamu</h4>
            <p class="text-xs text-slate-500 truncate">Akses fitur terbatas</p>
            <span class="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Mode Tamu
            </span>
          </div>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
          Masuk ke akun Anda untuk dapat berinteraksi dengan asisten pintar PilahAI dan menyimpan preferensi domisili.
        </p>

        <div class="pt-2 space-y-2 border-t border-slate-100">
          <button 
            type="button" 
            @click="handleGoLogin"
            class="w-full py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            Masuk ke Akun
          </button>
          <button 
            type="button" 
            @click="handleGoRegister"
            class="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Daftar Akun Baru
          </button>
        </div>
      </div>

      <!-- Mode Warga Terdaftar (Sudah Login) -->
      <template v-else>
        <div class="flex items-center gap-3 py-2">
          <div class="w-14 h-14 rounded-2xl bg-brand-800 text-white flex items-center justify-center font-bold text-xl shadow-xs select-none">
            <span>{{ userInitial }}</span>
          </div>
          <div class="truncate">
            <h4 class="text-base font-bold text-slate-900 truncate">{{ userName }}</h4>
            <p class="text-xs text-slate-500 truncate">{{ userEmail || 'warga@pilahki.id' }}</p>
            <span class="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Warga Aktif Makassar
            </span>
          </div>
        </div>

        <div class="pt-2 space-y-2 border-t border-slate-100">
          <button 
            type="button" 
            @click="handleLogout"
            class="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut class="w-4 h-4" />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
