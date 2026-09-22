<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    status: string
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'auto'
  }>(),
  { variant: 'auto' },
)

const AUTO_MAP: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  active: 'success',
  present: 'success',
  published: 'success',
  approved: 'success',
  completed: 'success',
  inactive: 'neutral',
  draft: 'neutral',
  pending: 'warning',
  late: 'warning',
  locked: 'danger',
  absent: 'danger',
  rejected: 'danger',
  permission: 'info',
  leave: 'info',
}

const variantClasses: Record<string, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  danger: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
  info: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200',
  neutral: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200',
}

const resolvedVariant = computed(() => {
  if (props.variant !== 'auto') return props.variant
  return AUTO_MAP[props.status.toLowerCase()] ?? 'neutral'
})
</script>

<template>
  <span class="badge" :class="variantClasses[resolvedVariant]">
    <span class="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
    {{ status }}
  </span>
</template>
