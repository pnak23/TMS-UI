<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div class="absolute right-4 top-4">
      <LocaleSwitcher />
    </div>
    <div class="w-full max-w-sm">
      <div class="mb-6 flex flex-col items-center gap-2">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
          {{ t('app.name') }}
        </div>
        <p class="text-sm font-medium text-slate-500">{{ t('app.fullName') }}</p>
      </div>
      <div class="card p-6">
        <slot />
      </div>
    </div>
  </div>
</template>
