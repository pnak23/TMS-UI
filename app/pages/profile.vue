<script setup lang="ts">
definePageMeta({ layout: false })

const authStore = useAuthStore()
const { t } = useI18n()
const { adminNav, teacherNav } = useNavigation()
const navItems = computed(() => (authStore.isAdmin ? adminNav.value : teacherNav.value))
</script>

<template>
  <AppShell :nav-items="navItems">
    <PageHeader :title="t('nav.profile')" />
    <div class="card max-w-lg p-5">
      <div class="mb-4 flex items-center gap-3">
        <span class="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl font-semibold text-brand-700">
          {{ (authStore.user?.nameEnglish || authStore.user?.username || '?').slice(0, 1).toUpperCase() }}
        </span>
        <div>
          <p class="font-medium text-slate-900">{{ authStore.user?.nameEnglish }}</p>
          <p class="text-sm text-slate-500">{{ authStore.user?.nameKhmer }}</p>
        </div>
      </div>
      <dl class="space-y-3 text-sm">
        <div class="flex justify-between">
          <dt class="text-slate-500">{{ t('users.username') }}</dt>
          <dd class="font-medium text-slate-800">{{ authStore.user?.username }}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-slate-500">{{ t('users.email') }}</dt>
          <dd class="font-medium text-slate-800">{{ authStore.user?.email }}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-slate-500">{{ t('users.roles') }}</dt>
          <dd class="font-medium text-slate-800">{{ authStore.user?.roles?.map((r) => r.name).join(', ') }}</dd>
        </div>
      </dl>
      <NuxtLink to="/change-password" class="btn-secondary mt-5 inline-flex">
        {{ t('auth.changePassword') }}
      </NuxtLink>
    </div>
  </AppShell>
</template>
