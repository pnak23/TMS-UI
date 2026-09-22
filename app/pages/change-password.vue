<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const authStore = useAuthStore()
const serverError = ref('')
const success = ref(false)
const submitting = ref(false)

const schema = toTypedSchema(
  z
    .object({
      currentPassword: z.string().min(1, t('validation.required')),
      newPassword: z.string().min(8, t('validation.minLength', { min: 8 })),
      confirmPassword: z.string().min(1, t('validation.required')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ['confirmPassword'],
    }),
)

const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema })
const [currentPassword, currentPasswordAttrs] = defineField('currentPassword')
const [newPassword, newPasswordAttrs] = defineField('newPassword')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  submitting.value = true
  try {
    await authStore.changePassword(values)
    success.value = true
    setTimeout(() => navigateTo(authStore.homePath), 1200)
  } catch (error) {
    const err = error as { message?: string }
    serverError.value = err?.message ?? t('common.somethingWentWrong')
  } finally {
    submitting.value = false
  }
})
</script>

<template>
  <div>
    <h1 class="mb-1 text-lg font-semibold text-slate-900">{{ t('auth.changePassword') }}</h1>
    <p class="mb-5 text-sm text-slate-500">{{ t('auth.mustChangePassword') }}</p>

    <div v-if="success" class="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-200">
      {{ t('auth.passwordChanged') }}
    </div>
    <div v-if="serverError" class="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-inset ring-rose-200">
      {{ serverError }}
    </div>

    <form class="space-y-4" @submit="onSubmit">
      <FormInput
        v-model="currentPassword"
        v-bind="currentPasswordAttrs"
        type="password"
        :label="t('auth.currentPassword')"
        :error="errors.currentPassword"
        required
      />
      <FormInput
        v-model="newPassword"
        v-bind="newPasswordAttrs"
        type="password"
        :label="t('auth.newPassword')"
        :error="errors.newPassword"
        required
      />
      <FormInput
        v-model="confirmPassword"
        v-bind="confirmPasswordAttrs"
        type="password"
        :label="t('auth.confirmPassword')"
        :error="errors.confirmPassword"
        required
      />
      <button type="submit" class="btn-primary w-full" :disabled="submitting">
        <Icon v-if="submitting" name="heroicons:arrow-path" class="h-4 w-4 animate-spin" />
        {{ t('common.save') }}
      </button>
    </form>
  </div>
</template>
