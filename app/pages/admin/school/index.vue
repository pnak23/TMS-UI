<script setup lang="ts">
import type { School, AcademicYear } from '~/types/school'
import type { Paginated } from '~/types/common'

definePageMeta({ layout: 'admin', permission: { module: 'school', action: 'VIEW' } })

const { t } = useI18n()
const { can } = usePermission()

const activeTab = ref('profile')
const tabs = [
  { key: 'profile', label: t('school.profile') },
  { key: 'academic-years', label: t('school.academicYears') },
  { key: 'terms', label: t('school.terms') },
  { key: 'departments', label: t('school.departments') },
  { key: 'grades', label: t('school.grades') },
  { key: 'rooms', label: t('school.rooms') },
]

// Profile tab
const { data: school, refresh: refreshSchool } = await useAsyncData<School>('school-profile', () => apiFetch<School>('/school'))
const profileForm = reactive({
  nameKhmer: '',
  nameEnglish: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  description: '',
})
watchEffect(() => {
  if (school.value) Object.assign(profileForm, school.value)
})
const savingProfile = ref(false)
const profileSaved = ref(false)
async function saveProfile() {
  savingProfile.value = true
  profileSaved.value = false
  try {
    await apiFetch('/school', { method: 'PUT', body: profileForm })
    profileSaved.value = true
    await refreshSchool()
    setTimeout(() => (profileSaved.value = false), 2500)
  } finally {
    savingProfile.value = false
  }
}

// Academic years needed as select options for Terms tab
const { data: academicYears } = await useAsyncData<AcademicYear[]>('school-academic-years-options', async () => {
  const response = await apiFetch<Paginated<AcademicYear>>('/school/academic-years', { query: { pageSize: 200 } })
  return response.items
})
const academicYearOptions = computed(() => (academicYears.value ?? []).map((y) => ({ label: y.name, value: y.id })))
</script>

<template>
  <div>
    <PageHeader :title="t('school.title')" />

    <Tabs v-model="activeTab" :tabs="tabs">
      <div v-if="activeTab === 'profile'" class="card max-w-2xl p-5">
        <form class="grid grid-cols-1 gap-4 sm:grid-cols-2" @submit.prevent="saveProfile">
          <FormInput v-model="profileForm.nameEnglish" :label="t('school.nameEnglish')" required />
          <FormInput v-model="profileForm.nameKhmer" :label="t('school.nameKhmer')" required />
          <FormInput v-model="profileForm.phone" :label="t('school.phone')" />
          <FormInput v-model="profileForm.email" type="email" :label="t('school.email')" />
          <FormInput v-model="profileForm.website" :label="t('school.website')" />
          <FormInput v-model="profileForm.address" :label="t('school.address')" />
          <div class="sm:col-span-2">
            <label class="mb-1 block text-sm font-medium text-slate-700">{{ t('school.schoolDescription') }}</label>
            <textarea v-model="profileForm.description" rows="3" class="input" />
          </div>
        </form>
        <div class="mt-4 flex items-center gap-3">
          <button
            v-if="can('school', 'UPDATE')"
            type="button"
            class="btn-primary"
            :disabled="savingProfile"
            @click="saveProfile"
          >
            <Icon v-if="savingProfile" name="heroicons:arrow-path" class="h-4 w-4 animate-spin" />
            {{ t('common.saveChanges') }}
          </button>
          <span v-if="profileSaved" class="text-sm text-emerald-600">{{ t('school.saveSuccess') }}</span>
        </div>
      </div>

      <ConfigTable
        v-else-if="activeTab === 'academic-years'"
        endpoint="/school/academic-years"
        :title="t('school.academicYears')"
        :new-label="t('school.newAcademicYear')"
        :columns="[
          { key: 'name', label: t('common.name') },
          { key: 'startDate', label: t('school.startDate') },
          { key: 'endDate', label: t('school.endDate') },
          { key: 'isCurrent', label: t('school.isCurrent'), align: 'center' },
        ]"
        :fields="[
          { key: 'name', label: t('common.name'), required: true },
          { key: 'startDate', label: t('school.startDate'), type: 'date', required: true },
          { key: 'endDate', label: t('school.endDate'), type: 'date', required: true },
          { key: 'isCurrent', label: t('school.isCurrent'), type: 'checkbox' },
        ]"
      />

      <ConfigTable
        v-else-if="activeTab === 'terms'"
        endpoint="/school/terms"
        :title="t('school.terms')"
        :new-label="t('school.newTerm')"
        :columns="[
          { key: 'name', label: t('common.name') },
          { key: 'startDate', label: t('school.startDate') },
          { key: 'endDate', label: t('school.endDate') },
          { key: 'isCurrent', label: t('school.isCurrent'), align: 'center' },
        ]"
        :fields="[
          { key: 'name', label: t('common.name'), required: true },
          { key: 'academicYearId', label: t('school.academicYears'), type: 'select', options: academicYearOptions, required: true },
          { key: 'startDate', label: t('school.startDate'), type: 'date', required: true },
          { key: 'endDate', label: t('school.endDate'), type: 'date', required: true },
          { key: 'isCurrent', label: t('school.isCurrent'), type: 'checkbox' },
        ]"
      />

      <ConfigTable
        v-else-if="activeTab === 'departments'"
        endpoint="/school/departments"
        :title="t('school.departments')"
        :new-label="t('school.newDepartment')"
        :columns="[
          { key: 'nameEnglish', label: t('common.nameEnglish') },
          { key: 'nameKhmer', label: t('common.nameKhmer') },
        ]"
        :fields="[
          { key: 'nameEnglish', label: t('common.nameEnglish'), required: true },
          { key: 'nameKhmer', label: t('common.nameKhmer'), required: true },
          { key: 'description', label: t('common.description') },
        ]"
      />

      <ConfigTable
        v-else-if="activeTab === 'grades'"
        endpoint="/school/grades"
        :title="t('school.grades')"
        :new-label="t('school.newGrade')"
        :columns="[
          { key: 'nameEnglish', label: t('common.nameEnglish') },
          { key: 'nameKhmer', label: t('common.nameKhmer') },
          { key: 'level', label: t('common.name'), align: 'center' },
        ]"
        :fields="[
          { key: 'nameEnglish', label: t('common.nameEnglish'), required: true },
          { key: 'nameKhmer', label: t('common.nameKhmer'), required: true },
          { key: 'level', label: 'Level', type: 'number', required: true },
        ]"
      />

      <ConfigTable
        v-else-if="activeTab === 'rooms'"
        endpoint="/school/rooms"
        :title="t('school.rooms')"
        :new-label="t('school.newRoom')"
        :columns="[
          { key: 'name', label: t('common.name') },
          { key: 'building', label: 'Building' },
          { key: 'capacity', label: 'Capacity', align: 'center' },
        ]"
        :fields="[
          { key: 'name', label: t('common.name'), required: true },
          { key: 'building', label: 'Building' },
          { key: 'capacity', label: 'Capacity', type: 'number' },
        ]"
      />
    </Tabs>
  </div>
</template>
