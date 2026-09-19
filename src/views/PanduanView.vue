<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { kategoriEdukasiList, artikelPanduan, faqPanduan } from '@/data/panduanData'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import {
  BookOpen,
  Search,
  ChevronDown,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  X
} from 'lucide-vue-next'

const router = useRouter()

// Search & Filters
const searchQuery = ref('')
const selectedArtikel = ref(null)
const openFaqIndex = ref(0)

const filteredArtikel = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return artikelPanduan
  return artikelPanduan.filter(a => {
    return a.judul.toLowerCase().includes(q) ||
      a.ringkasan.toLowerCase().includes(q) ||
      a.isi?.some(line => line.toLowerCase().includes(q))
  })
})

const filteredFaq = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return faqPanduan
  return faqPanduan.filter(f => {
    const question = (f.tanya || f.q || '').toLowerCase()
    const answer = (f.jawab || f.a || '').toLowerCase()
    return question.includes(q) || answer.includes(q)
  })
})

const toggleFaq = (index) => {
  openFaqIndex.value = openFaqIndex.value === index ? -1 : index
}

const openModal = (art) => {
  selectedArtikel.value = art
}

const closeModal = () => {
  selectedArtikel.value = null
}

const askAIPanduan = (prompt = '') => {
  router.push({
    path: '/pilah-ai',
    query: { q: prompt || 'Bagaimana panduan mudah memilah sampah rumah tangga bagi pemula?' }
  })
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12 pb-16">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="space-y-1.5">
        <div class="flex items-center gap-2">
          <Badge variant="outline" class="bg-purple-50 text-purple-800 border-purple-200">
            Edukasi & Literasi
          </Badge>
          <span class="text-xs text-zinc-400">Bahasa Warga Awam &bull; Praktis</span>
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900">
          Panduan Praktis Pemilahan
        </h1>
        <p class="text-sm text-zinc-500 max-w-2xl leading-relaxed">
          Ketahui dasar-dasar pemilahan sampah, cara sederhana mengolah dari dapur, dan jawaban atas hal-hal yang sering membingungkan warga.
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        class="gap-2 self-start sm:self-auto border-zinc-200 text-zinc-700 hover:bg-zinc-100"
        @click="askAIPanduan('')"
      >
        <Sparkles class="h-4 w-4 text-emerald-600" />
        <span>Tanya AI Soal Edukasi</span>
      </Button>
    </div>

    <!-- Search Input -->
    <div class="max-w-xl">
      <div class="relative">
        <Search class="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
        <Input
          v-model="searchQuery"
          placeholder="Cari panduan, tips jelantah, sachet, atau bank sampah..."
          class="pl-10 bg-white"
        />
      </div>
    </div>

    <!-- 1. Panduan 4 Pilar Sampah Ringkas -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold tracking-tight text-zinc-900">
          4 Aturan Dasar Pemilahan
        </h2>
        <span class="text-xs text-zinc-400">Ringkasan Cepat</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card
          v-for="kat in kategoriEdukasiList"
          :key="kat.id"
          class="border-zinc-200/90 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between mb-2">
              <span
                :class="[
                  'px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider',
                  kat.id === 'organik' ? 'bg-emerald-50 text-emerald-800' :
                  kat.id === 'anorganik' ? 'bg-blue-50 text-blue-800' :
                  kat.id === 'b3' ? 'bg-amber-50 text-amber-800' :
                  'bg-zinc-100 text-zinc-800'
                ]"
              >
                {{ kat.nama }}
              </span>
              <span class="text-[10px] text-zinc-400 font-semibold">{{ kat.warnaWadah }}</span>
            </div>
            <CardTitle class="text-base font-bold text-zinc-900">
              {{ kat.ringkasan }}
            </CardTitle>
          </CardHeader>

          <CardContent class="space-y-3 text-xs py-2">
            <div>
              <p class="font-semibold text-zinc-700 mb-1">Contoh utama:</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="c in kat.contoh"
                  :key="c"
                  class="rounded bg-zinc-100 text-zinc-700 px-1.5 py-0.5 text-[11px]"
                >
                  {{ c }}
                </span>
              </div>
            </div>

            <div class="rounded-lg bg-zinc-50 p-2.5 border border-zinc-100 space-y-1">
              <p class="font-semibold text-zinc-700 text-[11px]">Kunci Penting:</p>
              <p class="text-zinc-600 text-[11px] leading-relaxed">{{ kat.tipsRina || kat.ringkasan }}</p>
            </div>
          </CardContent>

          <CardFooter class="pt-3 border-t border-zinc-100">
            <Button
              variant="outline"
              size="sm"
              class="w-full text-xs"
              @click="router.push({ path: '/pilah', query: { kategori: kat.id } })"
            >
              Lihat Contoh Sampah &rarr;
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>

    <!-- 2. Artikel Panduan Edukasi -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold tracking-tight text-zinc-900">
          Artikel & Tips Langkah-demi-Langkah
        </h2>
        <span class="text-xs text-zinc-500">{{ filteredArtikel.length }} artikel</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          v-for="art in filteredArtikel"
          :key="art.id"
          class="flex flex-col justify-between border-zinc-200/90 hover:shadow-md transition-all duration-200"
        >
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between mb-2">
              <Badge variant="outline" class="text-[11px] font-medium bg-zinc-50">
                {{ art.kategori || 'Panduan Warga' }}
              </Badge>
              <span class="text-[11px] text-zinc-400 flex items-center gap-1">
                <Clock class="h-3 w-3" />
                {{ art.estimasiBaca || '3 mnt' }}
              </span>
            </div>
            <CardTitle class="text-base font-bold text-zinc-900 hover:text-emerald-700 transition-colors">
              {{ art.judul }}
            </CardTitle>
            <CardDescription class="text-xs text-zinc-500 line-clamp-2 mt-1">
              {{ art.ringkasan }}
            </CardDescription>
          </CardHeader>

          <CardContent class="py-2 text-xs">
            <ul class="space-y-1 text-zinc-600">
              <li v-for="(point, idx) in (art.isi || []).slice(0, 2)" :key="idx" class="flex items-start gap-1.5 text-[11px] line-clamp-1">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{{ point }}</span>
              </li>
            </ul>
          </CardContent>

          <CardFooter class="pt-3 border-t border-zinc-100">
            <Button
              variant="outline"
              size="sm"
              class="w-full text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border-emerald-200"
              @click="openModal(art)"
            >
              <FileText class="h-3.5 w-3.5 mr-1.5" />
              <span>Baca Selengkapnya</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>

    <!-- 3. Pertanyaan yang Sering Diajukan (FAQ Accordion) -->
    <section class="space-y-4 max-w-4xl mx-auto pt-6">
      <div class="text-center space-y-1 mb-6">
        <h2 class="text-2xl font-bold tracking-tight text-zinc-900">
          Pertanyaan Warga yang Sering Muncul (FAQ)
        </h2>
        <p class="text-xs text-zinc-500">
          Jawaban lugas atas hal-hal membingungkan seputar pemilahan sehari-hari.
        </p>
      </div>

      <div class="space-y-3">
        <div
          v-for="(faq, index) in filteredFaq"
          :key="faq.id || index"
          class="rounded-xl border border-zinc-200 bg-white overflow-hidden transition-all shadow-2xs"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between p-4 text-left font-semibold text-sm text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
            @click="toggleFaq(index)"
          >
            <span class="flex items-center gap-2.5">
              <HelpCircle class="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{{ faq.tanya || faq.q }}</span>
            </span>
            <ChevronDown
              class="h-4 w-4 text-zinc-400 transition-transform duration-200 shrink-0 ml-2"
              :class="{ 'rotate-180': openFaqIndex === index }"
            />
          </button>

          <div
            v-if="openFaqIndex === index"
            class="px-5 pb-4 pt-2 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 bg-zinc-50/60 animate-in fade-in duration-150"
          >
            <p>{{ faq.jawab || faq.a }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal Baca Artikel Lengkap -->
    <Dialog :open="!!selectedArtikel" @update:open="(val) => !val && closeModal()">
      <DialogContent class="max-w-2xl p-6 sm:p-8">
        <DialogHeader v-if="selectedArtikel" class="text-left space-y-2">
          <Badge variant="outline" class="w-fit bg-emerald-50 text-emerald-800 border-emerald-200 text-xs">
            {{ selectedArtikel.kategori || 'Panduan Praktis' }}
          </Badge>
          <DialogTitle class="text-xl font-bold text-zinc-900">
            {{ selectedArtikel.judul }}
          </DialogTitle>
          <DialogDescription class="text-xs text-zinc-500">
            {{ selectedArtikel.ringkasan }}
          </DialogDescription>
        </DialogHeader>

        <div v-if="selectedArtikel" class="space-y-4 text-sm text-zinc-700 my-4 max-h-[60vh] overflow-y-auto pr-2">
          <div
            v-for="(par, i) in selectedArtikel.isi"
            :key="i"
            class="flex items-start gap-3 bg-zinc-50 rounded-xl p-3.5 border border-zinc-200/60"
          >
            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0 mt-0.5">
              {{ i + 1 }}
            </div>
            <p class="text-xs sm:text-sm text-zinc-700 leading-relaxed">{{ par }}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-2 border-t border-zinc-100 pt-4">
          <Button variant="outline" size="sm" @click="closeModal">Tutup</Button>
          <Button
            size="sm"
            class="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            @click="closeModal(); askAIPanduan(`Jelaskan lebih rinci tentang: ${selectedArtikel?.judul}`)"
          >
            <Sparkles class="h-3.5 w-3.5" />
            <span>Tanya AI Seputar Topik Ini</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
