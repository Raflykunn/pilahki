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
        'inline-flex h-10 items-center justify-center rounded-lg bg-zinc-100 p-1 text-zinc-500',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
