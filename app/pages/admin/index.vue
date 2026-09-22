<script setup lang="ts">
import type { AdminDashboard } from '~/types/dashboard'

definePageMeta({ layout: 'admin', permission: { module: 'dashboard', action: 'VIEW' } })

const { t, locale } = useI18n()

const { data, pending, error, refresh } = await useAsyncData<AdminDashboard>('admin-dashboard', () =>
  apiFetch<AdminDashboard>('/dashboard/admin'),
)

function formatDate(value: string) {
  return new Date(value).toLocaleString(locale.value === 'km' ? 'km-KH' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
</script>

<template>
  <div>
    <PageHeader :title="t('dashboard.admin.title')" />

    <ErrorState v-if="error" :description="error.message" @retry="refresh" />

    <template v-else>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <DashboardCard :label="t('dashboard.admin.totalTeachers')" :value="pending ? '—' : (data?.totalTeachers ?? 0)" icon="heroicons:academic-cap" accent="brand" />
        <DashboardCard :label="t('dashboard.admin.activeTeachers')" :value="pending ? '—' : (data?.activeTeachers ?? 0)" icon="heroicons:user-group" accent="emerald" />
        <DashboardCard :label="t('dashboard.admin.totalStudents')" :value="pending ? '—' : (data?.totalStudents ?? 0)" icon="heroicons:users" accent="brand" />
        <DashboardCard :label="t('dashboard.admin.activeClasses')" :value="pending ? '—' : (data?.activeClasses ?? 0)" icon="heroicons:squares-2x2" accent="slate" />
        <DashboardCard :label="t('dashboard.admin.totalSubjects')" :value="pending ? '—' : (data?.totalSubjects ?? 0)" icon="heroicons:book-open" accent="slate" />
        <DashboardCard :label="t('dashboard.admin.todayAttendance')" :value="pending ? '—' : (data?.todayAttendance ?? '—')" icon="heroicons:clipboard-document-check" accent="emerald" />
        <DashboardCard :label="t('dashboard.admin.pendingGrading')" :value="pending ? '—' : (data?.pendingGrading ?? 0)" icon="heroicons:pencil-square" accent="amber" />
        <DashboardCard :label="t('dashboard.admin.activeAssignments')" :value="pending ? '—' : (data?.activeAssignments ?? 0)" icon="heroicons:document-text" accent="amber" />
      </div>

      <div class="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="card p-4">
          <h2 class="mb-3 text-sm font-semibold text-slate-700">{{ t('dashboard.admin.recentActivity') }}</h2>
          <LoadingState v-if="pending" variant="skeleton-rows" :rows="5" />
          <EmptyState v-else-if="!data?.recentActivity?.length" />
          <ul v-else class="divide-y divide-slate-100">
            <li v-for="log in data.recentActivity" :key="log.id" class="flex items-start justify-between gap-3 py-2 text-sm">
              <div>
                <p class="font-medium text-slate-700">{{ log.description || log.action }}</p>
                <p class="text-xs text-slate-400">{{ log.module }}</p>
              </div>
              <span class="shrink-0 text-xs text-slate-400">{{ formatDate(log.createdAt) }}</span>
            </li>
          </ul>
        </div>

        <div class="card p-4">
          <h2 class="mb-3 text-sm font-semibold text-slate-700">{{ t('dashboard.admin.recentLogins') }}</h2>
          <LoadingState v-if="pending" variant="skeleton-rows" :rows="5" />
          <EmptyState v-else-if="!data?.recentLogins?.length" />
          <ul v-else class="divide-y divide-slate-100">
            <li v-for="log in data.recentLogins" :key="log.id" class="flex items-center justify-between gap-3 py-2 text-sm">
              <div class="flex items-center gap-2">
                <StatusBadge :status="log.success ? 'active' : 'rejected'" :variant="log.success ? 'success' : 'danger'" />
                <span class="font-medium text-slate-700">{{ log.usernameAttempted }}</span>
              </div>
              <span class="shrink-0 text-xs text-slate-400">{{ formatDate(log.createdAt) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>
