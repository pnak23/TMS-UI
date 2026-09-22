<script setup lang="ts">
import type { NavItem } from '~/composables/useNavigation'

const props = defineProps<{ navItems: NavItem[] }>()
void props

const authStore = useAuthStore()
const { t } = useI18n()
const route = useRoute()
const sidebarOpen = ref(false)
const userMenuOpen = ref(false)

const displayName = computed(() => authStore.user?.nameEnglish || authStore.user?.username || '')

function isActive(to: string) {
  return to === '/admin' || to === '/teacher' ? route.path === to : route.path.startsWith(to)
}

async function handleLogout() {
  userMenuOpen.value = false
  await authStore.logout()
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- Mobile overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" @click="sidebarOpen = false" />

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-14 items-center gap-2 border-b border-slate-200 px-4">
        <div class="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-sm font-bold text-white">
          {{ t('app.name') }}
        </div>
        <span class="text-sm font-semibold text-slate-800">{{ t('app.fullName') }}</span>
      </div>
      <nav class="flex flex-col gap-0.5 p-3">
        <NuxtLink
          v-for="item in navItems"
          :key="item.key"
          :to="item.to"
          class="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors"
          :class="isActive(item.to) ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'"
          @click="sidebarOpen = false"
        >
          <Icon :name="item.icon" class="h-5 w-5 shrink-0" />
          {{ t(item.labelKey) }}
        </NuxtLink>
      </nav>
    </aside>

    <div class="flex min-h-screen flex-1 flex-col lg:pl-0">
      <!-- Topbar -->
      <header class="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4">
        <div class="flex items-center gap-2">
          <button type="button" class="btn-ghost p-1.5! lg:hidden" @click="sidebarOpen = true">
            <Icon name="heroicons:bars-3" class="h-5 w-5" />
          </button>
          <slot name="page-title" />
        </div>
        <div class="flex items-center gap-1.5">
          <LocaleSwitcher />
          <div class="relative">
            <button type="button" class="btn-ghost" @click="userMenuOpen = !userMenuOpen">
              <span class="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                {{ displayName.slice(0, 1).toUpperCase() }}
              </span>
              <span class="hidden text-sm font-medium sm:inline">{{ displayName }}</span>
              <Icon name="heroicons:chevron-down" class="h-4 w-4" />
            </button>
            <div
              v-if="userMenuOpen"
              class="absolute right-0 top-full z-30 mt-1 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg"
              @click="userMenuOpen = false"
            >
              <NuxtLink to="/profile" class="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                <Icon name="heroicons:user-circle" class="h-4 w-4" />
                {{ t('nav.profile') }}
              </NuxtLink>
              <button type="button" class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50" @click="handleLogout">
                <Icon name="heroicons:arrow-right-start-on-rectangle" class="h-4 w-4" />
                {{ t('nav.logout') }}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 sm:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
