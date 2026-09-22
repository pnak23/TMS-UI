import type { PermissionAction } from '~/types/common'

export function usePermission() {
  const authStore = useAuthStore()

  function can(module: string, action: PermissionAction = 'VIEW'): boolean {
    return authStore.hasPermission(module, action)
  }

  function canAny(module: string, actions: PermissionAction[]): boolean {
    return actions.some((action) => can(module, action))
  }

  return { can, canAny }
}
