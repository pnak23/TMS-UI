import type { PermissionAction } from './common'
import type { Role } from './role'

export interface User {
  id: string
  username: string
  email: string
  nameKhmer: string
  nameEnglish: string
  isActive: boolean
  isLocked: boolean
  mustChangePassword: boolean
  lastLoginAt: string | null
  roles: Role[]
  createdAt: string
  updatedAt: string
}

export interface EffectivePermission {
  module: string
  action: PermissionAction
}

export interface LoginCredentials {
  username: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface MeResponse extends User {
  permissions: EffectivePermission[]
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}
