<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { wilayahList, jadwalMaster } from '@/data/jadwalData'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import {
  Calendar,
  Clock,
  MapPin,
  Truck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Bell,
  Check,
  ChevronRight,
  Info
} from 'lucide-vue-next'

const router = useRouter()

// State
const selectedWilayahId = ref(wilayahList[0]?.id || '')
const isSavedNoticeVisible = ref(false)
const activeCategoryFilter = ref('semua')

const hariNamaList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const todayDayIndex = new Date().getDay()
const todayName = hariNamaList[todayDayIndex]

onMounted(() => {
  const saved = localStorage.getItem('pilahki_wilayah_id')
  if (saved && wilayahList.some(w => w.id === saved)) {
    selectedWilayahId.value = saved
  }
})

const currentWilayah = computed(() => {
  return wilayahList.find(w => w.id === selectedWilayahId.value) || wilayahList[0]
})

const handleWilayahChange = () => {
  localStorage.setItem('pilahki_wilayah_id', selectedWilayahId.value)
  isSavedNoticeVisible.value = true
  setTimeout(() => {
    isSavedNoticeVisible.value = false
  }, 2500)
}

const allJadwalForWilayah = computed(() => {
  return jadwalMaster[selectedWilayahId.value] || []
})

const filteredJadwal = computed(() => {
  const list = allJadwalForWilayah.value
  if (activeCategoryFilter.value === 'semua') return list
  return list.filter(item => item.kategori === activeCategoryFilter.value)
})

// Jadwal Pengangkutan Terdekat
const nextUpcomingPickup = computed(() => {
  const list = allJadwalForWilayah.value
  if (!list.length) return null

  // Cari yang hari ini atau hari-hari terdekat
  const todayMatch = list.find(item => item.hari.toLowerCase() === todayName.toLowerCase())
  if (todayMatch) {
    return { ...todayMatch, status: 'Hari Ini' }
  }

  // Ambil item pertama dari daftar sebagai jadwal terdekat berikutnya
  return { ...list[0], status: 'Jadwal Rutin' }
})

const getKategoriBadgeVariant = (kategori) => {
  switch (kategori) {
    case 'organik': return 'organik'
    case 'anorganik': return 'anorganik'
    case 'b3': return 'b3'
    case 'residu': return 'residu'
    default: return 'outline'
  }
}

const askAIJadwal = () => {
  router.push({
    path: '/pilah-ai',
    query: {
      q: `Kapan jadwal pengangkutan sampah di wilayah ${currentWilayah.value?.nama}? Bagaimana aturan meletakkan sampahnya?`
    }
  })
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="space-y-1.5">
        <div class="flex items-center gap-2">
          <Badge variant="outline" class="bg-amber-50 text-amber-800 border-amber-200">
            Jadwal Operasional
          </Badge>
          <span class="text-xs text-zinc-400">Kota Makassar &bull; Hari ini: {{ todayName }}</span>
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900">
          Jadwal Angkut Sampah Wilayah
        </h1>
        <p class="text-sm text-zinc-500 max-w-2xl leading-relaxed">
          Ketahui hari dan jam pengangkutan sampah berdasarkan jenisnya di tempat tinggal Anda agar sampah tidak menumpuk liar.
        </p>
      </div>

      <!-- AI Prompt Button -->
      <Button
        variant="outline"
        size="sm"
        class="gap-2 border-zinc-200 text-zinc-700 hover:bg-zinc-100 self-start sm:self-auto"
        @click="askAIJadwal"
      >
        <Sparkles class="h-4 w-4 text-emerald-600" />
        <span>Tanya AI Jadwal Wilayah</span>
      </Button>
    </div>

    <!-- Wilayah Selection Card -->
    <Card class="p-6 bg-white border-zinc-200 shadow-2xs">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <label for="wilayah-select" class="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Pilih Wilayah Tempat Tinggal Anda
          </label>
          <div class="flex items-center gap-3">
            <select
              id="wilayah-select"
              v-model="selectedWilayahId"
              class="h-11 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 cursor-pointer min-w-[240px]"
              @change="handleWilayahChange"
            >
              <option v-for="w in wilayahList" :key="w.id" :value="w.id">
                Kecamatan {{ w.nama }}
              </option>
            </select>

            <span
              v-if="isSavedNoticeVisible"
              class="flex items-center gap-1 text-xs text-emerald-700 font-medium animate-in fade-in"
            >
              <Check class="h-4 w-4" />
              <span>Tersimpan untuk kunjungan berikutnya</span>
            </span>
          </div>
        </div>

        <div class="text-xs text-zinc-500 max-w-sm">
          <p>Wilayah terpilih: <strong class="text-zinc-800">{{ currentWilayah?.nama }}</strong></p>
          <p class="mt-0.5 text-zinc-400 leading-relaxed">{{ currentWilayah?.keterangan || 'Jadwal berlaku untuk seluruh kelurahan dalam kecamatan ini.' }}</p>
        </div>
      </div>
    </Card>

    <!-- Highlight Next Upcoming Pickup -->
    <div
      v-if="nextUpcomingPickup"
      class="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
          <Truck class="h-6 w-6" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <Badge variant="organik" class="text-[10px] uppercase font-bold">
              {{ nextUpcomingPickup.status }}
            </Badge>
            <span class="text-xs font-semibold text-zinc-500">{{ nextUpcomingPickup.hari }} &bull; {{ nextUpcomingPickup.jam }}</span>
          </div>
          <h3 class="text-lg font-bold text-zinc-900 mt-0.5">
            Pengangkutan Sampah {{ nextUpcomingPickup.kategori.toUpperCase() }}
          </h3>
          <p class="text-xs text-zinc-600 mt-0.5">
            {{ nextUpcomingPickup.catatan || 'Harap siapkan sampah sebelum jam pengangkutan dimulai.' }}
          </p>
        </div>
      </div>

      <div class="text-xs bg-white rounded-lg px-3 py-2 border border-emerald-200 text-emerald-800 font-medium shrink-0">
        Armada: {{ nextUpcomingPickup.armada || 'Truk Kebersihan DLH Makassar' }}
      </div>
    </div>

    <!-- Category Filter Tabs -->
    <div class="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto scrollbar-none">
      <button
        v-for="cat in [
          { id: 'semua', label: 'Semua Kategori' },
          { id: 'organik', label: 'Organik Saja' },
          { id: 'anorganik', label: 'Anorganik Saja' },
          { id: 'residu', label: 'Residu Saja' }
        ]"
        :key="cat.id"
        type="button"
        :class="[
          'px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap',
          activeCategoryFilter === cat.id
            ? 'bg-zinc-900 text-white shadow-xs'
            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
        ]"
        @click="activeCategoryFilter = cat.id"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Schedule Cards Grid -->
    <div class="space-y-4">
      <div v-if="filteredJadwal.length === 0" class="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center text-xs text-zinc-500">
        Tidak ada jadwal pengangkutan untuk filter kategori ini di {{ currentWilayah?.nama }}.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card
          v-for="j in filteredJadwal"
          :key="j.id || (j.hari + j.kategori)"
          class="flex flex-col justify-between border-zinc-200/90 hover:shadow-md transition-all duration-200"
        >
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-base font-extrabold text-zinc-900 flex items-center gap-1.5">
                <Calendar class="h-4 w-4 text-emerald-600" />
                <span>{{ j.hari }}</span>
              </span>
              <Badge :variant="getKategoriBadgeVariant(j.kategori)" class="text-[10px] uppercase font-bold">
                {{ j.kategori }}
              </Badge>
            </div>

            <div class="flex items-center gap-1.5 text-xs font-semibold text-zinc-600">
              <Clock class="h-3.5 w-3.5 text-zinc-400" />
              <span>{{ j.jam }}</span>
            </div>
          </CardHeader>

          <CardContent class="space-y-3 text-xs py-2">
            <div class="bg-zinc-50 rounded-lg p-3 border border-zinc-100 space-y-1">
              <p class="font-semibold text-zinc-700">Jenis Sampah yang Diterima:</p>
              <p class="text-zinc-600 text-[11px] leading-relaxed">
                {{ j.deskripsi || `Sampah ${j.kategori} yang telah dipilah rapi dalam kantong/wadah.` }}
              </p>
            </div>

            <div class="space-y-1">
              <span class="text-[11px] text-zinc-400 font-medium">Petugas / Armada:</span>
              <p class="text-xs text-zinc-700 font-medium flex items-center gap-1.5">
                <Truck class="h-3.5 w-3.5 text-zinc-400" />
                <span>{{ j.armada || 'Tim Pengangkut DLH Kota Makassar' }}</span>
              </p>
            </div>

            <div v-if="j.catatan" class="flex items-start gap-1.5 text-[11px] text-zinc-500 pt-1">
              <Info class="h-3.5 w-3.5 shrink-0 text-amber-500 mt-0.5" />
              <span>{{ j.catatan }}</span>
            </div>
          </CardContent>

          <CardFooter class="pt-3 border-t border-zinc-100">
            <Button
              variant="outline"
              size="sm"
              class="w-full text-xs gap-1.5 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
              @click="askAIJadwal"
            >
              <Sparkles class="h-3.5 w-3.5 text-emerald-600" />
              <span>Tanya Detail Pengangkutan</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
