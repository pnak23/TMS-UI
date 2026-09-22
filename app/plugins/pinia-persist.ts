import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { Pinia } from 'pinia'

export default defineNuxtPlugin({
  name: 'pinia-persist-and-auth-init',
  async setup({ $pinia }) {
    ;($pinia as Pinia).use(piniaPluginPersistedstate)

    const authStore = useAuthStore()
    if (authStore.accessToken && !authStore.user) {
      try {
        await authStore.fetchMe()
      } catch {
        authStore.clearSession()
      }
    }
  },
})
