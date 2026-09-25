<!-- PROTOTYPE (throwaway): preset tabs, plugin file tabs and a live CodeMirror editor.
     Colors come from --cp-* variables so each variant can skin it. -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ClientDemo } from './useClientDemo'

const props = defineProps<{ demo: ClientDemo }>()
const d = props.demo

const host = ref<HTMLElement>()
const readOnly = ref(false)
const loaded = ref(false)
const preset = computed(() => d.presets.find(p => p.id === d.activeId.value)!)

let view: any
let cm: any
let quiet = false
let observer: IntersectionObserver | undefined
let media: MediaQueryList | undefined
const syncReadOnly = () => { readOnly.value = media!.matches }

function makeState() {
  const f = d.files.value[d.fileIndex.value]
  return cm.EditorState.create({
    doc: f.code,
    extensions: [
      cm.lineNumbers(),
      cm.history(),
      cm.keymap.of([...cm.defaultKeymap, ...cm.historyKeymap, cm.indentWithTab]),
      f.lang === 'css' ? cm.css() : cm.javascript(),
      cm.syntaxHighlighting(cm.classHighlighter),
      cm.EditorView.lineWrapping,
      cm.EditorState.readOnly.of(readOnly.value),
      cm.EditorView.editable.of(!readOnly.value),
      cm.EditorView.contentAttributes.of({ 'aria-label': `${preset.value.folder}/${f.name}` }),
      cm.EditorView.updateListener.of((u: any) => {
        if (u.docChanged && !quiet) d.update(u.state.doc.toString())
      }),
      cm.EditorView.theme({
        '&': { color: 'var(--cp-fg)', backgroundColor: 'transparent', fontSize: '13px', height: '100%' },
        '.cm-scroller': { fontFamily: 'var(--cp-mono)', lineHeight: '1.65' },
        '.cm-gutters': { backgroundColor: 'transparent', color: 'var(--cp-dim)', border: 'none' },
        '.cm-activeLineGutter': { backgroundColor: 'transparent' },
        '&.cm-focused': { outline: 'none' },
        '.cm-cursor': { borderLeftColor: 'var(--cp-accent)' },
        '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': { backgroundColor: 'var(--cp-select) !important' },
      }),
    ],
  })
}

async function loadEditor() {
  const [state, view_, commands, language, highlight, langCss, langJs] = await Promise.all([
    import('@codemirror/state'), import('@codemirror/view'), import('@codemirror/commands'),
    import('@codemirror/language'), import('@lezer/highlight'),
    import('@codemirror/lang-css'), import('@codemirror/lang-javascript'),
  ])
  if (!host.value) return
  cm = {
    EditorState: state.EditorState, EditorView: view_.EditorView, keymap: view_.keymap, lineNumbers: view_.lineNumbers,
    history: commands.history, defaultKeymap: commands.defaultKeymap, historyKeymap: commands.historyKeymap,
    indentWithTab: commands.indentWithTab, syntaxHighlighting: language.syntaxHighlighting,
    classHighlighter: highlight.classHighlighter, css: langCss.css, javascript: langJs.javascript,
  }
  view = new cm.EditorView({ state: makeState(), parent: host.value! })
  loaded.value = true
}

onMounted(() => {
  media = matchMedia('(max-width: 767px)')
  syncReadOnly()
  media.addEventListener('change', syncReadOnly)
  observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    observer?.disconnect()
    loadEditor().catch(() => { d.status.value = { ok: false, text: 'Editor unavailable. Reload to try again.' } })
  }, { rootMargin: '100px' })
  observer.observe(host.value!)
})

watch([d.files, d.fileIndex, d.revision, readOnly], () => {
  if (!view) return
  quiet = true
  view.setState(makeState())
  quiet = false
  // a click in the Client added a rule: put the cursor in it, ready to type
  const at = d.cursor.value
  if (at == null || readOnly.value) return
  d.cursor.value = null
  view.dispatch({ selection: { anchor: Math.min(at, view.state.doc.length) }, scrollIntoView: true })
  view.focus()
})

onBeforeUnmount(() => { observer?.disconnect(); media?.removeEventListener('change', syncReadOnly); view?.destroy() })
</script>

<template>
  <div class="cp">
    <div class="cp-presets" role="group" aria-label="Examples">
      <button
        v-for="p in d.presets" :key="p.id"
        type="button"
        class="cp-preset" :class="{ 'is-active': p.id === d.activeId.value }"
        :aria-pressed="p.id === d.activeId.value"
        @click="d.select(p.id)"
      >{{ p.label }}</button>
    </div>
    <div class="cp-files">
      <button
        v-for="(f, i) in d.files.value" :key="f.name"
        type="button"
        class="cp-file" :class="{ 'is-active': i === d.fileIndex.value }"
        :aria-pressed="i === d.fileIndex.value"
        @click="d.fileIndex.value = i"
      ><span class="cp-dir">plugins/{{ preset.folder }}/</span>{{ f.name }}</button>
    </div>
    <div ref="host" class="cp-editor"><pre v-if="!loaded" class="cp-fallback">{{ d.files.value[d.fileIndex.value].code }}</pre></div>
    <button type="button" class="cp-reset" @click="d.reset()">Reset example</button>
    <p class="cp-status" :class="{ 'is-error': !d.status.value.ok }" aria-live="polite">
      {{ readOnly ? 'Try it on desktop to edit live.' : d.status.value.text }}
    </p>
  </div>
</template>

<style scoped>
.cp {
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  color: var(--cp-fg);
  font-family: var(--cp-sans, inherit);
}
.cp-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.cp-preset {
  padding: 6px 12px;
  border-radius: var(--cp-pill-radius, 999px);
  font-size: 13px;
  font-weight: 500;
  color: var(--cp-dim-strong);
  border: 1px solid var(--cp-border);
  transition: color 0.2s, background-color 0.2s, border-color 0.2s, transform 0.15s;
}
.cp-preset:hover { color: var(--cp-fg); }
.cp-preset:active { transform: scale(0.97); }
.cp-preset.is-active {
  color: var(--cp-on-accent);
  background: var(--cp-accent);
  border-color: var(--cp-accent);
}
.cp-files {
  overflow-x: auto;
  flex-shrink: 0;
  display: flex;
  gap: 16px;
  margin-top: 14px;
  border-bottom: 1px solid var(--cp-border);
}
.cp-file {
  white-space: nowrap;
  padding: 6px 0 8px;
  margin-bottom: -1px;
  font-family: var(--cp-mono);
  font-size: 12px;
  color: var(--cp-dim-strong);
  border-bottom: 2px solid transparent;
}
.cp-file.is-active {
  color: var(--cp-fg);
  border-bottom-color: var(--cp-accent);
}
.cp-dir { color: var(--cp-dim); }
.cp-reset { align-self: flex-end; color: var(--cp-dim-strong); font-size: 12px; padding: 6px 0; }
.cp-reset:hover { color: var(--cp-accent); }
.cp button:focus-visible { outline: 2px solid var(--cp-accent); outline-offset: 3px; }
.cp-editor {
  flex: 1;
  /* the host sets the panel height; long code scrolls inside the editor */
  min-height: 0;
  margin-top: 8px;
  overflow: hidden;
}
.cp-editor :deep(.cm-editor) { height: 100%; }
.cp-fallback { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; font: 13px/1.65 var(--cp-mono); }
.cp-status {
  margin: 8px 0 0;
  min-height: 1.4em;
  font-family: var(--cp-mono);
  font-size: 12px;
  color: var(--cp-dim-strong);
}
.cp-status.is-error { color: var(--cp-error, #f87171); }

/* syntax colors, from CodeMirror's classHighlighter */
.cp :deep(.tok-comment) { color: var(--cp-dim); font-style: italic; }
.cp :deep(.tok-keyword) { color: var(--cp-kw); }
.cp :deep(.tok-string), .cp :deep(.tok-string2) { color: var(--cp-str); }
.cp :deep(.tok-number), .cp :deep(.tok-atom), .cp :deep(.tok-bool) { color: var(--cp-num); }
.cp :deep(.tok-propertyName) { color: var(--cp-prop); }
.cp :deep(.tok-className), .cp :deep(.tok-typeName), .cp :deep(.tok-labelName) { color: var(--cp-sel); }
.cp :deep(.tok-variableName), .cp :deep(.tok-definition) { color: var(--cp-fg); }
.cp :deep(.tok-operator), .cp :deep(.tok-punctuation) { color: var(--cp-dim-strong); }
</style>
