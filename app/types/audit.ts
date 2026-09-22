export interface AuditLog {
  id: string
  userId: string | null
  action: string
  module: string
  targetType: string | null
  targetId: string | null
  description: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

export interface LoginLog {
  id: string
  userId: string | null
  usernameAttempted: string
  success: boolean
  ipAddress: string | null
  userAgent: string | null
  failureReason: string | null
  createdAt: string
}
