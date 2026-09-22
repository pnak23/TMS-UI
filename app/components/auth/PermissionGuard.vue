<script setup lang="ts">
import type { PermissionAction } from '~/types/common'

const props = withDefaults(
  defineProps<{
    module: string
    action?: PermissionAction
  }>(),
  { action: 'VIEW' },
)

const { can } = usePermission()
const allowed = computed(() => can(props.module, props.action))
</script>

<template>
  <slot v-if="allowed" />
</template>
