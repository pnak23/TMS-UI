import type { PermissionAction } from './common'

declare module 'vue-router' {
  interface RouteMeta {
    permission?: {
      module: string
      action?: PermissionAction
    }
  }
}

export {}
