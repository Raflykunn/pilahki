<script setup>
import { inject } from 'vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: {
    type: String,
    default: '',
  },
  showClose: {
    type: Boolean,
    default: true,
  },
})

const isOpen = inject('dialogOpen', false)
const closeDialog = inject('closeDialog', () => {})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        @click.self="closeDialog"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
        >
          <div
            v-if="isOpen"
            :class="
              cn(
                'relative w-full max-w-lg bg-white rounded-2xl border border-zinc-200 shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto',
                props.class
              )
            "
            role="dialog"
            aria-modal="true"
          >
            <button
              v-if="showClose"
              type="button"
              class="absolute right-4 top-4 rounded-full p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600/30 cursor-pointer"
              @click="closeDialog"
              aria-label="Tutup"
            >
              <X class="w-4 h-4" />
            </button>
            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
