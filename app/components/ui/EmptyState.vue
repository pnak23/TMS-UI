<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    title?: string
    description?: string
  }>(),
  { icon: 'heroicons:inbox', title: undefined, description: undefined },
)

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2 py-12 text-center">
    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
      <Icon :name="icon" class="h-6 w-6" />
    </div>
    <p class="text-sm font-medium text-slate-700">{{ title ?? t('common.noData') }}</p>
    <p v-if="description" class="max-w-sm text-xs text-slate-500">{{ description }}</p>
    <div v-if="$slots.action" class="mt-2">
      <slot name="action" />
    </div>
  </div>
</template>
