import { defineStore } from 'pinia'
import type { LoginCredentials, LoginResponse, MeResponse, ChangePasswordPayload } from '~/types/auth'
import type { PermissionAction } from '~/types/common'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: MeResponse | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    refreshToken: null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken && state.user),
    permissions: (state) => state.user?.permissions ?? [],
    hasPermission: (state) => (module: string, action: PermissionAction) =>
      Boolean(state.user?.permissions?.some((p) => p.module === module && p.action === action)),
    hasRole: (state) => (roleName: string) =>
      Boolean(state.user?.roles?.some((r) => r.name === roleName)),
    isAdmin(): boolean {
      return this.hasRole('admin')
    },
    homePath(): string {
      return this.isAdmin ? '/admin' : '/teacher'
    },
  },

  actions: {
    setAccessToken(token: string) {
      this.accessToken = token
    },

    clearSession() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
    },

    async login(credentials: LoginCredentials) {
      const response = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: { username: credentials.username, password: credentials.password },
        skipAuth: true,
      })
      this.accessToken = response.accessToken
      this.refreshToken = response.refreshToken
      await this.fetchMe()
      return this.user
    },

    async fetchMe() {
      this.user = await apiFetch<MeResponse>('/auth/me')
      return this.user
    },

    async changePassword(payload: ChangePasswordPayload) {
      await apiFetch('/auth/change-password', { method: 'POST', body: payload })
      if (this.user) this.user.mustChangePassword = false
    },

    async logout() {
      try {
        if (this.refreshToken) {
          await apiFetch('/auth/logout', { method: 'POST', body: { refreshToken: this.refreshToken } })
        }
      } catch {
        // ignore network errors on logout, clear local session regardless
      }
      this.clearSession()
      await navigateTo('/login')
    },
  },

  persist: {
    paths: ['accessToken', 'refreshToken'],
    storage: {
      getItem: (key) => {
        try {
          return useCookie<string | null>(key, { decode: (v) => (v ? decodeURIComponent(v) : null), encode: (v) => encodeURIComponent(v ?? '') }).value ?? null
        } catch {
          return null
        }
      },
      setItem: (key, value) => {
        try {
          useCookie<string | null>(key, {
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            decode: (v) => (v ? decodeURIComponent(v) : null),
            encode: (v) => encodeURIComponent(v ?? ''),
          }).value = value
        } catch {
          // Writing back during a detached SSR subscription (e.g. hydration replaying
          // the same value) can lose Nuxt's request context — safe to ignore since the
          // client-side write on the next real mutation (login/logout) will succeed.
        }
      },
    },
  },
})
