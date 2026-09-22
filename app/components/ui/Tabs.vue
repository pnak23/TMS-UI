<script setup lang="ts">
export interface TabItem {
  key: string
  label: string
}

const props = defineProps<{ modelValue: string; tabs: TabItem[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
void props
</script>

<template>
  <div>
    <div class="mb-4 flex gap-1 overflow-x-auto border-b border-slate-200">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition-colors"
        :class="modelValue === tab.key ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-700'"
        @click="emit('update:modelValue', tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>
    <slot />
  </div>
</template>
