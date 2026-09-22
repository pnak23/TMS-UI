<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const available = computed(() => locales.value as { code: string; name: string }[])

function toggle() {
  const currentIndex = available.value.findIndex((l) => l.code === locale.value)
  const next = available.value[(currentIndex + 1) % available.value.length]
  if (next) setLocale(next.code as 'en' | 'km')
}
</script>

<template>
  <button type="button" class="btn-ghost" @click="toggle">
    <Icon name="heroicons:language" class="h-4 w-4" />
    <span class="text-sm font-medium">{{ available.find((l) => l.code === locale)?.name }}</span>
  </button>
</template>
