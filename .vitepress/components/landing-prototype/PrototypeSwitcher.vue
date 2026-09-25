<!-- PROTOTYPE (throwaway): floating bar to flip between variants. ← → keys cycle too. -->
<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps<{ variants: { key: string; name: string }[]; current: string }>()
const emit = defineEmits<{ change: [key: string] }>()

function step(dir: number) {
  const i = props.variants.findIndex(v => v.key === props.current)
  emit('change', props.variants[(i + dir + props.variants.length) % props.variants.length].key)
}

function onKey(e: KeyboardEvent) {
  const t = e.target as HTMLElement
  if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || t.closest('input, textarea, select, button, [role="tablist"], [contenteditable], .cm-editor')) return
  if (e.key === 'ArrowLeft') step(-1)
  if (e.key === 'ArrowRight') step(1)
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="ps" role="toolbar" aria-label="Prototype variants">
    <button type="button" aria-label="Previous variant" @click="step(-1)">&larr;</button>
    <span>{{ current }}: {{ variants.find(v => v.key === current)?.name }}</span>
    <button type="button" aria-label="Next variant" @click="step(1)">&rarr;</button>
  </div>
</template>

<style scoped>
.ps {
  position: fixed;
  left: 50%;
  bottom: 20px;
  z-index: 100;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: calc(100vw - 24px);
  width: max-content;
  padding: 6px 8px;
  border-radius: 999px;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  font: 600 13px/1 ui-monospace, monospace;
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.35);
}
.ps button {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}
.ps span { line-height: 1.4; text-align: center; }
</style>
