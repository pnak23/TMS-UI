<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()

function handleClear() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div class="text-center">
      <p class="text-5xl font-bold text-brand-600">{{ props.error.statusCode }}</p>
      <h1 class="mt-2 text-lg font-semibold text-slate-900">
        {{ props.error.statusCode === 404 ? t('errors.notFound') : t('errors.serverError') }}
      </h1>
      <button type="button" class="btn-primary mt-5" @click="handleClear">{{ t('errors.goHome') }}</button>
    </div>
  </div>
</template>
