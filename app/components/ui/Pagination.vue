<script setup lang="ts">
const props = defineProps<{
  page: number
  pageSize: number
  total: number
}>()

const emit = defineEmits<{ 'update:page': [value: number] }>()
const { t } = useI18n()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const rangeStart = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1))
const rangeEnd = computed(() => Math.min(props.page * props.pageSize, props.total))

function go(page: number) {
  if (page < 1 || page > totalPages.value) return
  emit('update:page', page)
}
</script>

<template>
  <div class="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row">
    <p class="text-xs text-slate-500">
      {{ t('common.showing') }} <span class="font-medium text-slate-700">{{ rangeStart }}</span>
      {{ t('common.to') }} <span class="font-medium text-slate-700">{{ rangeEnd }}</span>
      {{ t('common.of') }} <span class="font-medium text-slate-700">{{ total }}</span> {{ t('common.entries') }}
    </p>
    <div class="flex items-center gap-1">
      <button type="button" class="btn-ghost px-2!" :disabled="page <= 1" @click="go(page - 1)">
        <Icon name="heroicons:chevron-left" class="h-4 w-4" />
      </button>
      <span class="px-2 text-xs text-slate-600">{{ t('common.page') }} {{ page }} {{ t('common.of') }} {{ totalPages }}</span>
      <button type="button" class="btn-ghost px-2!" :disabled="page >= totalPages" @click="go(page + 1)">
        <Icon name="heroicons:chevron-right" class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
