// PROTOTYPE (throwaway): state and runtime for the live Client demo.
// CSS edits restyle the snapshot instantly. JS edits reload the snapshot and run
// the plugin's load() inside it, with a stand-in for Pengu's Effect API that
// drives the window material in the page.
import { computed, onBeforeUnmount, reactive, ref, shallowRef } from 'vue'
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
  // bumped when code changes outside the editor, with where the editor cursor should land
  const revision = ref(0)
  const cursor = ref<number | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined
  let run = 0

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

  async function runJs(currentRun: number) {
    const win = frame.value?.contentWindow as (Window & typeof globalThis) | null
    const js = files.value.find(f => f.lang === 'js')
    if (!win || !js) return
    const body = js.code
      .replace(/^\s*import\s+['"][^'"]+['"];?\s*$/gm, '')
      .replace(/export\s+(async\s+)?function\s+(load|init)\s*\(/g, '$1function $2(')
      .replace(/export\s+default\s+function\s*\w*\s*\(/, 'function load(')
    const Effect = {
      apply(name: string, options?: { color?: string }) { if (currentRun === run) effect.value = { name, color: options?.color } },
      clear() { if (currentRun === run) effect.value = null },
    }
    try {
      await new win.Function('Effect', `return (async () => { ${body}\n;if (typeof init === 'function') await init({});\nif (typeof load === 'function') await load(); })()`)(Effect)
    } catch (e: any) {
      if (currentRun === run) status.value = { ok: false, text: `${js.name}: ${e?.message ?? e}` }
    }
  }

  async function applyAll() {
    const currentRun = ++run
    effect.value = null
    status.value = { ok: true, text: '' }
    applyCss()
    await runJs(currentRun)
    if (currentRun === run && status.value.ok) status.value = { ok: true, text: `Applied ${files.value.map(f => f.name).join(' + ')}` }
  }

  // JS can't be un-run, so a JS change starts from a clean snapshot
  function reload() {
    clearTimeout(timer)
    run++
    ready.value = false
    status.value = { ok: true, text: 'Updating preview...' }
    frame.value?.contentWindow?.location.reload()
  }

  function onFrameLoad() {
    if (!frame.value?.contentDocument?.querySelector('.parties-background')) {
      status.value = { ok: false, text: 'Preview unavailable. Try resetting the example.' }
      return
    }
    ready.value = true
    return applyAll()
  }

  function select(id: string) {
    if (id === activeId.value || !edits[id]) return
    activeId.value = id
    fileIndex.value = 0
    reload()
  }

  function reset() {
    edits[activeId.value] = presets.find(p => p.id === activeId.value)!.files.map(f => ({ ...f }))
    fileIndex.value = 0
    reload()
  }

  function update(code: string) {
    const f = files.value[fileIndex.value]
    f.code = code
    clearTimeout(timer)
    if (f.lang === 'css' && ready.value) {
      applyCss()
      status.value = { ok: true, text: `Applied ${f.name}` }
    } else {
      timer = setTimeout(reload, 600)
    }
  }

  // Click-to-style: give the picked element a rule in the example's CSS file (or jump to its
  // existing rule) and put the cursor inside it. CSS applies live, so no reload.
  function addRule(selector: string, label: string) {
    const i = files.value.findIndex(f => f.lang === 'css')
    if (i < 0) return
    const f = files.value[i]
    let at = f.code.indexOf(`${selector} {`)
    if (at < 0) {
      const code = f.code.trimEnd()
      f.code = `${code}${code ? '\n\n' : ''}/* ${label} */\n${selector} {\n  \n}\n`
      at = f.code.lastIndexOf(`${selector} {`)
      cursor.value = f.code.indexOf('\n', at) + 3 // on the empty line inside the braces
      status.value = { ok: true, text: `Added ${label} to ${f.name}` }
    } else {
      cursor.value = f.code.indexOf('{', at) + 1
      status.value = { ok: true, text: `${label} is already in ${f.name}` }
    }
    fileIndex.value = i
    revision.value++
    applyCss()
  }

  onBeforeUnmount(() => { clearTimeout(timer); run++; frame.value = null })

  return { presets, activeId, files, fileIndex, effect, status, frame, ready, revision, cursor, select, reset, update, onFrameLoad, addRule }
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
