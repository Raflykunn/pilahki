<script setup>
import { provide, toRef } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

provide('activeTab', toRef(props, 'modelValue'))
provide('setActiveTab', (val) => emit('update:modelValue', val))
</script>

<template>
  <div class="w-full">
    <slot />
  </div>
</template>
