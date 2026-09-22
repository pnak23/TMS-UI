<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const { t } = useI18n()
</script>

<template>
  <div class="text-center">
    <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
      <Icon name="heroicons:lock-closed" class="h-6 w-6" />
    </div>
    <h1 class="mb-1 text-lg font-semibold text-slate-900">{{ t('errors.forbidden') }}</h1>
    <NuxtLink to="/" class="btn-primary mt-4 inline-flex">{{ t('errors.goHome') }}</NuxtLink>
  </div>
</template>
