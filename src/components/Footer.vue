<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { Leaf } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth()

const scrollToSection = (id) => {
  if (route.path !== '/') {
    router.push({ path: '/', hash: `#${id}` })
    return
  }
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const getFeatureTo = (targetPath) => {
  return isAuthenticated.value
    ? targetPath
    : { path: '/login', query: { redirect: targetPath } }
}
</script>

<template>
  <footer class="bg-[#0b1c13] text-slate-400 text-sm py-14 border-t border-brand-900 text-left">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        <!-- Col 1: Brand Info -->
        <div class="space-y-4 md:col-span-1">
          <router-link to="/" class="inline-flex items-center p-2 bg-white rounded-xl shadow-xs">
            <img src="/img/logo-tulisan.jpeg" alt="Logo PilahKi'" class="h-10 w-auto object-contain" />
          </router-link>
          <p class="text-xs text-slate-400 leading-relaxed">
            Mulai dari Pilahan, Ciptakan Perubahan. Platform web terpadu edukasi dan pengelolaan sampah rumah tangga berkelanjutan untuk Indonesia yang lebih bersih.
          </p>
        </div>

        <!-- Col 2: Navigasi (Sesuai Nav) -->
        <div>
          <h4 class="text-white font-bold mb-4 text-xs uppercase tracking-wider">Navigasi</h4>
          <ul class="space-y-2 text-xs">
            <li><button type="button" @click="scrollToSection('tentang')" class="hover:text-white transition-colors cursor-pointer">Tentang</button></li>
            <li><button type="button" @click="scrollToSection('masalah')" class="hover:text-white transition-colors cursor-pointer">Tantangan</button></li>
            <li><button type="button" @click="scrollToSection('fitur')" class="hover:text-white transition-colors cursor-pointer">Fitur</button></li>
            <li><button type="button" @click="scrollToSection('sdg')" class="hover:text-white transition-colors cursor-pointer">Dampak</button></li>
            <li><button type="button" @click="scrollToSection('faq')" class="hover:text-white transition-colors cursor-pointer">FAQ</button></li>
          </ul>
        </div>

        <!-- Col 3: Fitur Unggulan -->
        <div>
          <h4 class="text-white font-bold mb-4 text-xs uppercase tracking-wider">Fitur Unggulan</h4>
          <ul class="space-y-2 text-xs">
            <li><router-link :to="getFeatureTo('/pilah')" class="hover:text-white transition-colors">Pilah Sampah</router-link></li>
            <li><router-link :to="getFeatureTo('/lokasi')" class="hover:text-white transition-colors">Cari Lokasi Fasilitas</router-link></li>
            <li><router-link :to="getFeatureTo('/jadwal')" class="hover:text-white transition-colors">Jadwal Angkut Terpadu</router-link></li>
            <li><router-link :to="getFeatureTo('/panduan')" class="hover:text-white transition-colors">Panduan Edukasi Warga</router-link></li>
            <li><router-link :to="getFeatureTo('/pilah-ai')" class="hover:text-white transition-colors">PilahAI Asisten Cerdas</router-link></li>
          </ul>
        </div>

        <!-- Col 4: Akses Pengguna -->
        <div>
          <h4 class="text-white font-bold mb-4 text-xs uppercase tracking-wider">Akses Pengguna</h4>
          <ul class="space-y-2 text-xs">
            <li><router-link to="/login" class="hover:text-white transition-colors">Masuk</router-link></li>
            <li><router-link to="/register" class="hover:text-white transition-colors">Daftar</router-link></li>
          </ul>
          <p class="text-xs text-slate-400 leading-relaxed mt-4">
            Bersama mewujudkan lingkungan bersih, sehat, dan minim sampah untuk masa depan.
          </p>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>&copy; 2026 Binfinity. Hak Cipta Dilindungi Undang-Undang.</p>
        <p class="flex items-center gap-1.5">
          <span>Dibuat dengan semangat keberlanjutan</span>
          <Leaf class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        </p>
      </div>

    </div>
  </footer>
</template>
