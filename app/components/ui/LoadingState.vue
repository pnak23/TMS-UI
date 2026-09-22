<script setup lang="ts">
withDefaults(defineProps<{ label?: string; rows?: number; variant?: 'spinner' | 'skeleton-rows' }>(), {
  label: undefined,
  rows: 4,
  variant: 'spinner',
})
const { t } = useI18n()
</script>

<template>
  <div v-if="variant === 'skeleton-rows'" class="space-y-2 p-4">
    <div v-for="i in rows" :key="i" class="h-9 animate-pulse rounded-md bg-slate-100" />
  </div>
  <div v-else class="flex flex-col items-center justify-center gap-2 py-12 text-slate-500">
    <Icon name="heroicons:arrow-path" class="h-5 w-5 animate-spin" />
    <p class="text-sm">{{ label ?? t('common.loading') }}</p>
  </div>
</template>
