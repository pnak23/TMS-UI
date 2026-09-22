<script setup lang="ts">
const { adminNav } = useNavigation()
</script>

<template>
  <AppShell :nav-items="adminNav">
    <slot />
  </AppShell>
</template>
