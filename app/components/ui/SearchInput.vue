<script setup lang="ts">
withDefaults(defineProps<{ modelValue: string; placeholder?: string }>(), { placeholder: undefined })
defineEmits<{ 'update:modelValue': [value: string] }>()
const { t } = useI18n()
</script>

<template>
  <div class="relative">
    <Icon name="heroicons:magnifying-glass" class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    <input
      class="input pl-9"
      type="search"
      :value="modelValue"
      :placeholder="placeholder ?? t('common.search')"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
