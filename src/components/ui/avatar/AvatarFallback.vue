<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  class: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div
    :class="
      cn(
        'flex h-full w-full items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs uppercase',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
