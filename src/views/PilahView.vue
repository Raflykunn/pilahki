<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { daftarSampah, kategoriConfig } from '@/data/sampahData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import {
  Search,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  X,
  History,
  Info,
  ChevronRight,
  Layers,
  Leaf,
  RefreshCw
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// State
const searchQuery = ref('')
const activeCategoryFilter = ref('semua')
const selectedItemDetail = ref(null)
const recentSearches = ref([])

const categories = [
  { id: 'semua', label: 'Semua Kategori' },
  { id: 'organik', label: 'Organik', variant: 'organik' },
  { id: 'anorganik', label: 'Anorganik', variant: 'anorganik' },
  { id: 'b3', label: 'B3 Rumah Tangga', variant: 'b3' },
  { id: 'residu', label: 'Residu', variant: 'residu' }
]

const quickChips = [
  'Baterai Bekas',
  'Botol Plastik',
  'Kulit Pisang',
  'Popok Bayi',
  'Styrofoam',
  'Lampu Neon',
  'Minyak Jelantah',
  'Kardus Kering'
]

onMounted(() => {
  try {
    const saved = localStorage.getItem('pilahki_recent_searches')
    if (saved) {
      recentSearches.value = JSON.parse(saved).slice(0, 5)
    }
  } catch {}

  const queryParam = route?.query?.q
  const catParam = route?.query?.kategori

  if (catParam && ['organik', 'anorganik', 'b3', 'residu'].includes(catParam)) {
    activeCategoryFilter.value = catParam
  }

  if (queryParam && typeof queryParam === 'string') {
    searchQuery.value = queryParam
    executeSearch(queryParam)
  } else {
    selectedItemDetail.value = daftarSampah[0]
  }
})

const saveRecentSearch = (term) => {
  const clean = term.trim()
  if (!clean) return
  const filtered = recentSearches.value.filter(s => s.toLowerCase() !== clean.toLowerCase())
  recentSearches.value = [clean, ...filtered].slice(0, 5)
  try {
    localStorage.setItem('pilahki_recent_searches', JSON.stringify(recentSearches.value))
  } catch {}
}

const executeSearch = (queryText = null) => {
  const text = (queryText !== null ? queryText : searchQuery.value).trim()
  if (!text) return

  searchQuery.value = text
  saveRecentSearch(text)

  const lower = text.toLowerCase()
  const match = daftarSampah.find(item => {
    return item.nama.toLowerCase().includes(lower) ||
      item.alias.some(a => a.toLowerCase().includes(lower))
  })

  if (match) {
    selectedItemDetail.value = match
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  if (daftarSampah.length > 0) {
    selectedItemDetail.value = daftarSampah[0]
  }
}

const filteredList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return daftarSampah.filter(item => {
    const matchesCategory = activeCategoryFilter.value === 'semua' || item.kategori === activeCategoryFilter.value
    if (!matchesCategory) return false

    if (!query) return true
    const inName = item.nama.toLowerCase().includes(query)
    const inAlias = item.alias.some(a => a.toLowerCase().includes(query))
    const inCategory = item.kategori.toLowerCase().includes(query)
    const inTips = item.tipsPraktis?.toLowerCase().includes(query)
    return inName || inAlias || inCategory || inTips
  })
})

const selectItem = (item) => {
  selectedItemDetail.value = item
}

const askAIAboutItem = (item) => {
  router.push({
    path: '/pilah-ai',
    query: {
      q: `Bagaimana cara penanganan dan ke mana saya harus menyalurkan sampah ${item.nama}?`
    }
  })
}

const goToLocationForCategory = (item) => {
  router.push({
    path: '/lokasi',
    query: {
      kategori: item.kategori
    }
  })
}

const getCategoryBadgeVariant = (kategori) => {
  switch (kategori) {
    case 'organik': return 'organik'
    case 'anorganik': return 'anorganik'
    case 'b3': return 'b3'
    case 'residu': return 'residu'
    default: return 'outline'
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
    <!-- Header Page -->
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <Badge variant="outline" class="bg-emerald-50 text-emerald-800 border-emerald-200">
          Katalog Pemilahan
        </Badge>
        <span class="text-xs text-zinc-400">Total {{ daftarSampah.length }} jenis sampah terdata</span>
      </div>
      <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900">
        Pilah Sampah & Cari Solusi
      </h1>
      <p class="text-sm text-zinc-500 max-w-2xl leading-relaxed">
        Ketik nama barang yang Anda pegang untuk mengetahui secara pasti kategorinya (Organik, Anorganik, B3, Residu) dan langkah penanganan yang benar.
      </p>
    </div>

    <!-- Search Bar & Filters -->
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
          <Input
            v-model="searchQuery"
            placeholder="Ketik nama sampah, contoh: 'Kardus', 'Bohlam', 'Sisa sayur'..."
            class="pl-10 pr-10 h-11 text-sm bg-white"
            @keyup.enter="executeSearch()"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 cursor-pointer"
            @click="clearSearch"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <Button
          class="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2"
          @click="executeSearch()"
        >
          <Search class="h-4 w-4" />
          <span>Cari</span>
        </Button>
      </div>

      <!-- Quick Chips -->
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <span class="text-zinc-400 font-medium">Cepat:</span>
        <button
          v-for="chip in quickChips"
          :key="chip"
          type="button"
          class="rounded-full bg-white border border-zinc-200 px-3 py-1 text-zinc-600 hover:border-emerald-300 hover:text-emerald-700 transition-colors cursor-pointer"
          @click="executeSearch(chip)"
        >
          {{ chip }}
        </button>
      </div>

      <!-- Category Filter Tabs -->
      <div class="flex items-center gap-1 overflow-x-auto pb-1 border-b border-zinc-200 scrollbar-none">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          :class="[
            'px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer',
            activeCategoryFilter === cat.id
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
          ]"
          @click="activeCategoryFilter = cat.id"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- Main Content Layout: List & Detail Preview -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: List of items -->
      <div class="lg:col-span-7 space-y-3">
        <div class="flex items-center justify-between text-xs text-zinc-500 mb-1">
          <span>Menampilkan <strong>{{ filteredList.length }}</strong> hasil</span>
          <span v-if="activeCategoryFilter !== 'semua'">Kategori: <strong>{{ activeCategoryFilter.toUpperCase() }}</strong></span>
        </div>

        <div v-if="filteredList.length === 0" class="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center space-y-3">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
            <HelpCircle class="h-6 w-6" />
          </div>
          <h3 class="text-sm font-semibold text-zinc-900">Sampah tidak ditemukan di daftar cepat</h3>
          <p class="text-xs text-zinc-500 max-w-sm mx-auto">
            Jangan khawatir! Tanyakan langsung ke PilahAI, sistem AI kami yang terlatih untuk mengidentifikasi ratusan jenis sampah.
          </p>
          <Button
            size="sm"
            class="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            @click="router.push({ path: '/pilah-ai', query: { q: searchQuery } })"
          >
            <Sparkles class="h-4 w-4" />
            <span>Tanyakan "{{ searchQuery }}" ke PilahAI</span>
          </Button>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="item in filteredList"
            :key="item.id || item.nama"
            :class="[
              'rounded-xl border p-4 bg-white transition-all cursor-pointer select-none space-y-2.5',
              selectedItemDetail?.nama === item.nama
                ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                : 'border-zinc-200/80 hover:border-zinc-300 hover:shadow-2xs'
            ]"
            @click="selectItem(item)"
          >
            <div class="flex items-start justify-between gap-2">
              <h4 class="text-sm font-bold text-zinc-900 group-hover:text-emerald-700">
                {{ item.nama }}
              </h4>
              <Badge :variant="getCategoryBadgeVariant(item.kategori)" class="shrink-0 text-[10px] uppercase">
                {{ kategoriConfig[item.kategori]?.label || item.kategori }}
              </Badge>
            </div>

            <p class="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
              {{ item.penanganan }}
            </p>

            <div class="flex items-center justify-between pt-1 border-t border-zinc-100 text-[11px] text-zinc-400">
              <span class="truncate max-w-[150px]">Penyaluran: {{ item.tujuanPenyaluran }}</span>
              <ChevronRight class="h-3.5 w-3.5 text-zinc-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Sticky Detail Card -->
      <div class="lg:col-span-5 sticky top-24">
        <Card v-if="selectedItemDetail" class="border-zinc-200 shadow-sm overflow-hidden">
          <!-- Card Header with Category Accent -->
          <div
            :class="[
              'p-6 border-b',
              selectedItemDetail.kategori === 'organik' ? 'bg-emerald-50/70 border-emerald-100' :
              selectedItemDetail.kategori === 'anorganik' ? 'bg-blue-50/70 border-blue-100' :
              selectedItemDetail.kategori === 'b3' ? 'bg-amber-50/70 border-amber-100' :
              'bg-zinc-100/70 border-zinc-200'
            ]"
          >
            <div class="flex items-center justify-between gap-2 mb-2">
              <Badge :variant="getCategoryBadgeVariant(selectedItemDetail.kategori)" class="text-xs uppercase font-bold">
                {{ kategoriConfig[selectedItemDetail.kategori]?.label || selectedItemDetail.kategori }}
              </Badge>
              <span class="text-[11px] text-zinc-500 font-medium">Detail Pemilahan</span>
            </div>

            <h2 class="text-2xl font-black tracking-tight text-zinc-900">
              {{ selectedItemDetail.nama }}
            </h2>

            <div v-if="selectedItemDetail.alias?.length" class="mt-2 flex flex-wrap gap-1">
              <span class="text-[11px] text-zinc-500 font-medium">Nama lain:</span>
              <span
                v-for="al in selectedItemDetail.alias"
                :key="al"
                class="text-[11px] bg-white/80 rounded px-1.5 py-0.2 text-zinc-600 border border-zinc-200/50"
              >
                {{ al }}
              </span>
            </div>
          </div>

          <!-- Card Content Body -->
          <CardContent class="p-6 space-y-5 text-sm">
            <!-- Langkah Penanganan -->
            <div class="space-y-1.5">
              <div class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-700">
                <CheckCircle2 class="h-4 w-4 text-emerald-600" />
                <span>Cara Penanganan yang Benar</span>
              </div>
              <p class="text-xs sm:text-sm text-zinc-700 leading-relaxed bg-zinc-50 rounded-lg p-3 border border-zinc-200/60">
                {{ selectedItemDetail.penanganan }}
              </p>
            </div>

            <!-- Tujuan Penyaluran -->
            <div class="space-y-1.5">
              <div class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-700">
                <MapPin class="h-4 w-4 text-blue-600" />
                <span>Tujuan Penyaluran di Makassar</span>
              </div>
              <p class="text-xs sm:text-sm text-zinc-700 leading-relaxed font-medium">
                {{ selectedItemDetail.tujuanPenyaluran }}
              </p>
            </div>

            <!-- Tips Praktis -->
            <div v-if="selectedItemDetail.tipsPraktis" class="space-y-1.5">
              <div class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-700">
                <Info class="h-4 w-4 text-amber-600" />
                <span>Tips Praktis Rumah Tangga</span>
              </div>
              <p class="text-xs text-zinc-600 leading-relaxed italic bg-amber-50/50 border border-amber-200/60 rounded-lg p-3">
                "{{ selectedItemDetail.tipsPraktis }}"
              </p>
            </div>
          </CardContent>

          <!-- Card Footer Actions -->
          <CardFooter class="p-6 pt-0 flex flex-col gap-2.5">
            <Button
              class="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold"
              @click="askAIAboutItem(selectedItemDetail)"
            >
              <Sparkles class="h-4 w-4" />
              <span>Tanyakan Penyaluran ke PilahAI</span>
            </Button>

            <Button
              variant="outline"
              class="w-full text-zinc-700 hover:bg-zinc-100 gap-2 font-medium"
              @click="goToLocationForCategory(selectedItemDetail)"
            >
              <MapPin class="h-4 w-4" />
              <span>Cari Lokasi Penerima Terdekat</span>
            </Button>
          </CardFooter>
        </Card>

        <div v-else class="rounded-xl border border-zinc-200 bg-white p-8 text-center text-zinc-400 text-xs">
          Pilih salah satu item sampah di sebelah kiri untuk melihat detail penanganan lengkap.
        </div>
      </div>
    </div>
  </div>
</template>
