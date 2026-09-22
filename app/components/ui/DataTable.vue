<script setup lang="ts" generic="T extends Record<string, any>">
export interface DataTableColumn {
  key: string
  label: string
  class?: string
  align?: 'left' | 'right' | 'center'
}

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn[]
    rows: T[]
    loading?: boolean
    error?: string | null
    rowKey?: (row: T) => string | number
    emptyTitle?: string
    emptyDescription?: string
  }>(),
  {
    loading: false,
    error: null,
    rowKey: undefined,
    emptyTitle: undefined,
    emptyDescription: undefined,
  },
)

const emit = defineEmits<{ retry: [] }>()

function keyFor(row: T, index: number): string | number {
  return props.rowKey ? props.rowKey(row) : (row.id ?? index)
}

const alignClass: Record<string, string> = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
}
</script>

<template>
  <div class="card overflow-hidden">
    <div v-if="error">
      <ErrorState :description="error" @retry="emit('retry')" />
    </div>
    <div v-else-if="loading">
      <LoadingState variant="skeleton-rows" :rows="6" />
    </div>
    <div v-else-if="rows.length === 0">
      <EmptyState :title="emptyTitle" :description="emptyDescription" />
    </div>
    <div v-else class="overflow-x-auto">
      <table class="table-sticky min-w-full divide-y divide-slate-200 text-sm">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              class="whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500"
              :class="[col.class, alignClass[col.align ?? 'left']]"
            >
              {{ col.label }}
            </th>
            <th v-if="$slots.actions" class="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr v-for="(row, index) in rows" :key="keyFor(row, index)" class="hover:bg-slate-50">
            <td
              v-for="col in columns"
              :key="col.key"
              class="whitespace-nowrap px-4 py-2.5 text-slate-700"
              :class="[col.class, alignClass[col.align ?? 'left']]"
            >
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
            <td v-if="$slots.actions" class="px-4 py-2.5 text-right">
              <slot name="actions" :row="row" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <slot name="footer" />
  </div>
</template>
