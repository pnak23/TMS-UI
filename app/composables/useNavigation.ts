export interface NavItem {
  key: string
  labelKey: string
  to: string
  icon: string
  module: string
}

const ADMIN_NAV: NavItem[] = [
  { key: 'dashboard', labelKey: 'nav.dashboard', to: '/admin', icon: 'heroicons:squares-2x2', module: 'dashboard' },
  { key: 'users', labelKey: 'nav.users', to: '/admin/users', icon: 'heroicons:users', module: 'users' },
  { key: 'roles', labelKey: 'nav.rolesPermissions', to: '/admin/roles', icon: 'heroicons:shield-check', module: 'roles' },
  { key: 'school', labelKey: 'nav.schoolManagement', to: '/admin/school', icon: 'heroicons:building-library', module: 'school' },
  { key: 'audit', labelKey: 'nav.auditLogs', to: '/admin/audit-logs', icon: 'heroicons:document-magnifying-glass', module: 'audit_logs' },
]

const TEACHER_NAV: NavItem[] = [
  { key: 'dashboard', labelKey: 'nav.dashboard', to: '/teacher', icon: 'heroicons:squares-2x2', module: 'dashboard' },
]

export function useNavigation() {
  const { can } = usePermission()

  const adminNav = computed(() => ADMIN_NAV.filter((item) => can(item.module, 'VIEW')))
  const teacherNav = computed(() => TEACHER_NAV.filter((item) => can(item.module, 'VIEW')))

  return { adminNav, teacherNav }
}
