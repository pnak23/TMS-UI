const PUBLIC_ROUTES = new Set(['/login'])

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (PUBLIC_ROUTES.has(to.path)) {
    if (authStore.isAuthenticated && to.path === '/login') {
      const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : authStore.homePath
      return navigateTo(redirect)
    }
    return
  }

  if (!authStore.isAuthenticated) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (authStore.user?.mustChangePassword && to.path !== '/change-password') {
    return navigateTo('/change-password')
  }

  if (to.path.startsWith('/admin') && !authStore.isAdmin) {
    return navigateTo('/teacher')
  }
})
