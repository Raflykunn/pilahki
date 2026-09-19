<script setup>
import { provide, toRef } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:open'])

provide('dialogOpen', toRef(props, 'open'))
provide('closeDialog', () => emit('update:open', false))
</script>

<template>
  <slot />
</template>
