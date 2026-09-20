<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { wasteData, CATEGORY_THEMES } from '@/data/sampahData'
import WasteDetailModal from '@/components/WasteDetailModal.vue'
import {
  Search,
  SearchX,
  ArrowRight,
  Leaf,
  Recycle,
  AlertTriangle,
  Trash2,
  Tag
} from 'lucide-vue-next'

const route = useRoute()

const searchQuery = ref('')
const selectedCategory = ref('semua')
const selectedWaste = ref(null)
const isModalOpen = ref(false)

const emit = defineEmits(['ask-ai'])

const categories = [
  { id: 'semua', label: 'Semua' },
  { id: 'organik', label: 'Organik' },
  { id: 'anorganik', label: 'Anorganik' },
  { id: 'b3', label: 'B3' },
  { id: 'residu', label: 'Residu' }
]

onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q
  }
  if (route.query.kategori) {
    selectedCategory.value = route.query.kategori.toLowerCase()
  }
})

const filteredWaste = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const cat = selectedCategory.value

  return wasteData.filter((item) => {
    const matchCat = cat === 'semua' || item.category === cat
    if (!matchCat) return false

    if (!q) return true

    const matchName = item.name.toLowerCase().includes(q)
    const matchDesc = item.shortDesc?.toLowerCase().includes(q)
    const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q))
    const matchCategory = item.categoryName?.toLowerCase().includes(q)

    return matchName || matchDesc || matchKeywords || matchCategory
  })
})

const getCategoryIcon = (category) => {
  switch (category) {
    case 'organik':
      return Leaf
    case 'anorganik':
      return Recycle
    case 'b3':
      return AlertTriangle
    case 'residu':
      return Trash2
    default:
      return Recycle
  }
}

const openDetail = (item) => {
  selectedWaste.value = item
  isModalOpen.value = true
}

const handleModalAskAi = (prompt) => {
  isModalOpen.value = false
  emit('ask-ai', prompt)
}
</script>

<template>
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
    <div class="space-y-6">

      <div class="space-y-4">
        <div class="space-y-1">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Katalog & Panduan Pemilahan Sampah</h1>
          <p class="text-sm text-slate-600">
            Cari jenis sampah yang Anda miliki untuk mengetahui kategori, nilai daur ulang, dan langkah penanganan tepat di rumah.
          </p>
        </div>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">

          <div class="relative flex-1 max-w-md">
            <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Cari jenis sampah (cth: botol, baterai, sayur)..." 
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 bg-white"
            />
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              @click="selectedCategory = cat.id"
              :class="[
                'px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer',
                selectedCategory === cat.id
                  ? 'bg-brand-800 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-700 font-semibold border border-slate-200 hover:border-brand-300 hover:text-brand-800'
              ]"
            >
              {{ cat.label }}
            </button>
          </div>

        </div>

        <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span class="font-bold text-slate-700">
            {{ filteredWaste.length }} Jenis Sampah
          </span>
          <span class="hidden sm:inline">Klik kartu sampah untuk melihat langkah detail penanganan</span>
        </div>
      </div>

      <div v-if="filteredWaste.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in filteredWaste"
          :key="item.id"
          @click="openDetail(item)"
          class="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-card-hover transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-4 hover:border-brand-300"
        >
          <div class="space-y-3">
            
            <div class="flex items-center justify-between">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border',
                  item.badgeColor
                ]"
              >
                {{ item.categoryName }}
              </span>

              <div
                :class="[
                  'w-8 h-8 rounded-xl flex items-center justify-center',
                  CATEGORY_THEMES[item.category]?.iconBox || 'bg-slate-100 text-slate-700'
                ]"
              >
                <component :is="getCategoryIcon(item.category)" class="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-800 transition-colors leading-snug">
                {{ item.name }}
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {{ item.shortDesc }}
              </p>
            </div>

            <div class="pt-2 flex items-center gap-1.5 text-xs text-slate-500">
              <Tag class="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span class="truncate font-medium text-[11px] sm:text-xs">{{ item.recyclableValue }}</span>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-700 group-hover:text-brand-800">
            <span>Lihat Solusi Lengkap</span>
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      <div v-else class="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <SearchX class="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <p class="text-sm font-bold text-slate-800">Sampah tidak ditemukan</p>
        <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Coba periksa ejaan kata kunci Anda atau pilih filter kategori "Semua". Anda juga bisa menanyakannya langsung ke asisten PilahAI.
        </p>
      </div>

    </div>

    <WasteDetailModal
      :is-open="isModalOpen"
      :waste="selectedWaste"
      @close="isModalOpen = false"
      @ask-ai="handleModalAskAi"
    />
  </main>
</template>
