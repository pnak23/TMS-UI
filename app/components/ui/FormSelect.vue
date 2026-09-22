<script setup lang="ts">
export interface SelectOption {
  label: string
  value: string | number
}

withDefaults(
  defineProps<{
    modelValue: string | number | null
    options: SelectOption[]
    label?: string
    placeholder?: string
    error?: string
    required?: boolean
    disabled?: boolean
  }>(),
  { label: undefined, placeholder: undefined, error: undefined, required: false, disabled: false },
)

defineEmits<{ 'update:modelValue': [value: string] }>()

const id = useId()
const { t } = useI18n()
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="mb-1 block text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-rose-500">*</span>
    </label>
    <select
      :id="id"
      class="input"
      :class="{ 'border-rose-400! ring-rose-400!': error }"
      :value="modelValue ?? ''"
      :disabled="disabled"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="" disabled>{{ placeholder ?? t('common.selectOption') }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-xs text-rose-600">{{ error }}</p>
  </div>
</template>
