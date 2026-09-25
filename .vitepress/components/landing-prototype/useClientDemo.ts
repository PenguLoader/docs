// PROTOTYPE (throwaway): state and runtime for the live Client demo.
// CSS edits restyle the snapshot instantly. JS edits reload the snapshot and run
// the plugin's load() inside it, with a stand-in for Pengu's Effect API that
// drives the window material in the page.
import { computed, reactive, ref, shallowRef } from 'vue'
import { presets, pluginAssets, type PresetFile } from './presets'

export type Effect = { name: string; color?: string } | null

export function useClientDemo() {
  const activeId = ref(presets[0].id)
  // editable copies, so switching presets back and forth keeps your edits
  const edits = reactive<Record<string, PresetFile[]>>(
    Object.fromEntries(presets.map(p => [p.id, p.files.map(f => ({ ...f }))])),
  )
  const files = computed(() => edits[activeId.value])
  const fileIndex = ref(0)
  const effect = ref<Effect>(null)
  const status = ref<{ ok: boolean; text: string }>({ ok: true, text: '' })
  const frame = shallowRef<HTMLIFrameElement | null>(null)
  const ready = ref(false)

  const resolveAssets = (css: string) =>
    css.replace(/url\((['"]?)(\.\/[\w.-]+)\1\)/g, (m, q, p) => pluginAssets[p] ? `url("${pluginAssets[p]}")` : m)

  function applyCss() {
    const doc = frame.value?.contentDocument
    if (!doc?.body) return
    let style = doc.getElementById('pengu-demo') as HTMLStyleElement | null
    if (!style) {
      style = doc.createElement('style')
      style.id = 'pengu-demo'
      doc.body.append(style)
    }
    style.textContent = files.value.filter(f => f.lang === 'css').map(f => resolveAssets(f.code)).join('\n')
  }

  function runJs() {
    const win = frame.value?.contentWindow as (Window & typeof globalThis) | null
    const js = files.value.find(f => f.lang === 'js')
    if (!win || !js) return
    const body = js.code
      .replace(/^\s*import\s+['"][^'"]+['"];?\s*$/gm, '')
      .replace(/export\s+(async\s+)?function\s+(load|init)\s*\(/g, '$1function $2(')
      .replace(/export\s+default\s+function\s*\w*\s*\(/, 'function load(')
    const Effect = {
      apply(name: string, options?: { color?: string }) { effect.value = { name, color: options?.color } },
      clear() { effect.value = null },
    }
    try {
      new win.Function('Effect', `${body}\n;if (typeof init === 'function') init({});\nif (typeof load === 'function') load();`)(Effect)
    } catch (e: any) {
      status.value = { ok: false, text: `${js.name}: ${e?.message ?? e}` }
    }
  }

  function applyAll() {
    effect.value = null
    status.value = { ok: true, text: '' }
    applyCss()
    runJs()
    if (status.value.ok) status.value = { ok: true, text: `Applied ${files.value.map(f => f.name).join(' + ')}` }
  }

  // JS can't be un-run, so a JS change starts from a clean snapshot
  function reload() {
    ready.value = false
    frame.value?.contentWindow?.location.reload()
  }

  function onFrameLoad() {
    ready.value = true
    applyAll()
  }

  function select(id: string) {
    if (id === activeId.value) return
    activeId.value = id
    fileIndex.value = 0
    reload()
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  function update(code: string) {
    const f = files.value[fileIndex.value]
    f.code = code
    clearTimeout(timer)
    if (f.lang === 'css' && !files.value.some(x => x.lang === 'js')) {
      applyCss()
      status.value = { ok: true, text: `Applied ${f.name}` }
    } else {
      timer = setTimeout(reload, 600)
    }
  }

  return { presets, activeId, files, fileIndex, effect, status, frame, ready, select, update, onFrameLoad }
}

export type ClientDemo = ReturnType<typeof useClientDemo>

// CSS for the window material behind a transparent Client, per Pengu effect name.
export function effectStyle(e: Effect): Record<string, string> {
  if (!e) return { background: '#010a13' }
  const blur: Record<string, string> = {
    transparent: 'none',
    blurbehind: 'blur(14px)',
    acrylic: 'blur(28px) saturate(1.6)',
    unified: 'blur(40px) saturate(1.8)',
    mica: 'blur(60px) saturate(2)',
  }
  const f = blur[e.name] ?? 'none'
  return { background: e.color ?? '#0000', backdropFilter: f, WebkitBackdropFilter: f }
}
