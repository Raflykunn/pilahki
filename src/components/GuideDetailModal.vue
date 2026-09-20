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
    class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 border border-slate-100 text-left">
      
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
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

          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
            {{ guide.title }}
          </h2>
        </div>
        
        <button
          type="button"
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer shrink-0"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <p class="text-xs sm:text-sm text-slate-600 bg-brand-50/50 border border-brand-100 p-3.5 rounded-2xl leading-relaxed">
        {{ guide.summary }}
      </p>

      <!-- HTML Content Area -->
      <div class="space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed" v-html="guide.contentHtml">
      </div>

      <div class="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          @click="$emit('close')"
          class="px-5 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs shadow-sm cursor-pointer"
        >
          Selesai Membaca
        </button>
      </div>

    </div>
  </div>
</template>
