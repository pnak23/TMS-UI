import type { PermissionAction } from '~/types/common'

export default defineNuxtRouteMiddleware((to) => {
  const required = to.meta.permission as { module: string; action?: PermissionAction } | undefined
  if (!required) return

  const authStore = useAuthStore()
  if (!authStore.hasPermission(required.module, required.action ?? 'VIEW')) {
    return navigateTo('/403')
  }
})
