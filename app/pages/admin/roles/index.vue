<script setup lang="ts">
import type { Role, PermissionModule, PermissionsGrouped } from '~/types/role'
import type { PermissionAction } from '~/types/common'
import type { DataTableColumn } from '~/components/ui/DataTable.vue'

definePageMeta({ layout: 'admin', permission: { module: 'roles', action: 'VIEW' } })

const { t } = useI18n()

const { data: roles, pending, error, refresh } = await useAsyncData<Role[]>('admin-roles', () => apiFetch<Role[]>('/roles'))

const columns: DataTableColumn[] = [
  { key: 'name', label: t('roles.roleName') },
  { key: 'description', label: t('common.description') },
  { key: 'isSystem', label: t('roles.systemRole'), align: 'center' },
]

// Create / edit role
const showFormModal = ref(false)
const editingRole = ref<Role | null>(null)
const form = reactive({ name: '', nameKhmer: '', description: '' })
const formError = ref('')
const saving = ref(false)

function openCreate() {
  editingRole.value = null
  Object.assign(form, { name: '', nameKhmer: '', description: '' })
  formError.value = ''
  showFormModal.value = true
}

function openEdit(role: Role) {
  editingRole.value = role
  Object.assign(form, { name: role.name, nameKhmer: role.nameKhmer, description: role.description ?? '' })
  formError.value = ''
  showFormModal.value = true
}

async function saveRole() {
  formError.value = ''
  saving.value = true
  try {
    if (editingRole.value) {
      await apiFetch(`/roles/${editingRole.value.id}`, { method: 'PUT', body: form })
    } else {
      await apiFetch('/roles', { method: 'POST', body: form })
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

const confirmDeleteRole = ref<Role | null>(null)
const deleting = ref(false)
async function handleDelete() {
  if (!confirmDeleteRole.value) return
  deleting.value = true
  try {
    await apiFetch(`/roles/${confirmDeleteRole.value.id}`, { method: 'DELETE' })
    confirmDeleteRole.value = null
    await refresh()
  } finally {
    deleting.value = false
  }
}

// Permission matrix
const showPermissionsModal = ref(false)
const permissionsRole = ref<Role | null>(null)
const allModules = ref<PermissionModule[]>([])
const selectedPermissions = ref<Set<string>>(new Set())
const permissionsLoading = ref(false)
const permissionsSaving = ref(false)
const ACTIONS: PermissionAction[] = ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'EXPORT']

function permKey(module: string, action: string) {
  return `${module}:${action}`
}

async function openPermissions(role: Role) {
  permissionsRole.value = role
  showPermissionsModal.value = true
  permissionsLoading.value = true
  try {
    const grouped = await apiFetch<PermissionsGrouped>('/permissions')
    allModules.value = Object.entries(grouped.modules).map(([module, permissions]) => ({
      module,
      actions: permissions.map((p) => p.action),
      permissions,
    }))
    selectedPermissions.value = new Set(role.permissions.map((p) => permKey(p.module, p.action)))
  } finally {
    permissionsLoading.value = false
  }
}

function isChecked(module: string, action: string) {
  return selectedPermissions.value.has(permKey(module, action))
}

function toggle(module: string, action: string) {
  const key = permKey(module, action)
  if (selectedPermissions.value.has(key)) selectedPermissions.value.delete(key)
  else selectedPermissions.value.add(key)
}

function moduleHasAction(mod: PermissionModule, action: string) {
  return mod.actions.includes(action as PermissionAction)
}

async function savePermissions() {
  if (!permissionsRole.value) return
  permissionsSaving.value = true
  try {
    const permissions = Array.from(selectedPermissions.value).map((key) => {
      const [module, action] = key.split(':')
      return { module, action }
    })
    await apiFetch(`/roles/${permissionsRole.value.id}/permissions`, { method: 'PUT', body: { permissions } })
    showPermissionsModal.value = false
    await refresh()
  } finally {
    permissionsSaving.value = false
  }
}
</script>

<template>
  <div>
    <PageHeader :title="t('roles.title')" :subtitle="t('roles.subtitle')">
      <template #actions>
        <PermissionGuard module="roles" action="CREATE">
          <button type="button" class="btn-primary" @click="openCreate">
            <Icon name="heroicons:plus" class="h-4 w-4" />
            {{ t('roles.newRole') }}
          </button>
        </PermissionGuard>
      </template>
    </PageHeader>

    <DataTable :columns="columns" :rows="roles ?? []" :loading="pending" :error="error?.message ?? null" @retry="refresh">
      <template #cell-name="{ row }">
        <div>
          <p class="font-medium text-slate-800">{{ row.name }}</p>
          <p class="text-xs text-slate-500">{{ row.nameKhmer }}</p>
        </div>
      </template>
      <template #cell-isSystem="{ row }">
        <StatusBadge :status="row.isSystem ? t('common.yes') : t('common.no')" :variant="row.isSystem ? 'info' : 'neutral'" />
      </template>
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <button type="button" class="btn-ghost p-1.5!" :title="t('roles.permissionsFor')" @click="openPermissions(row)">
            <Icon name="heroicons:key" class="h-4 w-4" />
          </button>
          <PermissionGuard module="roles" action="UPDATE">
            <button type="button" class="btn-ghost p-1.5!" :title="t('common.edit')" @click="openEdit(row)">
              <Icon name="heroicons:pencil-square" class="h-4 w-4" />
            </button>
          </PermissionGuard>
          <PermissionGuard module="roles" action="DELETE">
            <button
              type="button"
              class="btn-ghost p-1.5!"
              :class="row.isSystem ? 'opacity-30' : 'text-rose-600'"
              :disabled="row.isSystem"
              :title="row.isSystem ? t('roles.cannotDeleteSystemRole') : t('common.delete')"
              @click="confirmDeleteRole = row"
            >
              <Icon name="heroicons:trash" class="h-4 w-4" />
            </button>
          </PermissionGuard>
        </div>
      </template>
    </DataTable>

    <!-- Create / Edit role modal -->
    <Modal v-model="showFormModal" :title="editingRole ? t('roles.editRole') : t('roles.newRole')">
      <div v-if="formError" class="mb-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-inset ring-rose-200">
        {{ formError }}
      </div>
      <form class="space-y-4" @submit.prevent="saveRole">
        <FormInput v-model="form.name" :label="t('roles.roleName')" required />
        <FormInput v-model="form.nameKhmer" :label="t('roles.roleNameKhmer')" required />
        <FormInput v-model="form.description" :label="t('common.description')" />
      </form>
      <template #footer>
        <button type="button" class="btn-secondary" @click="showFormModal = false">{{ t('common.cancel') }}</button>
        <button type="button" class="btn-primary" :disabled="saving" @click="saveRole">
          <Icon v-if="saving" name="heroicons:arrow-path" class="h-4 w-4 animate-spin" />
          {{ t('common.save') }}
        </button>
      </template>
    </Modal>

    <ConfirmDialog
      :model-value="Boolean(confirmDeleteRole)"
      variant="danger"
      :loading="deleting"
      @update:model-value="confirmDeleteRole = null"
      @confirm="handleDelete"
    />

    <!-- Permission matrix modal -->
    <Modal v-model="showPermissionsModal" :title="`${t('roles.permissionsFor')} ${permissionsRole?.name ?? ''}`" size="xl">
      <LoadingState v-if="permissionsLoading" variant="skeleton-rows" :rows="6" />
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead>
            <tr>
              <th class="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('roles.module') }}</th>
              <th v-for="action in ACTIONS" :key="action" class="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                {{ action }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="mod in allModules" :key="mod.module">
              <td class="whitespace-nowrap px-3 py-2 font-medium capitalize text-slate-700">{{ mod.module.replace('_', ' ') }}</td>
              <td v-for="action in ACTIONS" :key="action" class="px-3 py-2 text-center">
                <input
                  v-if="moduleHasAction(mod, action)"
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  :disabled="permissionsRole?.isSystem && permissionsRole?.name === 'admin'"
                  :checked="isChecked(mod.module, action)"
                  @change="toggle(mod.module, action)"
                />
                <span v-else class="text-slate-300">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <template #footer>
        <button type="button" class="btn-secondary" @click="showPermissionsModal = false">{{ t('common.cancel') }}</button>
        <button type="button" class="btn-primary" :disabled="permissionsSaving" @click="savePermissions">
          <Icon v-if="permissionsSaving" name="heroicons:arrow-path" class="h-4 w-4 animate-spin" />
          {{ t('common.save') }}
        </button>
      </template>
    </Modal>
  </div>
</template>
