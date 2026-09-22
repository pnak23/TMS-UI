import type { PermissionAction } from './common'

export interface Permission {
  id: string
  module: string
  action: PermissionAction
}

export interface Role {
  id: string
  name: string
  nameKhmer: string | null
  description: string | null
  isSystem: boolean
  permissions: Permission[]
}

export interface PermissionsGrouped {
  modules: Record<string, Permission[]>
}

export interface PermissionModule {
  module: string
  actions: PermissionAction[]
  permissions: Permission[]
}

export interface RolePayload {
  name: string
  nameKhmer: string
  description?: string
}
