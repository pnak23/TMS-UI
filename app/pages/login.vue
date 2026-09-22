<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const authStore = useAuthStore()
const route = useRoute()
const serverError = ref('')
const submitting = ref(false)

const schema = toTypedSchema(
  z.object({
    username: z.string().min(1, t('validation.required')),
    password: z.string().min(1, t('validation.required')),
  }),
)

const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema })
const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  submitting.value = true
  try {
    const user = await authStore.login(values)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
    if (user?.mustChangePassword) {
      await navigateTo('/change-password')
    } else {
      await navigateTo(redirect || authStore.homePath)
    }
  } catch (error) {
    const err = error as { message?: string }
    serverError.value = err?.message?.includes('401') || !err?.message ? t('auth.invalidCredentials') : err.message
  } finally {
    submitting.value = false
  }
})
</script>

<template>
  <div>
    <h1 class="mb-1 text-lg font-semibold text-slate-900">{{ t('auth.loginTitle') }}</h1>
    <p class="mb-5 text-sm text-slate-500">{{ t('auth.loginSubtitle') }}</p>

    <div v-if="serverError" class="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-inset ring-rose-200">
      {{ serverError }}
    </div>

    <form class="space-y-4" @submit="onSubmit">
      <FormInput
        v-model="username"
        v-bind="usernameAttrs"
        :label="t('auth.usernameOrEmail')"
        :error="errors.username"
        required
      />
      <FormInput
        v-model="password"
        v-bind="passwordAttrs"
        type="password"
        :label="t('auth.password')"
        :error="errors.password"
        required
      />
      <button type="submit" class="btn-primary w-full" :disabled="submitting">
        <Icon v-if="submitting" name="heroicons:arrow-path" class="h-4 w-4 animate-spin" />
        {{ submitting ? t('auth.loggingIn') : t('auth.loginButton') }}
      </button>
    </form>
  </div>
</template>
