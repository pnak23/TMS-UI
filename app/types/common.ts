export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  pages: number
}

export interface PageQuery {
  page?: number
  pageSize?: number
  search?: string
  [key: string]: string | number | boolean | undefined
}

export type PermissionAction = 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'EXPORT'

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, string[]>
}
