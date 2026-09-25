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
  if (t.closest('input, textarea, [contenteditable], .cm-editor')) return
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
  padding: 6px 8px;
  border-radius: 999px;
  background: #fde047;
  color: #111;
  font: 600 13px/1 ui-monospace, monospace;
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.35);
}
.ps button {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #111;
  color: #fde047;
}
</style>
