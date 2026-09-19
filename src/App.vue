<script setup>
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-zinc-50/50 text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
    <Navbar />
    <main class="flex-1 w-full">
      <router-view />
    </main>
    <Footer v-if="route.path !== '/pilah-ai'" />
  </div>
</template>
