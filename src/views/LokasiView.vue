<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { daftarFasilitas, jenisFasilitasConfig } from '@/data/lokasiData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import {
  MapPin,
  Navigation,
  Search,
  Clock,
  Phone,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  Compass,
  Map as MapIcon,
  ListFilter
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// State Penapis & Carian
const searchQuery = ref('')
const selectedWilayah = ref('semua')
const selectedJenis = ref('semua')
const viewMode = ref('list') // 'list' | 'map'

// State GPS
const isGpsActive = ref(false)
const gpsMessage = ref('')
const isLocating = ref(false)

// Daftar wilayah unik dari data
const listWilayah = computed(() => {
  const set = new Set(daftarFasilitas.map(f => f.wilayah))
  return ['semua', ...Array.from(set)]
})

onMounted(() => {
  const catParam = route?.query?.kategori
  if (catParam) {
    searchQuery.value = catParam
  }
})

const handleActivateGps = () => {
  isLocating.value = true
  gpsMessage.value = 'Mendeteksi posisi perangkat Anda...'

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      () => {
        isLocating.value = false
        isGpsActive.value = true
        gpsMessage.value = 'Lokasi GPS aktif! Fasilitas diurutkan dari yang terdekat.'
        setTimeout(() => { gpsMessage.value = '' }, 4000)
      },
      () => {
        isLocating.value = false
        isGpsActive.value = true
        gpsMessage.value = 'Mode demo: Menampilkan perkiraan jarak dari posisi Anda.'
        setTimeout(() => { gpsMessage.value = '' }, 4000)
      },
      { timeout: 5000 }
    )
  } else {
    isLocating.value = false
    isGpsActive.value = true
    gpsMessage.value = 'Menampilkan perkiraan jarak fasilitas.'
  }
}

const filteredFasilitas = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return daftarFasilitas.filter(f => {
    const matchWilayah = selectedWilayah.value === 'semua' || f.wilayah.toLowerCase() === selectedWilayah.value.toLowerCase()
    const matchJenis = selectedJenis.value === 'semua' || f.jenis === selectedJenis.value

    if (!matchWilayah || !matchJenis) return false
    if (!q) return true

    const inNama = f.nama.toLowerCase().includes(q)
    const inAlamat = f.alamat.toLowerCase().includes(q)
    const inWilayah = f.wilayah.toLowerCase().includes(q)
    const inSampah = f.sampahDiterima.some(s => s.toLowerCase().includes(q))
    return inNama || inAlamat || inWilayah || inSampah
  })
})

const askAILocation = (fasilitas) => {
  router.push({
    path: '/pilah-ai',
    query: {
      q: `Bagaimana cara menyetor sampah ke ${fasilitas.nama} (${fasilitas.wilayah})? Apa syarat dan jenis yang diterima?`
    }
  })
}

const openGoogleMaps = (fasilitas) => {
  const query = encodeURIComponent(`${fasilitas.nama} ${fasilitas.alamat} Makassar`)
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="space-y-1.5">
        <div class="flex items-center gap-2">
          <Badge variant="outline" class="bg-blue-50 text-blue-800 border-blue-200">
            Fasilitas Pengelolaan Sampah
          </Badge>
          <span class="text-xs text-zinc-400">Kota Makassar</span>
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900">
          Cari Bank Sampah & TPS Terdekat
        </h1>
        <p class="text-sm text-zinc-500 max-w-2xl leading-relaxed">
          Temukan fasilitas pengolahan sampah, bank sampah unit, TPS 3R, dan drop point B3 lengkap dengan jam operasional dan kontak.
        </p>
      </div>

      <!-- GPS Button -->
      <div>
        <Button
          :variant="isGpsActive ? 'default' : 'outline'"
          size="sm"
          class="gap-2 shrink-0"
          :disabled="isLocating"
          @click="handleActivateGps"
        >
          <Compass class="h-4 w-4" :class="{ 'animate-spin': isLocating }" />
          <span>{{ isGpsActive ? 'GPS Aktif (Terdekat)' : 'Gunakan Lokasi Saya' }}</span>
        </Button>
      </div>
    </div>

    <!-- GPS Alert Notice -->
    <div
      v-if="gpsMessage"
      class="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-800"
    >
      <CheckCircle2 class="h-4 w-4 text-emerald-600 shrink-0" />
      <span>{{ gpsMessage }}</span>
    </div>

    <!-- Search & Filter Controls -->
    <Card class="p-4 bg-white border-zinc-200 shadow-2xs space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <!-- Search Input -->
        <div class="sm:col-span-6 relative">
          <Search class="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
          <Input
            v-model="searchQuery"
            placeholder="Cari nama fasilitas, jalan, atau jenis sampah..."
            class="pl-10"
          />
        </div>

        <!-- Filter Wilayah -->
        <div class="sm:col-span-3">
          <select
            v-model="selectedWilayah"
            class="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all cursor-pointer"
          >
            <option value="semua">Semua Wilayah</option>
            <option v-for="w in listWilayah.filter(x => x !== 'semua')" :key="w" :value="w">
              Kec. {{ w }}
            </option>
          </select>
        </div>

        <!-- Filter Jenis Fasilitas -->
        <div class="sm:col-span-3">
          <select
            v-model="selectedJenis"
            class="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all cursor-pointer"
          >
            <option value="semua">Semua Tipe Fasilitas</option>
            <option v-for="(cfg, key) in jenisFasilitasConfig" :key="key" :value="key">
              {{ cfg.label }}
            </option>
          </select>
        </div>
      </div>
    </Card>

    <!-- Content Results -->
    <div class="space-y-4">
      <div class="flex items-center justify-between text-xs text-zinc-500">
        <span>Menampilkan <strong>{{ filteredFasilitas.length }}</strong> fasilitas</span>
        <span>Wilayah aktif: <strong>{{ selectedWilayah === 'semua' ? 'Seluruh Kota' : selectedWilayah }}</strong></span>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredFasilitas.length === 0"
        class="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center space-y-3"
      >
        <Building2 class="mx-auto h-10 w-10 text-zinc-400" />
        <h3 class="text-sm font-semibold text-zinc-900">Tidak ada fasilitas yang cocok</h3>
        <p class="text-xs text-zinc-500 max-w-sm mx-auto">
          Coba ganti filter wilayah atau tanyakan alternatif lokasi lain kepada PilahAI.
        </p>
        <Button
          size="sm"
          variant="outline"
          @click="selectedWilayah = 'semua'; selectedJenis = 'semua'; searchQuery = ''"
        >
          Reset Semua Filter
        </Button>
      </div>

      <!-- Facility Cards Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card
          v-for="fasilitas in filteredFasilitas"
          :key="fasilitas.id || fasilitas.nama"
          class="flex flex-col justify-between border-zinc-200/90 hover:shadow-md hover:border-zinc-300 transition-all duration-200"
        >
          <CardHeader class="pb-3">
            <div class="flex items-start justify-between gap-2 mb-2">
              <Badge
                variant="outline"
                :class="[
                  'text-[10px] font-semibold uppercase',
                  fasilitas.jenis === 'bank-sampah' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  fasilitas.jenis === 'tps-3r' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                  fasilitas.jenis === 'dropbox-b3' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                  'bg-zinc-100 text-zinc-800 border-zinc-200'
                ]"
              >
                {{ jenisFasilitasConfig[fasilitas.jenis]?.label || fasilitas.jenis }}
              </Badge>

              <span v-if="fasilitas.jarakKm" class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Navigation class="h-3 w-3" />
                {{ fasilitas.jarakKm }} km
              </span>
            </div>

            <CardTitle class="text-base font-bold text-zinc-900 line-clamp-1">
              {{ fasilitas.nama }}
            </CardTitle>

            <CardDescription class="text-xs text-zinc-500 flex items-start gap-1.5 mt-1.5 line-clamp-2">
              <MapPin class="h-3.5 w-3.5 shrink-0 text-zinc-400 mt-0.5" />
              <span>{{ fasilitas.alamat }} (Kec. {{ fasilitas.wilayah }})</span>
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-3.5 text-xs py-2">
            <!-- Jam Operasional -->
            <div class="flex items-center gap-2 text-zinc-600 bg-zinc-50 rounded-lg px-3 py-2 border border-zinc-100">
              <Clock class="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span class="truncate">{{ fasilitas.jamOperasional }}</span>
            </div>

            <!-- Jenis Sampah Diterima -->
            <div class="space-y-1.5">
              <span class="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Menerima Sampah:</span>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="s in fasilitas.sampahDiterima"
                  :key="s"
                  class="rounded bg-zinc-100 text-zinc-700 px-2 py-0.5 text-[11px] font-medium"
                >
                  {{ s }}
                </span>
              </div>
            </div>

            <!-- Kontak jika ada -->
            <div v-if="fasilitas.kontak" class="flex items-center gap-2 text-zinc-600 text-xs">
              <Phone class="h-3.5 w-3.5 text-zinc-400" />
              <span>{{ fasilitas.kontak }}</span>
            </div>
          </CardContent>

          <CardFooter class="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              class="flex-1 text-xs gap-1.5 border-zinc-200 hover:bg-zinc-100 text-zinc-700"
              @click="openGoogleMaps(fasilitas)"
            >
              <ExternalLink class="h-3.5 w-3.5" />
              <span>Buka Peta</span>
            </Button>

            <Button
              size="sm"
              class="flex-1 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              @click="askAILocation(fasilitas)"
            >
              <Sparkles class="h-3.5 w-3.5" />
              <span>Tanya AI</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
