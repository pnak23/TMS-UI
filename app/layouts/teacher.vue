<script setup lang="ts">
const { teacherNav } = useNavigation()
</script>

<template>
  <AppShell :nav-items="teacherNav">
    <slot />
  </AppShell>
</template>
