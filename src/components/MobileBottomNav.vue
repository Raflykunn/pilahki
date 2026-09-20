<script setup>
import { useRoute } from 'vue-router'
import {
  Layers,
  MapPin,
  Calendar,
  BookOpen,
  User
} from 'lucide-vue-next'

const route = useRoute()

defineEmits(['open-profile'])

const isActive = (path) => {
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  
  <nav class="md:hidden fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl px-2 py-1.5 flex items-center justify-around select-none">

    <router-link
      to="/pilah"
      :class="[
        'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all',
        isActive('/pilah')
          ? 'text-brand-800 font-bold bg-brand-50 border border-brand-100/60'
          : 'text-slate-500 hover:text-brand-800 font-medium'
      ]"
    >
      <Layers class="w-5 h-5" :class="isActive('/pilah') ? 'text-brand-700' : ''" />
      <span class="text-[10px] tracking-tight">Pilah</span>
    </router-link>

    <router-link
      to="/lokasi"
      :class="[
        'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all',
        isActive('/lokasi')
          ? 'text-brand-800 font-bold bg-brand-50 border border-brand-100/60'
          : 'text-slate-500 hover:text-brand-800 font-medium'
      ]"
    >
      <MapPin class="w-5 h-5" :class="isActive('/lokasi') ? 'text-brand-700' : ''" />
      <span class="text-[10px] tracking-tight">Lokasi</span>
    </router-link>

    <router-link
      to="/jadwal"
      :class="[
        'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all',
        isActive('/jadwal')
          ? 'text-brand-800 font-bold bg-brand-50 border border-brand-100/60'
          : 'text-slate-500 hover:text-brand-800 font-medium'
      ]"
    >
      <Calendar class="w-5 h-5" :class="isActive('/jadwal') ? 'text-brand-700' : ''" />
      <span class="text-[10px] tracking-tight">Jadwal</span>
    </router-link>

    <router-link
      to="/panduan"
      :class="[
        'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all',
        isActive('/panduan')
          ? 'text-brand-800 font-bold bg-brand-50 border border-brand-100/60'
          : 'text-slate-500 hover:text-brand-800 font-medium'
      ]"
    >
      <BookOpen class="w-5 h-5" :class="isActive('/panduan') ? 'text-brand-700' : ''" />
      <span class="text-[10px] tracking-tight">Panduan</span>
    </router-link>

    <button
      type="button"
      @click="$emit('open-profile')"
      class="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-slate-500 hover:text-brand-800 font-medium transition-all cursor-pointer"
    >
      <User class="w-5 h-5" />
      <span class="text-[10px] tracking-tight">Profil</span>
    </button>

  </nav>
</template>
