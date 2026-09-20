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
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
    <div class="space-y-6">
      
      <!-- Top Title -->
      <div class="space-y-1">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Panduan & Literasi Keberlanjutan</h1>
        <p class="text-sm text-slate-600">
          Artikel edukasi praktis untuk meningkatkan kemandirian warga dalam mengolah dan mengelola sampah dari rumah tangga.
        </p>
      </div>

      <!-- Guides Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          v-for="guide in guidesData"
          :key="guide.id"
          @click="openGuide(guide)"
          class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-brand-300 transition-all duration-200 flex flex-col justify-between space-y-4 cursor-pointer group"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border',
                  guide.badgeColor
                ]"
              >
                {{ guide.category }}
              </span>
              <span class="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <BookOpen class="w-3.5 h-3.5 text-brand-600" />
                <span>{{ guide.readTime }}</span>
              </span>
            </div>

            <h3 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-800 transition-colors leading-snug">
              {{ guide.title }}
            </h3>

            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {{ guide.summary }}
            </p>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-700 group-hover:text-brand-800">
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
