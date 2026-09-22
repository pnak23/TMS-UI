<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    message?: string
    variant?: 'danger' | 'default'
    loading?: boolean
  }>(),
  { title: undefined, message: undefined, variant: 'default', loading: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: boolean]; confirm: [] }>()
const { t } = useI18n()
</script>

<template>
  <Modal :model-value="modelValue" size="sm" @update:model-value="emit('update:modelValue', $event)">
    <template #header>
      <h2 class="text-base font-semibold text-slate-900">{{ title ?? t('common.confirm') }}</h2>
    </template>
    <p class="text-sm text-slate-600">{{ message ?? t('common.confirmDelete') }}</p>
    <template #footer>
      <button type="button" class="btn-secondary" @click="emit('update:modelValue', false)">
        {{ t('common.cancel') }}
      </button>
      <button
        type="button"
        :class="variant === 'danger' ? 'btn-danger' : 'btn-primary'"
        :disabled="loading"
        @click="emit('confirm')"
      >
        <Icon v-if="loading" name="heroicons:arrow-path" class="h-4 w-4 animate-spin" />
        {{ t('common.confirm') }}
      </button>
    </template>
  </Modal>
</template>
