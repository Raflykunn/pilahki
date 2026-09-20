<script setup>
import { ref } from 'vue'
import { guidesData } from '@/data/panduanData'
import GuideDetailModal from '@/components/GuideDetailModal.vue'
import {
  BookOpen,
  ArrowRight
} from 'lucide-vue-next'

const selectedGuide = ref(null)
const isModalOpen = ref(false)

const openGuide = (guide) => {
  selectedGuide.value = guide
  isModalOpen.value = true
}
</script>

<template>
  <main class="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-left">
    <div class="space-y-10">
      
      <!-- Top Title with Generous Breathing Room -->
      <div class="space-y-2 max-w-2xl">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Panduan Edukasi Warga
        </h1>
        <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
          Kumpulan panduan praktis dan langkah mandiri memilah, mengompos, serta mengelola sampah rumah tangga untuk lingkungan yang lebih sehat.
        </p>
      </div>

      <!-- Guides Cards Grid (Spacious & Airy) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="guide in guidesData"
          :key="guide.id"
          @click="openGuide(guide)"
          class="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-9 shadow-xs hover:shadow-lg hover:border-brand-300 transition-all duration-300 flex flex-col justify-between space-y-6 cursor-pointer group text-left"
        >
          <!-- Top: Category & Reading Time -->
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-3">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-100/80">
                {{ guide.category }}
              </span>
              <span class="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <BookOpen class="w-3.5 h-3.5 text-slate-400" />
                <span>{{ guide.readTime }}</span>
              </span>
            </div>

            <!-- Title -->
            <h2 class="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-brand-800 transition-colors leading-snug">
              {{ guide.title }}
            </h2>

            <!-- Summary -->
            <p class="text-sm text-slate-600 leading-relaxed">
              {{ guide.summary }}
            </p>
          </div>

          <!-- Bottom: Action Link -->
          <div class="pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-800 group-hover:text-brand-700">
            <span>Baca Panduan Lengkap</span>
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

    </div>

    <!-- Guide Detail Reader Modal -->
    <GuideDetailModal
      :is-open="isModalOpen"
      :guide="selectedGuide"
      @close="isModalOpen = false"
    />
  </main>
</template>
