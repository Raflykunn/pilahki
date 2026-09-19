<script setup>
import { inject, computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  value: {
    type: [String, Number],
    required: true,
  },
  class: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const activeTab = inject('activeTab')
const setActiveTab = inject('setActiveTab', () => {})

const isActive = computed(() => activeTab.value === props.value)
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :class="
      cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
        isActive
          ? 'bg-white text-zinc-950 shadow-xs font-semibold'
          : 'text-zinc-600 hover:text-zinc-900',
        props.class
      )
    "
    @click="setActiveTab(value)"
  >
    <slot />
  </button>
</template>
