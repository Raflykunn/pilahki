<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import AuthModal from '@/components/AuthModal.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import {
  Search,
  Sparkles,
  ArrowRight,
  Recycle,
  MapPin,
  Calendar,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Apple,
  Box,
  Layers,
  HelpCircle,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-vue-next'

const router = useRouter()
const { isAuthenticated } = useAuth()

const searchQuery = ref('')
const isAuthModalOpen = ref(false)
const modalTitle = ref('Masuk ke Pilahki')
const modalSubtitle = ref('Masuk untuk mengakses fitur lengkap pemilahan, fasilitas, dan jadwal angkut.')
const pendingAction = ref(null)

// Contoh sampah rumah tangga umum
const quickExamples = [
  'Baterai Bekas',
  'Botol Minyak',
  'Kemasan Sachet',
  'Kulit Buah',
  'Lampu Neon'
]

// 4 Fitur utama sesuai PRD Seksyen 7
const features = [
  {
    id: 'pilah',
    title: 'Pilah Sampah',
    badge: 'Kategori & Solusi',
    desc: 'Cek apakah sampah masuk organik, anorganik, B3, atau residu serta cara penanganannya.',
    path: '/pilah',
    actionText: 'Cek Kategori',
    icon: Search,
    color: 'emerald'
  },
  {
    id: 'lokasi',
    title: 'Cari Lokasi',
    badge: 'Bank Sampah & TPS',
    desc: 'Temukan fasilitas penerima sampah terdekat di Makassar, jam operasional, dan jenis yang diterima.',
    path: '/lokasi',
    actionText: 'Cari Fasilitas',
    icon: MapPin,
    color: 'blue'
  },
  {
    id: 'jadwal',
    title: 'Jadwal Angkut',
    badge: 'Waktu Pengutipan',
    desc: 'Ketahui hari pengangkutan sampah di wilayah Anda agar tidak terlewat dan menumpuk.',
    path: '/jadwal',
    actionText: 'Lihat Jadwal',
    icon: Calendar,
    color: 'amber'
  },
  {
    id: 'panduan',
    title: 'Panduan Praktis',
    badge: 'Edukasi Warga',
    desc: 'Tips ringkas memilah sampah rumah tangga dengan bahasa sederhana tanpa istilah teknis.',
    path: '/panduan',
    actionText: 'Baca Panduan',
    icon: BookOpen,
    color: 'purple'
  }
]

// 4 Kategori Sampah
const categories = [
  {
    id: 'organik',
    name: 'Organik',
    desc: 'Bahan alami yang mudah terurai hayati seperti sisa makanan, daun, dan sayuran.',
    examples: ['Sisa Sayuran', 'Kulit Buah', 'Dedaunan', 'Nasi Sisa'],
    solution: 'Dibuat kompos atau pakan maggot',
    badgeVariant: 'organik',
    icon: Apple,
    borderColor: 'border-emerald-200 hover:border-emerald-400',
    bgBadge: 'bg-emerald-50 text-emerald-800'
  },
  {
    id: 'anorganik',
    name: 'Anorganik',
    desc: 'Barang tidak mudah terurai namun bernilai ekonomi jika didaur ulang dengan bersih.',
    examples: ['Botol Plastik PET', 'Kardus & Kertas', 'Kaleng Minuman', 'Kaca'],
    solution: 'Cuci bersih, keringkan, lalu setor ke Bank Sampah',
    badgeVariant: 'anorganik',
    icon: Box,
    borderColor: 'border-blue-200 hover:border-blue-400',
    bgBadge: 'bg-blue-50 text-blue-800'
  },
  {
    id: 'b3',
    name: 'B3 Rumah Tangga',
    desc: 'Bahan Berbahaya dan Beracun yang memerlukan penanganan khusus demi keamanan lingkungan.',
    examples: ['Baterai Bekas', 'Lampu Neon / LED', 'Kaleng Obat Serangga', 'Obat Kedaluwarsa'],
    solution: 'Pisahkan dalam wadah tertutup aman, bawa ke drop point B3',
    badgeVariant: 'b3',
    icon: AlertTriangle,
    borderColor: 'border-amber-200 hover:border-amber-400',
    bgBadge: 'bg-amber-50 text-amber-800'
  },
  {
    id: 'residu',
    name: 'Residu',
    desc: 'Sampah yang sulit atau tidak dapat didaur ulang dan harus berakhir di TPA terkontrol.',
    examples: ['Kemasan Sachet Foil', 'Popok Sekali Pakai', 'Puntung Rokok', 'Tisu Kotor'],
    solution: 'Kemas rapat dan buang ke tempat penampungan TPS resmi',
    badgeVariant: 'residu',
    icon: Layers,
    borderColor: 'border-zinc-200 hover:border-zinc-400',
    bgBadge: 'bg-zinc-100 text-zinc-800'
  }
]

// Sample PilahAI Questions
const aiPrompts = [
  'Baterai jam dinding bekas harus dibuang ke mana?',
  'Kemasan kopi sachet masuk kategori apa?',
  'Kapan jadwal pengangkutan sampah di Rappocini?',
  'Di mana bank sampah terdekat dari Tamalanrea?'
]

const executeWithAuth = (actionCallback, featureTitle = 'Fitur Pilahki') => {
  if (!isAuthenticated.value) {
    modalTitle.value = `Masuk untuk akses ${featureTitle}`
    modalSubtitle.value = 'Silakan masuk atau daftar menggunakan email dan kata sandi Anda untuk melanjutkan.'
    pendingAction.value = actionCallback
    isAuthModalOpen.value = true
    return
  }
  actionCallback()
}

const handleSearch = (overrideQuery = null) => {
  if (overrideQuery !== null) {
    searchQuery.value = overrideQuery
  }
  const query = searchQuery.value.trim()
  if (!query) return

  executeWithAuth(() => {
    router.push({ path: '/pilah', query: { q: query } })
  }, `Pilah Sampah "${query}"`)
}

const handleFeatureClick = (feature) => {
  executeWithAuth(() => {
    router.push(feature.path)
  }, feature.title)
}

const handleOpenAIWithPrompt = (promptText = '') => {
  executeWithAuth(() => {
    router.push({ path: '/pilah-ai', query: promptText ? { q: promptText } : {} })
  }, 'PilahAI')
}

const handleAuthSuccess = () => {
  if (pendingAction.value) {
    const action = pendingAction.value
    pendingAction.value = null
    action()
  }
}
</script>

<template>
  <div class="space-y-16 sm:space-y-24 pb-20">
    <!-- 1. Hero Section -->
    <section class="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-b from-emerald-50/40 via-white to-white border-b border-zinc-100">
      <div class="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <!-- Pill Badge -->
        <div class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-2xs mb-6">
          <Sparkles class="h-3.5 w-3.5 text-emerald-600" />
          <span>Inisiatif Bersih Kota Makassar &bull; Terintegrasi PilahAI</span>
        </div>

        <!-- Headline -->
        <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl max-w-3xl mx-auto leading-tight sm:leading-none">
          Pilah Sampah Jadi Gampang, Warga Makassar Nyaman.
        </h1>

        <p class="mt-5 text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          Hilangkan keraguan memilah sampah rumah tangga. Cek kategori secara instan, temukan bank sampah terdekat, pantau jadwal angkut, atau tanyakan langsung pada AI.
        </p>

        <!-- Search Bar Input -->
        <div class="mt-8 max-w-2xl mx-auto">
          <form @submit.prevent="handleSearch()" class="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-white border border-zinc-200 shadow-lg shadow-zinc-200/50 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <div class="relative flex-1 w-full">
              <Search class="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Punya sampah apa? Ketik cth: 'Baterai bekas', 'Botol minyak'..."
                class="w-full h-11 pl-10 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 bg-transparent border-none outline-none focus:ring-0"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              class="w-full sm:w-auto h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs font-semibold gap-2"
            >
              <Search class="h-4 w-4" />
              <span>Cari Solusi</span>
            </Button>
          </form>

          <!-- Quick Examples -->
          <div class="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span class="text-zinc-400 font-medium">Contoh cepat:</span>
            <button
              v-for="example in quickExamples"
              :key="example"
              type="button"
              class="rounded-full bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-zinc-200/60 px-2.5 py-1 text-zinc-600 transition-colors cursor-pointer"
              @click="handleSearch(example)"
            >
              {{ example }}
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            class="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            @click="handleFeatureClick(features[0])"
          >
            <span>Buka Katalog Sampah</span>
            <ArrowRight class="h-4 w-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            class="border-zinc-300 hover:bg-zinc-100 text-zinc-700 gap-2"
            @click="handleOpenAIWithPrompt('')"
          >
            <Sparkles class="h-4 w-4 text-emerald-600" />
            <span>Konsultasi PilahAI</span>
          </Button>
        </div>
      </div>
    </section>

    <!-- 2. Empat Fitur Utama (PRD Seksyen 7) -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-10">
        <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
          Solusi Terintegrasi Tanpa Ribet
        </h2>
        <p class="mt-2 text-sm text-zinc-500">
          Dirancang khusus untuk warga kota agar alur dari pegang sampah sampai tempat yang tepat tidak putus di tengah jalan.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          v-for="feat in features"
          :key="feat.id"
          class="flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-zinc-200/80 group"
        >
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between mb-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                <component :is="feat.icon" class="h-5 w-5" />
              </div>
              <Badge variant="outline" class="text-[11px] font-medium bg-zinc-50">
                {{ feat.badge }}
              </Badge>
            </div>
            <CardTitle class="text-lg font-bold group-hover:text-emerald-700 transition-colors">
              {{ feat.title }}
            </CardTitle>
            <CardDescription class="mt-1 text-xs sm:text-sm text-zinc-500 line-clamp-3">
              {{ feat.desc }}
            </CardDescription>
          </CardHeader>
          <CardFooter class="pt-2">
            <Button
              variant="outline"
              size="sm"
              class="w-full justify-between group-hover:border-emerald-600 group-hover:text-emerald-700"
              @click="handleFeatureClick(feat)"
            >
              <span>{{ feat.actionText }}</span>
              <ChevronRight class="h-3.5 w-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>

    <!-- 3. Spotlight PilahAI (Chatbot Cerdas) -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="relative rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-900 via-teal-900 to-zinc-950 p-8 sm:p-12 text-white shadow-xl overflow-hidden">
        <!-- Background accents -->
        <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div class="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />

        <div class="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-7 space-y-4">
            <div class="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
              <Sparkles class="h-3.5 w-3.5" />
              <span>Titik Akses Tunggal Warga</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Tanya Apa Saja Seputar Sampah ke PilahAI
            </h2>
            <p class="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Gak yakin sampah yang Anda pegang itu apa? PilahAI terhubung langsung dengan database kategori, lokasi bank sampah di Makassar, dan jadwal pengangkutan. Cukup tanya dengan gaya bicara sehari-hari.
            </p>

            <!-- Quick AI Prompt Chips -->
            <div class="pt-2 space-y-2">
              <p class="text-xs text-emerald-300 font-semibold uppercase tracking-wider">Coba tanyakan langsung:</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="prompt in aiPrompts"
                  :key="prompt"
                  type="button"
                  class="text-left text-xs bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg px-3 py-1.5 text-zinc-200 hover:text-white transition-colors cursor-pointer"
                  @click="handleOpenAIWithPrompt(prompt)"
                >
                  "{{ prompt }}"
                </button>
              </div>
            </div>

            <div class="pt-4">
              <Button
                size="lg"
                class="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold shadow-lg shadow-emerald-500/30"
                @click="handleOpenAIWithPrompt('')"
              >
                <Sparkles class="h-4 w-4 mr-2" />
                <span>Buka Chat PilahAI Sekarang</span>
              </Button>
            </div>
          </div>

          <!-- Chat UI Mockup Preview -->
          <div class="lg:col-span-5 bg-white/95 text-zinc-900 rounded-2xl p-5 shadow-2xl border border-white/20 space-y-3">
            <div class="flex items-center gap-3 border-b border-zinc-100 pb-3">
              <div class="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                AI
              </div>
              <div>
                <p class="text-xs font-bold text-zinc-900">PilahAI Makassar</p>
                <p class="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online & Siap Menjawab
                </p>
              </div>
            </div>

            <div class="space-y-2.5 text-xs">
              <div class="flex justify-end">
                <div class="bg-emerald-600 text-white rounded-2xl rounded-tr-none px-3.5 py-2 max-w-[85%] shadow-2xs">
                  Saya ada baterai remote bekas, buang ke mana ya?
                </div>
              </div>
              <div class="flex justify-start">
                <div class="bg-zinc-100 text-zinc-800 rounded-2xl rounded-tl-none px-3.5 py-2.5 max-w-[88%] space-y-1.5 border border-zinc-200/60">
                  <p class="font-medium text-emerald-800">
                    Baterai bekas masuk kategori <strong>B3 Rumah Tangga</strong> karena mengandung logam berat.
                  </p>
                  <p class="text-[11px] text-zinc-600">
                    Solusi: Jangan buang ke tong sampah biasa. Masukkan ke botol tertutup, lalu bawa ke drop-point B3 di Kantor Camat Rappocini atau Bank Sampah terdekat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Kategori Sampah Rumah Tangga -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-10">
        <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
          4 Kategori Sampah yang Wajib Diketahui
        </h2>
        <p class="mt-2 text-sm text-zinc-500">
          Pemilahan dari sumber adalah kunci. Kenali wadah dan penanganan yang tepat sebelum dibuang.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          v-for="cat in categories"
          :key="cat.id"
          :class="['border transition-all duration-200 hover:shadow-md', cat.borderColor]"
        >
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between mb-2">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800">
                <component :is="cat.icon" class="h-4 w-4" />
              </div>
              <span :class="['px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider', cat.bgBadge]">
                {{ cat.name }}
              </span>
            </div>
            <CardTitle class="text-base font-bold text-zinc-900">
              Sampah {{ cat.name }}
            </CardTitle>
            <CardDescription class="text-xs text-zinc-500 leading-relaxed">
              {{ cat.desc }}
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-3 text-xs">
            <div>
              <p class="font-semibold text-zinc-700 mb-1">Contoh barang:</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="ex in cat.examples"
                  :key="ex"
                  class="rounded bg-zinc-100 text-zinc-700 px-1.5 py-0.5 text-[11px]"
                >
                  {{ ex }}
                </span>
              </div>
            </div>
            <div class="border-t border-zinc-100 pt-2.5">
              <p class="font-semibold text-zinc-700">Cara penanganan:</p>
              <p class="text-zinc-600 text-[11px] mt-0.5">{{ cat.solution }}</p>
            </div>
          </CardContent>
          <CardFooter class="pt-0">
            <Button
              variant="outline"
              size="sm"
              class="w-full text-xs"
              @click="handleSearch(cat.id)"
            >
              Lihat Daftar {{ cat.name }}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>

    <!-- 5. Tiga Langkah Mudah Alur Warga -->
    <section class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="rounded-2xl border border-zinc-200/80 bg-white p-8 sm:p-10 shadow-xs">
        <h3 class="text-xl sm:text-2xl font-bold text-zinc-900 text-center mb-8">
          3 Langkah Nyata Kelola Sampah dari Rumah
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="flex flex-col items-center text-center space-y-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-extrabold text-lg">
              1
            </div>
            <h4 class="text-sm font-bold text-zinc-900">Identifikasi Jenis Sampah</h4>
            <p class="text-xs text-zinc-500 leading-relaxed">
              Cek nama barang di Pilahki atau tanyakan ke PilahAI untuk mengetahui kategori & cara penanganannya.
            </p>
          </div>

          <div class="flex flex-col items-center text-center space-y-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 font-extrabold text-lg">
              2
            </div>
            <h4 class="text-sm font-bold text-zinc-900">Pisahkan Berdasarkan Sifat</h4>
            <p class="text-xs text-zinc-500 leading-relaxed">
              Keringkan botol/kardus untuk bank sampah, kumpulkan sisa dapur untuk kompos, dan simpan B3 di wadah terpisah.
            </p>
          </div>

          <div class="flex flex-col items-center text-center space-y-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 font-extrabold text-lg">
              3
            </div>
            <h4 class="text-sm font-bold text-zinc-900">Salurkan Tepat Waktu</h4>
            <p class="text-xs text-zinc-500 leading-relaxed">
              Setor anorganik bernilai ke Bank Sampah terdekat, dan letakkan residu sesuai jadwal pengangkutan resmi.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Global Auth Modal -->
    <AuthModal
      :is-open="isAuthModalOpen"
      :title="modalTitle"
      :subtitle="modalSubtitle"
      @close="isAuthModalOpen = false"
      @auth-success="handleAuthSuccess"
    />
  </div>
</template>
