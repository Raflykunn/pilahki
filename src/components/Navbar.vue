<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import AuthModal from '@/components/AuthModal.vue'
import {
  Recycle,
  Sparkles,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  MapPin,
  Calendar,
  BookOpen,
  Search
} from 'lucide-vue-next'

import { appConfig } from '@/config/app'

const route = useRoute()
const router = useRouter()
const { isAuthenticated, userEmail, initAuth, signOut } = useAuth()

const isMobileMenuOpen = ref(false)
const isProfileDropdownOpen = ref(false)
const isAuthModalOpen = ref(false)
const profileDropdownRef = ref(null)

// NavLinks standar (PilahAI diakses melalui tombol khusus berwarna hijau)
const navLinks = [
  { name: 'Beranda', path: '/', icon: Recycle },
  { name: 'Pilah Sampah', path: '/pilah', icon: Search },
  { name: 'Cari Lokasi', path: '/lokasi', icon: MapPin },
  { name: 'Jadwal Angkut', path: '/jadwal', icon: Calendar },
  { name: 'Panduan', path: '/panduan', icon: BookOpen },
]

// Pengecekan aktif: mencocokkan rute secara presisi agar /pilah-ai tidak salah menyalakan /pilah
const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}

// Status aktif untuk halaman PilahAI
const isPilahAiActive = computed(() => {
  return route.path === '/pilah-ai' || route.path.startsWith('/pilah-ai/')
})

const userInitials = computed(() => {
  if (!userEmail.value) return 'U'
  return userEmail.value.slice(0, 2).toUpperCase()
})

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value
}

const handleClickOutside = (e) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(e.target)) {
    isProfileDropdownOpen.value = false
  }
}

const handleLogout = async () => {
  isProfileDropdownOpen.value = false
  isMobileMenuOpen.value = false
  await signOut()
}

onMounted(() => {
  initAuth()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md transition-all">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <div class="flex items-center gap-8">
        <router-link to="/" class="flex items-center gap-2.5 group focus-visible:outline-none">
          <img
            :src="appConfig.logo"
            :alt="appConfig.name"
            class="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </router-link>

        <!-- Desktop Navigation Links (Beranda, Pilah Sampah, Cari Lokasi, Jadwal Angkut, Panduan) -->
        <nav class="hidden md:flex items-center space-x-1" aria-label="Navigasi Utama">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'px-3.5 py-2 text-sm font-medium rounded-lg transition-all',
              isActive(link.path)
                ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            ]"
          >
            {{ link.name }}
          </router-link>
        </nav>
      </div>

      <!-- Right Action Area -->
      <div class="flex items-center gap-3">
        <!-- Tombol Hijau Tanya PilahAI dengan Efek Focus / Active State -->
        <router-link to="/pilah-ai">
          <Button
            variant="default"
            size="sm"
            :class="[
              'hidden sm:inline-flex items-center gap-2 rounded-lg text-sm transition-all duration-200 cursor-pointer',
              isPilahAiActive
                ? 'bg-emerald-700 text-white font-semibold ring-2 ring-emerald-600 ring-offset-2 ring-offset-white shadow-md shadow-emerald-700/30 scale-[1.02]'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-medium hover:scale-[1.01]'
            ]"
          >
            <!-- Titik Indikator Aktif saat berada di halaman PilahAI -->
            <span v-if="isPilahAiActive" class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-200"></span>
            </span>
            <Sparkles v-else class="h-4 w-4 text-emerald-200" />

            <span>Tanya PilahAI</span>
          </Button>
        </router-link>

        <!-- Auth Area -->
        <div v-if="isAuthenticated" ref="profileDropdownRef" class="relative">
          <button
            type="button"
            class="flex items-center gap-2 rounded-full p-1 hover:bg-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 cursor-pointer"
            @click.stop="toggleProfileDropdown"
            aria-label="Menu Profil"
          >
            <Avatar class="h-8 w-8 border border-emerald-200">
              <AvatarFallback>{{ userInitials }}</AvatarFallback>
            </Avatar>
            <ChevronDown class="h-3.5 w-3.5 text-zinc-500" />
          </button>

          <!-- Profile Dropdown -->
          <div
            v-if="isProfileDropdownOpen"
            class="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            <div class="px-3 py-2 border-b border-zinc-100 mb-1">
              <p class="text-xs text-zinc-400 font-medium">Akun Terdaftar</p>
              <p class="text-xs font-medium text-zinc-900 truncate" :title="userEmail">{{ userEmail }}</p>
            </div>
            <router-link
              to="/pilah"
              class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
              @click="isProfileDropdownOpen = false"
            >
              <Search class="h-3.5 w-3.5 text-zinc-500" />
              <span>Katalog Sampah</span>
            </router-link>
            <router-link
              to="/pilah-ai"
              class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
              @click="isProfileDropdownOpen = false"
            >
              <Sparkles class="h-3.5 w-3.5 text-emerald-600" />
              <span>Asisten PilahAI</span>
            </router-link>
            <div class="my-1 border-t border-zinc-100"></div>
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              @click="handleLogout"
            >
              <LogOut class="h-3.5 w-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        <Button
          v-else
          variant="outline"
          size="sm"
          class="border-zinc-300 text-zinc-700 hover:bg-zinc-100 gap-1.5 font-medium"
          @click="isAuthModalOpen = true"
        >
          <User class="h-3.5 w-3.5" />
          <span>Masuk</span>
        </Button>

        <!-- Mobile Menu Hamburger Button -->
        <button
          type="button"
          class="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          aria-label="Buka Menu"
        >
          <X v-if="isMobileMenuOpen" class="h-5 w-5" />
          <Menu v-else class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer / Dropdown Menu -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden border-b border-zinc-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-xl"
    >
      <router-link
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        :class="[
          'flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors',
          isActive(link.path)
            ? 'bg-emerald-50 text-emerald-800 font-semibold'
            : 'text-zinc-700 hover:bg-zinc-100'
        ]"
        @click="isMobileMenuOpen = false"
      >
        <component :is="link.icon" class="h-4 w-4" :class="isActive(link.path) ? 'text-emerald-700' : 'text-zinc-500'" />
        <span>{{ link.name }}</span>
      </router-link>

      <div class="pt-2 border-t border-zinc-100">
        <router-link
          to="/pilah-ai"
          :class="[
            'flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all',
            isPilahAiActive
              ? 'bg-emerald-700 text-white ring-2 ring-emerald-600 ring-offset-2 ring-offset-white shadow-md'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
          ]"
          @click="isMobileMenuOpen = false"
        >
          <Sparkles class="h-4 w-4 text-emerald-200" />
          <span>Tanya PilahAI (Chatbot)</span>
        </router-link>
      </div>
    </div>

    <!-- Global Auth Modal -->
    <AuthModal
      :is-open="isAuthModalOpen"
      @close="isAuthModalOpen = false"
      @auth-success="isAuthModalOpen = false"
    />
  </header>
</template>
