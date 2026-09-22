<script setup lang="ts">
import type { Paginated } from '~/types/common'
import type { AuditLog } from '~/types/audit'
import type { DataTableColumn } from '~/components/ui/DataTable.vue'

definePageMeta({ layout: 'admin', permission: { module: 'audit_logs', action: 'VIEW' } })

const { t, locale } = useI18n()

const page = ref(1)
const pageSize = 15
const moduleFilter = ref('')
const dateFrom = ref('')
const dateTo = ref('')

const query = computed(() => ({
  page: page.value,
  pageSize,
  module: moduleFilter.value || undefined,
  dateFrom: dateFrom.value || undefined,
  dateTo: dateTo.value || undefined,
}))

const { data, pending, error, refresh } = await useAsyncData<Paginated<AuditLog>>(
  'admin-audit-logs',
  () => apiFetch<Paginated<AuditLog>>('/audit-logs', { query: query.value }),
  { watch: [query] },
)

const columns: DataTableColumn[] = [
  { key: 'createdAt', label: t('audit.timestamp') },
  { key: 'action', label: t('audit.action') },
  { key: 'module', label: t('audit.module') },
  { key: 'description', label: t('audit.target') },
  { key: 'ipAddress', label: t('audit.ipAddress') },
]

function formatDate(value: string) {
  return new Date(value).toLocaleString(locale.value === 'km' ? 'km-KH' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })
}
</script>

<template>
  <div>
    <PageHeader :title="t('audit.title')" />

    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <input v-model="moduleFilter" class="input sm:w-40" :placeholder="t('audit.module')" />
      <input v-model="dateFrom" type="date" class="input sm:w-40" />
      <input v-model="dateTo" type="date" class="input sm:w-40" />
    </div>

    <DataTable :columns="columns" :rows="data?.items ?? []" :loading="pending" :error="error?.message ?? null" @retry="refresh">
      <template #cell-createdAt="{ value }">{{ formatDate(value) }}</template>
      <template #cell-action="{ value }">
        <span class="badge bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200">{{ value }}</span>
      </template>
      <template #footer>
        <Pagination v-if="data" :page="page" :page-size="pageSize" :total="data.total" @update:page="page = $event" />
      </template>
    </DataTable>
  </div>
</template>
