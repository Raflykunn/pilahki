<script setup>
import { Heart, Sparkles, MapPin, ExternalLink } from 'lucide-vue-next'
import { appConfig } from '@/config/app'
</script>

<template>
  <footer class="border-t border-zinc-200/80 bg-zinc-50/50 text-zinc-600 transition-all">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
        <!-- Brand Info -->
        <div class="md:col-span-2 space-y-4">
          <div class="flex items-center gap-2.5">
            <img :src="appConfig.logo" :alt="appConfig.name" class="h-9 w-auto object-contain" />
          </div>
          <p class="text-sm text-zinc-500 leading-relaxed max-w-sm">
            {{ appConfig.description }}
          </p>
          <div class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3 py-1 text-xs text-emerald-800 font-medium">
            <span class="flex h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
            <span>Mendukung Gerakan Makassar Bebas Sampah Liar</span>
          </div>
        </div>

        <!-- Fitur Navigasi -->
        <div class="space-y-3">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-900">Fitur Utama</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/pilah" class="hover:text-emerald-700 transition-colors">Pilah Sampah</router-link>
            </li>
            <li>
              <router-link to="/lokasi" class="hover:text-emerald-700 transition-colors">Cari Lokasi & TPS</router-link>
            </li>
            <li>
              <router-link to="/jadwal" class="hover:text-emerald-700 transition-colors">Jadwal Angkut</router-link>
            </li>
            <li>
              <router-link to="/panduan" class="hover:text-emerald-700 transition-colors">Panduan Praktis</router-link>
            </li>
          </ul>
        </div>

        <!-- Kategori Pemilahan -->
        <div class="space-y-3">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-900">Kategori Sampah</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/pilah?kategori=organik" class="flex items-center gap-1.5 hover:text-emerald-700 transition-colors">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Sampah Organik</span>
              </router-link>
            </li>
            <li>
              <router-link to="/pilah?kategori=anorganik" class="flex items-center gap-1.5 hover:text-emerald-700 transition-colors">
                <span class="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>Sampah Anorganik</span>
              </router-link>
            </li>
            <li>
              <router-link to="/pilah?kategori=b3" class="flex items-center gap-1.5 hover:text-emerald-700 transition-colors">
                <span class="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span>Sampah B3 Rumah Tangga</span>
              </router-link>
            </li>
            <li>
              <router-link to="/pilah?kategori=residu" class="flex items-center gap-1.5 hover:text-emerald-700 transition-colors">
                <span class="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                <span>Sampah Residu</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Bantuan Cerdas -->
        <div class="space-y-3">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-900">Asisten Cerdas</h4>
          <p class="text-xs text-zinc-500 leading-relaxed">
            Bingung barang Anda masuk ke mana? Tanyakan ke PilahAI dengan bahasa sehari-hari.
          </p>
          <router-link
            to="/pilah-ai"
            class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <Sparkles class="h-3.5 w-3.5" />
            <span>Mulai Chat PilahAI &rarr;</span>
          </router-link>
        </div>
      </div>

      <!-- Bottom Separator & Copyright -->
      <div class="mt-10 border-t border-zinc-200/60 pt-6 text-center text-xs text-zinc-400">
        <p>&copy; {{ new Date().getFullYear() }} {{ appConfig.name }} {{ appConfig.city }}. Dikembangkan oleh <span class="font-semibold text-zinc-700 tracking-wider">{{ appConfig.author }}</span>.</p>
      </div>
    </div>
  </footer>
</template>
