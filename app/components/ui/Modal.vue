<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  { title: undefined, size: 'md' },
)

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

function close() {
  emit('update:modelValue', false)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/50" @click="close" />
        <div
          class="relative w-full rounded-lg bg-white shadow-xl"
          :class="sizeClasses[size]"
          role="dialog"
          aria-modal="true"
        >
          <div v-if="title || $slots.header" class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <slot name="header">
              <h2 class="text-base font-semibold text-slate-900">{{ title }}</h2>
            </slot>
            <button type="button" class="btn-ghost p-1.5!" @click="close">
              <Icon name="heroicons:x-mark" class="h-5 w-5" />
            </button>
          </div>
          <div class="max-h-[70vh] overflow-y-auto px-5 py-4">
            <slot />
          </div>
          <div v-if="$slots.footer" class="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
