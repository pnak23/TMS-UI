<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    value: string | number
    icon?: string
    accent?: 'brand' | 'emerald' | 'amber' | 'rose' | 'slate'
    trend?: string
    trendDirection?: 'up' | 'down' | 'neutral'
  }>(),
  { icon: undefined, accent: 'brand', trend: undefined, trendDirection: 'neutral' },
)

const accentClasses: Record<string, string> = {
  brand: 'bg-brand-50 text-brand-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
  slate: 'bg-slate-100 text-slate-600',
}
</script>

<template>
  <div class="card flex items-center gap-3 p-4">
    <div v-if="icon" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" :class="accentClasses[accent]">
      <Icon :name="icon" class="h-5 w-5" />
    </div>
    <div class="min-w-0">
      <p class="truncate text-xs font-medium text-slate-500">{{ label }}</p>
      <div class="flex items-baseline gap-1.5">
        <p class="text-xl font-semibold text-slate-900">{{ value }}</p>
        <span
          v-if="trend"
          class="text-xs font-medium"
          :class="{
            'text-emerald-600': trendDirection === 'up',
            'text-rose-600': trendDirection === 'down',
            'text-slate-400': trendDirection === 'neutral',
          }"
        >
          {{ trend }}
        </span>
      </div>
    </div>
  </div>
</template>
