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
  <h2 :class="cn('text-xl font-semibold leading-none tracking-tight text-zinc-900', props.class)">
    <slot />
  </h2>
</template>
