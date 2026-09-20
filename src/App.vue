<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import MobileBottomNav from '@/components/MobileBottomNav.vue'
import FloatingPilahAi from '@/components/FloatingPilahAi.vue'
import ProfileModal from '@/components/ProfileModal.vue'
import DomicileModal from '@/components/DomicileModal.vue'

const route = useRoute()

const isProfileOpen = ref(false)
const isDomicileOpen = ref(false)

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
  // Check if new user needs to set domicile
  try {
    const isNew = localStorage.getItem('pilahki_is_new_user')
    const hasDomicile = localStorage.getItem('pilahki_domicile')
    if (isNew && !hasDomicile) {
      isDomicileOpen.value = true
    }
  } catch (e) {}
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#fafdfa] text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
    <!-- Top Sticky Adaptive Navigation -->
    <Navbar
      @open-profile="isProfileOpen = true"
      @open-domicile="isDomicileOpen = true"
    />

    <!-- Main Dynamic Content -->
    <main
      class="flex-1 w-full"
      :class="{ 'pb-24 md:pb-0': showMobileBottomNav }"
    >
      <router-view />
    </main>

    <!-- Global Floating PilahAI Assistant -->
    <FloatingPilahAi v-if="showFloatingAi" />

    <!-- Mobile Floating Bottom Bar for In-App Routes -->
    <MobileBottomNav
      v-if="showMobileBottomNav"
      @open-profile="isProfileOpen = true"
    />

    <!-- Global Modals -->
    <ProfileModal
      :isOpen="isProfileOpen"
      @close="isProfileOpen = false"
    />

    <DomicileModal
      :isOpen="isDomicileOpen"
      @close="isDomicileOpen = false"
    />

    <!-- Footer -->
    <Footer v-if="showFooter" />
  </div>
</template>
