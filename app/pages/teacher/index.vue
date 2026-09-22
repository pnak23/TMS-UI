<script setup lang="ts">
definePageMeta({ layout: 'teacher', permission: { module: 'dashboard', action: 'VIEW' } })

const { t, locale } = useI18n()
const authStore = useAuthStore()

const today = computed(() =>
  new Date().toLocaleDateString(locale.value === 'km' ? 'km-KH' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)

const greetingName = computed(() => authStore.user?.nameEnglish || authStore.user?.username || '')
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-slate-900">{{ t('dashboard.teacher.greeting') }}, {{ greetingName }}</h1>
      <p class="text-sm text-slate-500">{{ today }}</p>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div class="card p-4 lg:col-span-2">
        <h2 class="mb-3 text-sm font-semibold text-slate-700">{{ t('dashboard.teacher.todaySchedule') }}</h2>
        <EmptyState
          icon="heroicons:calendar-days"
          :title="t('dashboard.teacher.noClassesToday')"
          :description="t('common.comingSoon')"
        />
      </div>

      <div class="card p-4">
        <h2 class="mb-3 text-sm font-semibold text-slate-700">{{ t('dashboard.teacher.pendingTasks') }}</h2>
        <div class="space-y-2">
          <div class="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm">
            <span class="text-slate-600">{{ t('dashboard.teacher.pendingAttendance') }}</span>
            <span class="font-semibold text-slate-800">—</span>
          </div>
          <div class="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm">
            <span class="text-slate-600">{{ t('dashboard.teacher.pendingGrading') }}</span>
            <span class="font-semibold text-slate-800">—</span>
          </div>
          <div class="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm">
            <span class="text-slate-600">{{ t('dashboard.teacher.activeAssignments') }}</span>
            <span class="font-semibold text-slate-800">—</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card mt-4 p-4">
      <h2 class="mb-3 text-sm font-semibold text-slate-700">{{ t('dashboard.teacher.quickActions') }}</h2>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <button v-for="action in [
          { label: t('dashboard.teacher.takeAttendance'), icon: 'heroicons:clipboard-document-check' },
          { label: t('dashboard.teacher.createAssignment'), icon: 'heroicons:document-plus' },
          { label: t('dashboard.teacher.createLessonPlan'), icon: 'heroicons:book-open' },
          { label: t('dashboard.teacher.enterScores'), icon: 'heroicons:pencil-square' },
          { label: t('dashboard.teacher.viewMyClasses'), icon: 'heroicons:academic-cap' },
        ]" :key="action.label" type="button" disabled class="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-200 p-3 text-center opacity-60">
          <Icon :name="action.icon" class="h-5 w-5 text-slate-500" />
          <span class="text-xs font-medium text-slate-600">{{ action.label }}</span>
        </button>
      </div>
      <p class="mt-3 text-xs text-slate-400">{{ t('common.comingSoon') }}</p>
    </div>
  </div>
</template>
