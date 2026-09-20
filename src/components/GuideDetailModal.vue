<script setup>
import { X, BookOpen } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  guide: {
    type: Object,
    default: null
  }
})

defineEmits(['close'])
</script>

<template>
  <div
    v-if="isOpen && guide"
    class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 border border-slate-100 text-left">
      
      <!-- Modal Header -->
      <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div class="space-y-2.5">
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-800 border border-brand-100/80">
              {{ guide.category }}
            </span>
            <span class="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <BookOpen class="w-3.5 h-3.5 text-slate-400" />
              <span>{{ guide.readTime }}</span>
            </span>
          </div>

          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug tracking-tight">
            {{ guide.title }}
          </h2>
        </div>
        
        <button
          type="button"
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          title="Tutup panduan"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Summary / Intro -->
      <p class="text-sm text-slate-600 bg-slate-50 border border-slate-200/60 p-4 sm:p-5 rounded-2xl leading-relaxed">
        {{ guide.summary }}
      </p>

      <!-- HTML Content Area -->
      <div class="space-y-4 text-slate-700 text-sm leading-relaxed" v-html="guide.contentHtml">
      </div>

      <!-- Modal Footer -->
      <div class="pt-6 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          @click="$emit('close')"
          class="px-6 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
        >
          Selesai Membaca
        </button>
      </div>

    </div>
  </div>
</template>
