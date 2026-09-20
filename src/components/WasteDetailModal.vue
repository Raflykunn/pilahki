<script setup>
import { X, Tag, Bot, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  waste: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'ask-ai'])
</script>

<template>
  <div
    v-if="isOpen && waste"
    class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 border border-slate-100">
      
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-1.5 text-left">
          <span
            :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border',
              waste.badgeColor
            ]"
          >
            {{ waste.categoryName || waste.category }}
          </span>
          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
            {{ waste.name }}
          </h2>
        </div>
        <button
          type="button"
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Economic / Recyclable Value -->
      <div class="bg-brand-50/60 border border-brand-100/80 rounded-2xl p-4 flex items-start gap-3 text-left">
        <Tag class="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-brand-800">Nilai Daur Ulang / Status</span>
          <p class="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5">
            {{ waste.recyclableValue }}
          </p>
        </div>
      </div>

      <!-- Steps List -->
      <div class="space-y-2 text-left">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500">Langkah Pemilahan di Rumah</h3>
        <ul class="space-y-2.5">
          <li
            v-for="(step, i) in waste.steps"
            :key="i"
            class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed"
          >
            <span class="w-5 h-5 rounded-full bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              {{ i + 1 }}
            </span>
            <span>{{ step }}</span>
          </li>
        </ul>
      </div>

      <!-- Destination Recommendation -->
      <div class="space-y-1.5 pt-2 border-t border-slate-100 text-left">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500">Rekomendasi Penyaluran</h3>
        <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          {{ waste.destination }}
        </p>
      </div>

      <!-- Prohibitions -->
      <div v-if="waste.prohibitions && waste.prohibitions.length" class="space-y-1.5 pt-2 border-t border-slate-100 text-left">
        <h3 class="text-xs font-bold uppercase tracking-wider text-red-600">Hal yang Dilarang / Pantangan</h3>
        <ul class="space-y-1.5">
          <li
            v-for="(prohibition, i) in waste.prohibitions"
            :key="i"
            class="flex items-start gap-2 text-xs text-red-600/90 leading-relaxed"
          >
            <span class="text-red-500 font-bold">&bull;</span>
            <span>{{ prohibition }}</span>
          </li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <button 
          type="button" 
          @click="$emit('close')"
          class="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
        >
          Tutup
        </button>
        <button 
          type="button" 
          @click="$emit('ask-ai', `Bagaimana cara mengelola sampah ${waste.name}?`)"
          class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Bot class="w-4 h-4 text-accent-light" />
          <span>Tanyakan ke PilahAI</span>
        </button>
      </div>

    </div>
  </div>
</template>
