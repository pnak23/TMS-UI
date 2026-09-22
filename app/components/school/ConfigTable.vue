<script setup lang="ts" generic="T extends { id: string; [key: string]: any }">
import type { Ref } from 'vue'
import type { DataTableColumn } from '~/components/ui/DataTable.vue'
import type { SelectOption } from '~/components/ui/FormSelect.vue'
import type { Paginated } from '~/types/common'

export interface ConfigField {
  key: string
  label: string
  type?: 'text' | 'number' | 'date' | 'select' | 'checkbox'
  required?: boolean
  options?: SelectOption[]
}

const props = defineProps<{
  endpoint: string
  columns: DataTableColumn[]
  fields: ConfigField[]
  title: string
  newLabel: string
}>()

const { t } = useI18n()
const { can } = usePermission()

const { data, pending, error, refresh } = await useAsyncData<T[]>(`config-${props.endpoint}`, async () => {
  const response = await apiFetch<Paginated<T>>(props.endpoint, { query: { pageSize: 200 } })
  return response.items
})

const showFormModal = ref(false)
const editing: Ref<T | null> = shallowRef(null) as Ref<T | null>
const form = reactive<Record<string, unknown>>({})
const formError = ref('')
const saving = ref(false)

function defaultsFor(fields: ConfigField[]) {
  const obj: Record<string, unknown> = {}
  for (const f of fields) obj[f.key] = f.type === 'checkbox' ? false : ''
  return obj
}

function openCreate() {
  editing.value = null
  Object.assign(form, defaultsFor(props.fields))
  formError.value = ''
  showFormModal.value = true
}

function openEdit(row: T) {
  editing.value = row
  Object.assign(form, defaultsFor(props.fields), row)
  formError.value = ''
  showFormModal.value = true
}

async function save() {
  formError.value = ''
  saving.value = true
  try {
    const body = { ...form }
    if (editing.value) {
      await apiFetch(`${props.endpoint}/${editing.value.id}`, { method: 'PUT', body })
    } else {
      await apiFetch(props.endpoint, { method: 'POST', body })
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

const confirmDelete: Ref<T | null> = shallowRef(null) as Ref<T | null>
const deleting = ref(false)
async function handleDelete() {
  if (!confirmDelete.value) return
  deleting.value = true
  try {
    await apiFetch(`${props.endpoint}/${confirmDelete.value.id}`, { method: 'DELETE' })
    confirmDelete.value = null
    await refresh()
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-sm font-semibold text-slate-700">{{ title }}</h2>
      <button v-if="can(endpoint.split('/')[1] ?? 'school', 'CREATE')" type="button" class="btn-primary py-1.5! text-xs!" @click="openCreate">
        <Icon name="heroicons:plus" class="h-3.5 w-3.5" />
        {{ newLabel }}
      </button>
    </div>

    <DataTable :columns="columns" :rows="data ?? []" :loading="pending" :error="error?.message ?? null" @retry="refresh">
      <template v-for="field in fields" :key="field.key" #[`cell-${field.key}`]="{ value }">
        <span v-if="field.type === 'checkbox'">{{ value ? t('common.yes') : t('common.no') }}</span>
        <span v-else>{{ value }}</span>
      </template>
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <button type="button" class="btn-ghost p-1.5!" @click="openEdit(row)">
            <Icon name="heroicons:pencil-square" class="h-4 w-4" />
          </button>
          <button type="button" class="btn-ghost p-1.5! text-rose-600" @click="confirmDelete = row">
            <Icon name="heroicons:trash" class="h-4 w-4" />
          </button>
        </div>
      </template>
    </DataTable>

    <Modal v-model="showFormModal" :title="editing ? t('common.edit') : newLabel">
      <div v-if="formError" class="mb-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-inset ring-rose-200">
        {{ formError }}
      </div>
      <form class="space-y-4" @submit.prevent="save">
        <div v-for="field in fields" :key="field.key">
          <FormSelect
            v-if="field.type === 'select'"
            v-model="form[field.key] as string"
            :label="field.label"
            :options="field.options ?? []"
            :required="field.required"
          />
          <label v-else-if="field.type === 'checkbox'" class="flex items-center gap-2 text-sm font-medium text-slate-700">
            <input v-model="form[field.key]" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            {{ field.label }}
          </label>
          <FormInput
            v-else
            v-model="form[field.key] as string"
            :type="field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'"
            :label="field.label"
            :required="field.required"
          />
        </div>
      </form>
      <template #footer>
        <button type="button" class="btn-secondary" @click="showFormModal = false">{{ t('common.cancel') }}</button>
        <button type="button" class="btn-primary" :disabled="saving" @click="save">
          <Icon v-if="saving" name="heroicons:arrow-path" class="h-4 w-4 animate-spin" />
          {{ t('common.save') }}
        </button>
      </template>
    </Modal>

    <ConfirmDialog
      :model-value="Boolean(confirmDelete)"
      variant="danger"
      :loading="deleting"
      @update:model-value="confirmDelete = null"
      @confirm="handleDelete"
    />
  </div>
</template>
