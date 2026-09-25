<!-- Static JS highlighted with CodeMirror's parser; plain text until mounted. -->
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{ code: string }>()
const el = ref<HTMLElement>()
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

async function paint() {
  const [{ highlightCode, classHighlighter }, { javascriptLanguage }] = await Promise.all([
    import('@lezer/highlight'), import('@codemirror/lang-javascript'),
  ])
  const parser = javascriptLanguage.parser
  let out = ''
  highlightCode(props.code, parser.parse(props.code), classHighlighter,
    (text, cls) => { out += cls ? `<span class="${cls}">${esc(text)}</span>` : esc(text) },
    () => { out += '\n' })
  if (el.value) el.value.innerHTML = out // unmounted while the parser loaded
}

onMounted(paint)
watch(() => props.code, paint)
</script>

<template>
  <pre class="cb"><code ref="el">{{ code }}</code></pre>
</template>

<style scoped>
.cb {
  margin: 0;
  overflow-x: auto;
  font-family: var(--cp-mono);
  font-size: 13px;
  line-height: 1.7;
  color: var(--cp-fg);
}
.cb :deep(.tok-comment) { color: var(--cp-dim); font-style: italic; }
.cb :deep(.tok-keyword) { color: var(--cp-kw); }
.cb :deep(.tok-string), .cb :deep(.tok-string2) { color: var(--cp-str); }
.cb :deep(.tok-number) { color: var(--cp-num); }
.cb :deep(.tok-propertyName) { color: var(--cp-prop); }
.cb :deep(.tok-className), .cb :deep(.tok-typeName), .cb :deep(.tok-labelName) { color: var(--cp-sel); }
.cb :deep(.tok-atom), .cb :deep(.tok-bool) { color: var(--cp-num); }
.cb :deep(.tok-variableName) { color: var(--cp-fg); }
.cb :deep(.tok-operator), .cb :deep(.tok-punctuation) { color: var(--cp-dim-strong); }
</style>
