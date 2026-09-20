<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { appConfig } from '@/config/app'
import {
  Menu,
  X,
  MapPin,
  Sparkles,
  ChevronDown
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { isAuthenticated, userEmail, signOut } = useAuth()

const isMobileMenuOpen = ref(false)
const domicile = ref({ city: 'Kota Makassar', district: 'Panakkukang' })

defineEmits(['open-domicile', 'open-profile', 'open-auth'])

const isLandingRoute = computed(() => route.path === '/')
const isAuthRoute = computed(() => route.path === '/login' || route.path === '/register')

const landingSections = [
  { name: 'Tentang', id: 'tentang' },
  { name: 'Tantangan', id: 'masalah' },
  { name: 'Fitur', id: 'fitur' },
  { name: 'Dampak', id: 'sdg' },
  { name: 'FAQ', id: 'faq' }
]

const appNavTabs = [
  { name: 'Pilah Sampah', path: '/pilah' },
  { name: 'Cari Lokasi', path: '/lokasi' },
  { name: 'Jadwal Angkut', path: '/jadwal' },
  { name: 'Panduan', path: '/panduan' }
]

const isTabActive = (path) => {
  return route.path === path || route.path.startsWith(`${path}/`)
}

const userName = computed(() => {
  try {
    const raw = localStorage.getItem('pilahki_user')
    if (raw) {
      const u = JSON.parse(raw)
      return u.name || "Warga PilahKi'"
    }
  } catch (e) {}
  return userEmail.value ? userEmail.value.split('@')[0] : "Warga PilahKi'"
})

const userInitial = computed(() => {
  return userName.value.trim().charAt(0).toUpperCase()
})

onMounted(() => {
  try {
    const raw = localStorage.getItem('pilahki_domicile')
    if (raw) {
      domicile.value = JSON.parse(raw)
    }
  } catch (e) {}
})

const scrollToSection = (id) => {
  isMobileMenuOpen.value = false
  if (route.path !== '/') {
    router.push(`/#${id}`)
    return
  }
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleLogout = async () => {
  isMobileMenuOpen.value = false
  await signOut()
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full glass-nav border-b border-slate-100 bg-white/95 backdrop-blur-md transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        
        <!-- Sisi Kiri: Logo & Navigasi -->
        <div class="flex items-center gap-6 lg:gap-10">
          <router-link to="/" class="flex items-center py-1 shrink-0">
            <img :src="appConfig.logo" :alt="appConfig.name" class="h-11 sm:h-13 w-auto object-contain" />
          </router-link>

          <!-- 1. Menu Navigasi Landing Page (Jika di Beranda) -->
          <nav v-if="isLandingRoute" class="hidden md:flex items-center gap-8 font-medium text-slate-600 text-sm">
            <button
              v-for="sec in landingSections"
              :key="sec.id"
              type="button"
              class="hover:text-brand-800 transition-colors cursor-pointer"
              @click="scrollToSection(sec.id)"
            >
              {{ sec.name }}
            </button>
          </nav>

          <!-- 2. Menu Navigasi Tab Internal Aplikasi (Jika di Halaman App) -->
          <nav v-else-if="!isAuthRoute" class="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Navigasi Menu Utama">
            <router-link
              v-for="tab in appNavTabs"
              :key="tab.path"
              :to="tab.path"
              :class="[
                'px-3.5 lg:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all',
                isTabActive(tab.path)
                  ? 'bg-brand-800 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-brand-800 hover:bg-slate-100/70'
              ]"
            >
              {{ tab.name }}
            </router-link>
          </nav>
        </div>

        <!-- Sisi Kanan: Action & Profile Area -->
        <div class="flex items-center gap-3">
          
          <!-- Mode Landing Page: Masuk & Daftar -->
          <template v-if="isLandingRoute">
            <template v-if="!isAuthenticated">
              <router-link
                to="/login"
                class="hidden md:inline-flex px-4 py-2 text-sm font-bold text-brand-800 hover:text-brand-600 transition-colors"
              >
                Masuk
              </router-link>
              <router-link
                to="/register"
                class="hidden md:inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-800 hover:bg-brand-700 shadow-sm hover:shadow transition-all duration-200"
              >
                Daftar
              </router-link>
            </template>
            <template v-else>
              <router-link
                to="/pilah"
                class="hidden md:inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-800 hover:bg-brand-700 shadow-sm"
              >
                Buka Aplikasi
              </router-link>
            </template>
          </template>

          <!-- Mode In-App Header (Sesuai App/index.html Binfinity) -->
          <template v-else-if="!isAuthRoute">
            
            <!-- Domicile Pill Button -->
            <button
              type="button"
              @click="$emit('open-domicile')"
              class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-100/80 text-brand-800 text-xs font-bold hover:bg-brand-100 transition-colors cursor-pointer"
              title="Ubah wilayah domisili Anda"
            >
              <MapPin class="w-3.5 h-3.5 text-brand-600" />
              <span>{{ domicile.district || 'Panakkukang' }}, {{ domicile.city || 'Makassar' }}</span>
            </button>

            <!-- User Display & Avatar (Desktop, Jika Login) -->
            <div
              v-if="isAuthenticated"
              @click="$emit('open-profile')"
              class="hidden md:flex items-center gap-3 cursor-pointer group p-1.5 rounded-xl hover:bg-slate-100/70 transition-colors"
              title="Buka profil warga"
            >
              <div class="flex flex-col text-right">
                <span class="text-sm font-bold text-slate-900 leading-tight group-hover:text-brand-800 transition-colors">{{ userName }}</span>
                <span class="text-[11px] text-slate-500">{{ userEmail || 'warga@pilahki.id' }}</span>
              </div>

              <div
                class="w-10 h-10 rounded-xl bg-brand-800 text-white flex items-center justify-center font-bold text-sm shadow-xs select-none group-hover:bg-brand-700 transition-colors"
              >
                <span>{{ userInitial }}</span>
              </div>
            </div>

            <!-- Tombol Masuk & Daftar (Desktop, Jika Tamu) -->
            <div v-else class="hidden md:flex items-center gap-2">
              <router-link
                :to="{ path: '/login', query: { redirect: route.fullPath } }"
                class="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-brand-800 hover:bg-brand-50 transition-colors"
              >
                Masuk
              </router-link>
              <router-link
                :to="{ path: '/register', query: { redirect: route.fullPath } }"
                class="inline-flex items-center px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-800 hover:bg-brand-700 shadow-xs transition-all"
              >
                Daftar
              </router-link>
            </div>
          </template>

          <!-- Mode Auth Route (Login/Register): Link Kembali -->
          <template v-else>
            <router-link
              to="/"
              class="text-xs sm:text-sm font-semibold text-slate-500 hover:text-brand-800 transition-colors"
            >
              Kembali ke Beranda
            </router-link>
          </template>

          <!-- Mobile Menu Hamburger Button (Hanya di mode Landing Page) -->
          <div v-if="isLandingRoute" class="md:hidden flex items-center">
            <button
              type="button"
              class="p-2 rounded-xl text-slate-600 hover:text-brand-800 hover:bg-brand-50 focus:outline-none cursor-pointer"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              aria-label="Buka Menu"
            >
              <X v-if="isMobileMenuOpen" class="w-6 h-6" />
              <Menu v-else class="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Mobile Drawer Navigation (Khusus Landing Page) -->
    <div
      v-if="isLandingRoute && isMobileMenuOpen"
      class="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 transition-all"
    >
      <button
        v-for="sec in landingSections"
        :key="sec.id"
        type="button"
        class="block w-full text-left py-2 text-slate-700 font-semibold hover:text-brand-800"
        @click="scrollToSection(sec.id)"
      >
        {{ sec.name }}
      </button>

      <div class="pt-4 border-t border-slate-100 flex flex-col gap-2">
        <router-link
          to="/login"
          class="w-full text-center py-2.5 rounded-xl border border-brand-800 text-brand-800 font-bold text-sm hover:bg-brand-50"
          @click="isMobileMenuOpen = false"
        >
          Masuk
        </router-link>
        <router-link
          to="/register"
          class="w-full text-center py-2.5 rounded-xl bg-brand-800 text-white font-bold text-sm hover:bg-brand-700 shadow-sm"
          @click="isMobileMenuOpen = false"
        >
          Daftar
        </router-link>
      </div>
    </div>
  </header>
</template>
