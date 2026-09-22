<script setup lang="ts">
withDefaults(defineProps<{ title?: string; description?: string }>(), {
  title: undefined,
  description: undefined,
})
const emit = defineEmits<{ retry: [] }>()
const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 py-12 text-center">
    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
      <Icon name="heroicons:exclamation-triangle" class="h-6 w-6" />
    </div>
    <p class="text-sm font-medium text-slate-700">{{ title ?? t('common.somethingWentWrong') }}</p>
    <p v-if="description" class="max-w-sm text-xs text-slate-500">{{ description }}</p>
    <button type="button" class="btn-secondary mt-2" @click="emit('retry')">
      <Icon name="heroicons:arrow-path" class="h-4 w-4" />
      {{ t('common.retry') }}
    </button>
  </div>
</template>
