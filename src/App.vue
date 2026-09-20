<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import MobileBottomNav from '@/components/MobileBottomNav.vue'
import FloatingPilahAi from '@/components/FloatingPilahAi.vue'
import ProfileModal from '@/components/ProfileModal.vue'

import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { initAuth } = useAuth()

const isProfileOpen = ref(false)

const isAuthRoute = computed(() => route.path === '/login' || route.path === '/register')
const isAiFullRoute = computed(() => route.path === '/pilah-ai')
const isInAppRoute = computed(() => ['/pilah', '/lokasi', '/jadwal', '/panduan'].some(p => route.path.startsWith(p)))

const showFooter = computed(() => {
  return !isAuthRoute.value && !isAiFullRoute.value
})

const showMobileBottomNav = computed(() => {
  return isInAppRoute.value
})

const showFloatingAi = computed(() => {
  return !isAuthRoute.value && !isAiFullRoute.value
})

onMounted(() => {
  
  initAuth()

  try {
    localStorage.removeItem('pilahki_is_new_user')
  } catch (e) {}
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#fafdfa] text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
    
    <Navbar
      @open-profile="isProfileOpen = true"
    />

    <main
      class="flex-1 w-full"
      :class="{ 'pb-24 md:pb-0': showMobileBottomNav }"
    >
      <router-view />
    </main>

    <FloatingPilahAi v-if="showFloatingAi" />

    <MobileBottomNav
      v-if="showMobileBottomNav"
      @open-profile="isProfileOpen = true"
    />

    <ProfileModal
      :isOpen="isProfileOpen"
      @close="isProfileOpen = false"
    />

    <Footer v-if="showFooter" />
  </div>
</template>
