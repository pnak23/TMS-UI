<script setup lang="ts">
import type { Paginated } from '~/types/common'
import type { User } from '~/types/auth'
import type { Role } from '~/types/role'
import type { LoginLog } from '~/types/audit'
import type { DataTableColumn } from '~/components/ui/DataTable.vue'

definePageMeta({ layout: 'admin', permission: { module: 'users', action: 'VIEW' } })

const { t, locale } = useI18n()
const { can } = usePermission()

const page = ref(1)
const pageSize = 10
const search = ref('')
const roleFilter = ref('')
const statusFilter = ref('')

const query = computed(() => ({
  page: page.value,
  pageSize,
  search: search.value || undefined,
  roleId: roleFilter.value || undefined,
  isActive: statusFilter.value || undefined,
}))

const { data, pending, error, refresh } = await useAsyncData<Paginated<User>>(
  'admin-users',
  () => apiFetch<Paginated<User>>('/users', { query: query.value }),
  { watch: [query] },
)

const { data: rolesData } = await useAsyncData<Role[]>('roles-for-users', () => apiFetch<Role[]>('/roles'))
const roleOptions = computed(() => (rolesData.value ?? []).map((r) => ({ label: r.nameKhmer ? `${r.name} / ${r.nameKhmer}` : r.name, value: r.id })))

const columns: DataTableColumn[] = [
  { key: 'nameEnglish', label: t('common.name') },
  { key: 'username', label: t('users.username') },
  { key: 'email', label: t('users.email') },
  { key: 'roles', label: t('users.role') },
  { key: 'status', label: t('common.status') },
  { key: 'lastLoginAt', label: t('users.lastLogin') },
]

function formatDate(value: string | null) {
  if (!value) return t('users.never')
  return new Date(value).toLocaleString(locale.value === 'km' ? 'km-KH' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })
}

// Create / edit modal
const showFormModal = ref(false)
const editingUser = ref<User | null>(null)
const form = reactive({
  username: '',
  email: '',
  nameKhmer: '',
  nameEnglish: '',
  password: '',
  roles: [] as string[],
})
const formError = ref('')
const saving = ref(false)

function openCreate() {
  editingUser.value = null
  Object.assign(form, { username: '', email: '', nameKhmer: '', nameEnglish: '', password: '', roles: [] })
  formError.value = ''
  showFormModal.value = true
}

function openEdit(user: User) {
  editingUser.value = user
  Object.assign(form, {
    username: user.username,
    email: user.email,
    nameKhmer: user.nameKhmer,
    nameEnglish: user.nameEnglish,
    password: '',
    roles: user.roles.map((r) => r.id),
  })
  formError.value = ''
  showFormModal.value = true
}

function toggleFormRole(roleId: string) {
  const idx = form.roles.indexOf(roleId)
  if (idx >= 0) form.roles.splice(idx, 1)
  else form.roles.push(roleId)
}

async function saveUser() {
  formError.value = ''
  saving.value = true
  try {
    if (editingUser.value) {
      await apiFetch(`/users/${editingUser.value.id}`, {
        method: 'PUT',
        body: {
          email: form.email,
          nameKhmer: form.nameKhmer,
          nameEnglish: form.nameEnglish,
          roleIds: form.roles,
        },
      })
    } else {
      await apiFetch('/users', {
        method: 'POST',
        body: {
          username: form.username,
          email: form.email,
          nameKhmer: form.nameKhmer,
          nameEnglish: form.nameEnglish,
          password: form.password,
          roleIds: form.roles,
        },
      })
    }
    showFormModal.value = false
    await refresh()
  } catch (error) {
    const err = error as { message?: string }
    formError.value = err?.message ?? t('common.somethingWentWrong')
  } finally {
    saving.value = false
  }
}

// Delete
const confirmDeleteUser = ref<User | null>(null)
const deleting = ref(false)
async function handleDelete() {
  if (!confirmDeleteUser.value) return
  deleting.value = true
  try {
    await apiFetch(`/users/${confirmDeleteUser.value.id}`, { method: 'DELETE' })
    confirmDeleteUser.value = null
    await refresh()
  } finally {
    deleting.value = false
  }
}

// Activate / deactivate / lock / unlock
async function toggleActive(user: User) {
  await apiFetch(`/users/${user.id}/${user.isActive ? 'deactivate' : 'activate'}`, { method: 'POST' })
  await refresh()
}
async function toggleLock(user: User) {
  await apiFetch(`/users/${user.id}/${user.isLocked ? 'unlock' : 'lock'}`, { method: 'POST' })
  await refresh()
}

// Reset password
const resetPasswordResult = ref<{ user: User; tempPassword: string } | null>(null)
async function resetPassword(user: User) {
  const response = await apiFetch<{ tempPassword: string }>(`/users/${user.id}/reset-password`, { method: 'POST' })
  resetPasswordResult.value = { user, tempPassword: response.tempPassword }
}

// Login history
const showHistoryModal = ref(false)
const historyUser = ref<User | null>(null)
const historyLogs = ref<LoginLog[]>([])
const historyLoading = ref(false)
async function viewHistory(user: User) {
  historyUser.value = user
  showHistoryModal.value = true
  historyLoading.value = true
  try {
    const response = await apiFetch<Paginated<LoginLog>>(`/users/${user.id}/login-history`)
    historyLogs.value = response.items
  } finally {
    historyLoading.value = false
  }
}
</script>

<template>
  <div>
    <PageHeader :title="t('users.title')" :subtitle="t('users.subtitle')">
      <template #actions>
        <PermissionGuard module="users" action="CREATE">
          <button type="button" class="btn-primary" @click="openCreate">
            <Icon name="heroicons:plus" class="h-4 w-4" />
            {{ t('users.newUser') }}
          </button>
        </PermissionGuard>
      </template>
    </PageHeader>

    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="sm:w-72">
        <SearchInput v-model="search" />
      </div>
      <select v-model="roleFilter" class="input sm:w-48">
        <option value="">{{ t('common.all') }} — {{ t('users.role') }}</option>
        <option v-for="opt in roleOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
      <select v-model="statusFilter" class="input sm:w-40">
        <option value="">{{ t('common.all') }} — {{ t('common.status') }}</option>
        <option value="true">{{ t('common.active') }}</option>
        <option value="false">{{ t('common.inactive') }}</option>
      </select>
    </div>

    <DataTable
      :columns="columns"
      :rows="data?.items ?? []"
      :loading="pending"
      :error="error?.message ?? null"
      :empty-title="t('common.noResults')"
      :empty-description="t('common.tryAdjustingFilters')"
      @retry="refresh"
    >
      <template #cell-nameEnglish="{ row }">
        <div>
          <p class="font-medium text-slate-800">{{ row.nameEnglish }}</p>
          <p class="text-xs text-slate-500">{{ row.nameKhmer }}</p>
        </div>
      </template>
      <template #cell-roles="{ row }">
        <div class="flex flex-wrap gap-1">
          <span v-for="role in row.roles" :key="role.id" class="badge bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200">
            {{ role.name }}
          </span>
        </div>
      </template>
      <template #cell-status="{ row }">
        <div class="flex gap-1">
          <StatusBadge :status="row.isActive ? t('common.active') : t('common.inactive')" :variant="row.isActive ? 'success' : 'neutral'" />
          <StatusBadge v-if="row.isLocked" :status="t('users.statusLocked')" variant="danger" />
        </div>
      </template>
      <template #cell-lastLoginAt="{ row }">
        {{ formatDate(row.lastLoginAt) }}
      </template>
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <PermissionGuard module="users" action="UPDATE">
            <button type="button" class="btn-ghost p-1.5!" :title="t('common.edit')" @click="openEdit(row)">
              <Icon name="heroicons:pencil-square" class="h-4 w-4" />
            </button>
            <button type="button" class="btn-ghost p-1.5!" :title="row.isActive ? t('users.deactivate') : t('users.activate')" @click="toggleActive(row)">
              <Icon :name="row.isActive ? 'heroicons:no-symbol' : 'heroicons:check-circle'" class="h-4 w-4" />
            </button>
            <button type="button" class="btn-ghost p-1.5!" :title="row.isLocked ? t('users.unlock') : t('users.lock')" @click="toggleLock(row)">
              <Icon :name="row.isLocked ? 'heroicons:lock-open' : 'heroicons:lock-closed'" class="h-4 w-4" />
            </button>
            <button type="button" class="btn-ghost p-1.5!" :title="t('users.resetPassword')" @click="resetPassword(row)">
              <Icon name="heroicons:key" class="h-4 w-4" />
            </button>
          </PermissionGuard>
          <button type="button" class="btn-ghost p-1.5!" :title="t('users.viewLoginHistory')" @click="viewHistory(row)">
            <Icon name="heroicons:clock" class="h-4 w-4" />
          </button>
          <PermissionGuard module="users" action="DELETE">
            <button type="button" class="btn-ghost p-1.5! text-rose-600" :title="t('common.delete')" @click="confirmDeleteUser = row">
              <Icon name="heroicons:trash" class="h-4 w-4" />
            </button>
          </PermissionGuard>
        </div>
      </template>
      <template #footer>
        <Pagination v-if="data" :page="page" :page-size="pageSize" :total="data.total" @update:page="page = $event" />
      </template>
    </DataTable>

    <!-- Create / Edit modal -->
    <Modal v-model="showFormModal" :title="editingUser ? t('users.editUser') : t('users.newUser')" size="lg">
      <div v-if="formError" class="mb-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-inset ring-rose-200">
        {{ formError }}
      </div>
      <form class="grid grid-cols-1 gap-4 sm:grid-cols-2" @submit.prevent="saveUser">
        <FormInput v-model="form.nameEnglish" :label="t('users.englishName')" required />
        <FormInput v-model="form.nameKhmer" :label="t('users.khmerName')" required />
        <FormInput v-model="form.username" :label="t('users.username')" :disabled="Boolean(editingUser)" required />
        <FormInput v-model="form.email" type="email" :label="t('users.email')" required />
        <FormInput v-if="!editingUser" v-model="form.password" type="password" :label="t('auth.password')" required />
        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm font-medium text-slate-700">{{ t('users.roles') }}</label>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="opt in roleOptions"
              :key="opt.value"
              class="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-sm"
              :class="form.roles.includes(opt.value) ? 'border-brand-400 bg-brand-50 text-brand-700' : 'text-slate-600'"
            >
              <input type="checkbox" class="hidden" :checked="form.roles.includes(opt.value)" @change="toggleFormRole(opt.value)" />
              {{ opt.label }}
            </label>
          </div>
        </div>
      </form>
      <template #footer>
        <button type="button" class="btn-secondary" @click="showFormModal = false">{{ t('common.cancel') }}</button>
        <button type="button" class="btn-primary" :disabled="saving" @click="saveUser">
          <Icon v-if="saving" name="heroicons:arrow-path" class="h-4 w-4 animate-spin" />
          {{ t('common.save') }}
        </button>
      </template>
    </Modal>

    <!-- Delete confirm -->
    <ConfirmDialog
      :model-value="Boolean(confirmDeleteUser)"
      variant="danger"
      :loading="deleting"
      @update:model-value="confirmDeleteUser = null"
      @confirm="handleDelete"
    />

    <!-- Reset password result -->
    <Modal :model-value="Boolean(resetPasswordResult)" :title="t('users.temporaryPassword')" size="sm" @update:model-value="resetPasswordResult = null">
      <p class="mb-2 text-sm text-slate-600">{{ resetPasswordResult?.user.username }}</p>
      <p class="rounded-md bg-slate-100 px-3 py-2 font-mono text-sm text-slate-800">{{ resetPasswordResult?.tempPassword }}</p>
      <template #footer>
        <button type="button" class="btn-primary" @click="resetPasswordResult = null">{{ t('common.close') }}</button>
      </template>
    </Modal>

    <!-- Login history -->
    <Modal v-model="showHistoryModal" :title="t('users.loginHistory')" size="lg">
      <LoadingState v-if="historyLoading" variant="skeleton-rows" :rows="5" />
      <EmptyState v-else-if="!historyLogs.length" />
      <ul v-else class="divide-y divide-slate-100">
        <li v-for="log in historyLogs" :key="log.id" class="flex items-center justify-between gap-3 py-2 text-sm">
          <div class="flex items-center gap-2">
            <StatusBadge :status="log.success ? 'active' : 'rejected'" :variant="log.success ? 'success' : 'danger'" />
            <span class="text-slate-500">{{ log.ipAddress }}</span>
          </div>
          <span class="text-xs text-slate-400">{{ formatDate(log.createdAt) }}</span>
        </li>
      </ul>
    </Modal>
  </div>
</template>
