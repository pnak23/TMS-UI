import { keysToCamel, keysToSnake } from '~/utils/caseConverter'
import type { ApiError } from '~/types/common'

interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Record<string, unknown>
  skipAuth?: boolean
  skipCamelCase?: boolean
}

let refreshPromise: Promise<string | null> | null = null

function normalizeError(error: unknown): ApiError {
  const err = error as { data?: { message?: string; detail?: unknown }; message?: string; statusCode?: number }
  const detail = err?.data?.detail
  let message = err?.data?.message || err?.message || 'errors.serverError'
  if (typeof detail === 'string') message = detail
  else if (Array.isArray(detail) && detail[0]?.msg) message = detail[0].msg
  return { message, code: String(err?.statusCode ?? '') }
}

export async function apiFetch<T = unknown>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const headers: Record<string, string> = {}
  if (!options.skipAuth && authStore.accessToken) {
    headers.Authorization = `Bearer ${authStore.accessToken}`
  }

  const body = options.body && !options.skipCamelCase ? keysToSnake(options.body) : options.body
  const query = options.query ? keysToSnake(options.query) : undefined

  try {
    const response = await $fetch<unknown>(path, {
      baseURL: config.public.apiBase,
      method: options.method ?? 'GET',
      headers,
      body: body as Record<string, unknown> | undefined,
      query: query as Record<string, unknown> | undefined,
    })
    return options.skipCamelCase ? (response as T) : keysToCamel<T>(response)
  } catch (error: unknown) {
    const err = error as { statusCode?: number }
    if (err?.statusCode === 401 && !options.skipAuth && authStore.refreshToken) {
      const newToken = await refreshAccessTokenOnce()
      if (newToken) {
        return apiFetch<T>(path, options)
      }
      authStore.clearSession()
      await navigateTo('/login')
    }
    throw normalizeError(error)
  }
}

function refreshAccessTokenOnce(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

async function doRefresh(): Promise<string | null> {
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  try {
    const response = await $fetch<{ access_token: string }>('/auth/refresh', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: { refresh_token: authStore.refreshToken },
    })
    authStore.setAccessToken(response.access_token)
    return response.access_token
  } catch {
    return null
  }
}

export function useApi() {
  return { apiFetch }
}
