<script setup lang="ts">
const props = defineProps<{ role: string }>()

const authStore = useAuthStore()
const allowed = computed(() => authStore.hasRole(props.role))
</script>

<template>
  <slot v-if="allowed" />
</template>
