<!-- PROTOTYPE (throwaway) for variant D: a pinned, scroll-driven stage modelled on cominvi.com.mx's
     "Minerals we extract". Scrolling steps through the examples; the live Client sits in a tick dial.
     The Client loads once. Each example's JS runs once on load (its Effect.apply call and the DOM it
     adds are captured), so stepping only swaps CSS and toggles what was captured: no reloads. -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, shallowRef } from 'vue'
import ClientWindow from './ClientWindow.vue'
import CodeBlock from './CodeBlock.vue'
import { presets, pluginAssets } from './presets'
import type { Effect } from './useClientDemo'

const steps = [
  { id: 'original', label: 'Original', folder: '', files: [] as typeof presets[number]['files'] },
  ...presets,
]

const section = ref<HTMLElement>()
const list = ref<HTMLElement>()
const step = ref(0)
const progress = ref(0) // 0..1 across the whole stage
const fileIndex = ref(0)
const reduce = ref(false)

// the shape ClientWindow expects from a demo
const frame = shallowRef<HTMLIFrameElement | null>(null)
const ready = ref(false)
const effect = ref<Effect>(null)
const captured = reactive<Record<string, Effect>>({})

const resolveAssets = (css: string) =>
  css.replace(/url\((['"]?)(\.\/[\w.-]+)\1\)/g, (m, q, p) => pluginAssets[p] ? `url("${pluginAssets[p]}")` : m)

// DOM the example plugins add; hidden unless their step is active
const ADDED = '.pengu-button, .pengu-panel'

function paint() {
  const doc = frame.value?.contentDocument
  if (!doc?.body || !ready.value) return
  let style = doc.getElementById('pengu-step') as HTMLStyleElement | null
  if (!style) {
    style = doc.createElement('style')
    style.id = 'pengu-step'
    doc.body.append(style)
  }
  const s = steps[step.value]
  const css = s.files.filter(f => f.lang === 'css').map(f => resolveAssets(f.code)).join('\n')
  const hide = s.id === 'button' ? '' : `${ADDED} { display: none !important; }`
  style.textContent = `${css}\n${hide}`
  effect.value = captured[s.id] ?? null
}

async function onFrameLoad() {
  const win = frame.value?.contentWindow as (Window & typeof globalThis) | null
  if (!win?.document.querySelector('.parties-background')) return
  for (const p of presets) {
    const js = p.files.find(f => f.lang === 'js')
    if (!js) continue
    const body = js.code
      .replace(/^\s*import\s+['"][^'"]+['"];?\s*$/gm, '')
      .replace(/export\s+(async\s+)?function\s+(load|init)\s*\(/g, '$1function $2(')
    const Effect = { apply: (name: string, o?: { color?: string }) => { captured[p.id] = { name, color: o?.color } }, clear() {} }
    try {
      await new win.Function('Effect', `return (async () => { ${body}\n;if (typeof load === 'function') await load(); })()`)(Effect)
    } catch { /* a broken example only loses its own step */ }
  }
  ready.value = true
  paint()
}

const demo = { frame, ready, effect, onFrameLoad } as any

const current = computed(() => steps[step.value])
const file = computed(() => current.value.files[fileIndex.value] ?? current.value.files[0])

function setStep(i: number) {
  if (i === step.value) return
  step.value = i
  fileIndex.value = 0
  paint()
  // on phones the list is one scrolling row: keep the active step in view (sideways only)
  const btn = list.value?.children[i] as HTMLElement | undefined
  if (list.value && btn && list.value.scrollWidth > list.value.clientWidth) {
    list.value.scrollTo({ left: btn.offsetLeft - 16, behavior: reduce.value ? 'auto' : 'smooth' })
  }
}

// local progress inside the current step, -1..1, drives the Client's turn
const turn = computed(() => {
  if (reduce.value) return 0
  const t = progress.value * steps.length - step.value
  return Math.max(-1, Math.min(1, (t - 0.5) * 2))
})

function jump(i: number) {
  const el = section.value
  if (!el) return
  const top = el.getBoundingClientRect().top + scrollY
  const travel = el.offsetHeight - innerHeight
  scrollTo({ top: top + travel * ((i + 0.5) / steps.length), behavior: reduce.value ? 'auto' : 'smooth' })
}

let trigger: any
onMounted(async () => {
  reduce.value = matchMedia('(prefers-reduced-motion: reduce)').matches
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  if (!section.value) return
  gsap.registerPlugin(ScrollTrigger)
  // scroll position is navigation here, not decoration, so it runs under reduced motion too
  const nav = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--vp-nav-height')) || 64
  trigger = ScrollTrigger.create({
    trigger: section.value,
    start: `top ${nav}px`, // the stage pins under the site nav
    end: 'bottom bottom',
    onUpdate(self: any) {
      progress.value = self.progress
      setStep(Math.min(steps.length - 1, Math.floor(self.progress * steps.length)))
    },
  })
})
onBeforeUnmount(() => trigger?.kill())
</script>

<template>
  <section ref="section" class="sc" :style="{ '--steps': steps.length }">
    <div class="sc-pin">
      <div class="sc-left">
        <p class="sc-label">What a plugin can change</p>
        <ol ref="list" class="sc-list">
          <li v-for="(s, i) in steps" :key="s.id">
            <button type="button" :class="{ 'is-on': i === step }" :aria-current="i === step" @click="jump(i)">{{ s.label }}</button>
          </li>
        </ol>
      </div>

      <div class="sc-center" :style="{ '--p': progress }">
        <svg class="sc-dial" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="sc-ticks" cx="50" cy="50" r="47" />
        </svg>
        <svg class="sc-dial sc-dial-on" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="sc-ticks" cx="50" cy="50" r="47" />
        </svg>
        <div class="sc-glow" aria-hidden="true" />
        <div class="sc-client" :style="{ transform: `perspective(1600px) rotateY(${turn * -9}deg) rotateX(${Math.abs(turn) * 2}deg)` }">
          <ClientWindow :demo="demo" :draggable="false" />
        </div>
      </div>

      <div class="sc-right">
        <template v-if="current.files.length">
          <div class="sc-files">
            <button
              v-for="(f, i) in current.files" :key="f.name" type="button"
              :class="{ 'is-on': f === file }" @click="fileIndex = i"
            >plugins/{{ current.folder }}/{{ f.name }}</button>
          </div>
          <CodeBlock :code="file.code" :lang="file.lang" class="sc-code" />
        </template>
        <template v-else>
          <p class="sc-files-empty">No plugins</p>
          <p class="sc-note">This is the Client as Riot ships it. Scroll to change it.</p>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sc {
  position: relative;
  /* one screen per step of scrolling, plus the screen the stage is pinned on */
  height: calc((var(--steps) * 70 + 100) * 1dvh);
}
.sc-pin {
  position: sticky;
  top: var(--vp-nav-height, 64px);
  height: calc(100dvh - var(--vp-nav-height, 64px));
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(0, 2.4fr) minmax(260px, 1.25fr);
  align-items: center;
  gap: 32px;
  padding: 0 32px;
  max-width: 1600px;
  margin: 0 auto;
}
.sc-label, .sc-files-empty {
  margin: 0 0 18px;
  font-family: var(--cp-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}
.sc-list { margin: 0; padding: 0; list-style: none; }
.sc-list button {
  display: block;
  padding: 0;
  font-size: clamp(1.7rem, 2.6vw, 2.5rem);
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -0.03em;
  color: var(--faint);
  text-align: left;
  transition: color 0.35s;
}
.sc-list button:hover { color: var(--muted); }
.sc-list button.is-on { color: var(--ink); }
.sc-list button:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }

.sc-center { position: relative; display: grid; place-items: center; aspect-ratio: 1; max-height: 100%; }
.sc-dial { position: absolute; inset: 0; width: 100%; height: 100%; }
.sc-ticks {
  fill: none;
  stroke: var(--tick);
  stroke-width: 3.2;
  /* 2 * pi * 47 = 295.3, split into 150 ticks */
  stroke-dasharray: 0.35 1.62;
}
.sc-dial-on .sc-ticks { stroke: var(--ink); }
.sc-dial-on {
  /* fills clockwise from 12 o'clock as the stage scrolls */
  mask-image: conic-gradient(#000 calc(var(--p) * 1turn), transparent 0);
  -webkit-mask-image: conic-gradient(#000 calc(var(--p) * 1turn), transparent 0);
}
/* only visible through a transparent Client (the Acrylic step) */
.sc-glow {
  position: absolute;
  width: 74%;
  aspect-ratio: 16 / 9;
  border-radius: 6px;
  background:
    radial-gradient(50% 70% at 25% 30%, #38bdf8, transparent 70%),
    radial-gradient(45% 60% at 80% 70%, #6366f1, transparent 70%),
    radial-gradient(40% 50% at 60% 20%, #f0abfc, transparent 70%),
    #0b1220;
}
.sc-client {
  position: relative;
  width: 80%;
  transition: transform 0.25s ease-out;
  --cw-gutter: 0px;
  --cw-radius: 6px;
  --cw-screen-radius: 6px;
  --cw-frame-border: transparent;
  --cw-shadow: 0 40px 80px -30px rgb(0 0 0 / 0.45);
}

.sc-right { align-self: center; min-width: 0; }
.sc-files { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-bottom: 14px; }
.sc-files button {
  padding: 0;
  font-family: var(--cp-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--muted);
}
.sc-files button.is-on { color: var(--ink); text-decoration: underline; text-underline-offset: 4px; }
.sc-code {
  max-height: 58dvh;
  overflow: auto;
  white-space: pre-wrap; /* no sideways scrolling in a narrow column */
  overflow-wrap: anywhere;
  font-size: 12px;
  -webkit-mask-image: linear-gradient(#000 85%, transparent);
  mask-image: linear-gradient(#000 85%, transparent);
}
.sc-note { margin: 0; max-width: 28ch; color: var(--muted); line-height: 1.6; }

@media (max-width: 1023px) {
  .sc { height: calc((var(--steps) * 60 + 100) * 1dvh); }
  .sc-pin {
    grid-template-columns: minmax(0, 1fr); /* a plain 1fr would stretch to the one-line list */
    grid-template-rows: auto auto minmax(0, 1fr);
    align-items: start;
    align-content: start;
    gap: 14px;
    padding: 16px;
  }
  .sc-label { display: none; }
  .sc-list { display: flex; gap: 14px; overflow-x: auto; scrollbar-width: none; }
  .sc-list button { font-size: 1.15rem; white-space: nowrap; }
  .sc-center { aspect-ratio: auto; max-width: 560px; width: 100%; margin: 0 auto; }
  .sc-dial { display: none; }
  .sc-glow { width: 96%; }
  .sc-client { width: 100%; }
  .sc-right { align-self: start; }
  .sc-code { max-height: 34dvh; }
}
@media (prefers-reduced-motion: reduce) {
  .sc-client, .sc-list button { transition: none; }
}
</style>
