<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string | number | null | undefined
    label?: string
    type?: string
    placeholder?: string
    error?: string
    required?: boolean
    disabled?: boolean
    hint?: string
  }>(),
  {
    label: undefined,
    type: 'text',
    placeholder: undefined,
    error: undefined,
    required: false,
    disabled: false,
    hint: undefined,
  },
)

defineEmits<{ 'update:modelValue': [value: string] }>()

const id = useId()
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="mb-1 block text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-rose-500">*</span>
    </label>
    <input
      :id="id"
      class="input"
      :class="{ 'border-rose-400! ring-rose-400!': error }"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="mt-1 text-xs text-rose-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-xs text-slate-500">{{ hint }}</p>
  </div>
</template>
