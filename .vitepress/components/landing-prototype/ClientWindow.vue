<!-- The real League Client lobby (live DOM snapshot) in a draggable, resizable frame.
     The frame around the Client is the drag handle, so the Client itself stays clickable:
     clicking an element in it adds that element's CSS rule to the editor (picker.ts).
     Resizing keeps 16:9 and scales the UI, which is what the real Client does.
     Once resized, the window docks the editor on its right edge (like DevTools): the parent
     teleports its editor into #cw-dock while `docked` is true. Reset undocks it. -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { effectStyle, type ClientDemo } from './useClientDemo'
import { installPicker } from './picker'

const props = defineProps<{ demo: ClientDemo; bounds?: string }>()
const docked = defineModel<boolean>('docked', { default: false })

const box = ref<HTMLElement>()
const win = ref<HTMLElement>()
const handle = ref<HTMLElement>()
const screen = ref<HTMLElement>()
const scale = ref(0.6)
const dragging = ref(false)
const canDrag = ref(false)
const width = ref<number | null>(null) // null: fill the container
const root = ref<HTMLElement>()
// once resized, the slot keeps its original height so a bigger Client floats instead of pushing the page
const slotHeight = ref<number | null>(null)
const moved = ref(false)
const changed = computed(() => moved.value || width.value !== null)
const MIN_WIDTH = 360
const DOCK_WIDTH = 380
const DOCK_MIN_HEIGHT = 340
const frameHeight = ref(0) // the dock matches the Client frame; its editor scrolls inside
watch(width, w => { docked.value = w !== null })

const setFrame = (el: any) => { props.demo.frame.value = el }
const setScaleVar = () => props.demo.frame.value?.contentDocument?.documentElement.style.setProperty('--pengu-scale', String(scale.value))
function onLoad() {
  props.demo.onFrameLoad()
  const doc = props.demo.frame.value?.contentDocument
  if (!doc?.body) return
  setScaleVar()
  // phones get a read-only editor, so there is nothing to pick into
  if (!matchMedia('(max-width: 767px)').matches) installPicker(doc, props.demo.addRule)
}
watch(scale, setScaleVar)
const material = computed(() => effectStyle(props.demo.effect.value))

let ro: ResizeObserver | undefined
let drag: any
let gsapRef: any
let media: MediaQueryList | undefined
let disposed = false
function syncDrag() {
  canDrag.value = !!drag && !media?.matches
  if (canDrag.value) drag.enable()
  else { drag?.disable(); gsapRef?.set(box.value, { x: 0, y: 0 }); width.value = null; slotHeight.value = null; moved.value = false }
}

onMounted(async () => {
  ro = new ResizeObserver(([e]) => {
    scale.value = e.contentRect.width / 1280
    frameHeight.value = handle.value!.offsetHeight
    drag?.applyBounds()
  })
  ro.observe(screen.value!)

  media = matchMedia('(max-width: 767px), (pointer: coarse)')
  const { gsap } = await import('gsap')
  const { Draggable } = await import('gsap/Draggable')
  if (disposed || !box.value) return
  gsap.registerPlugin(Draggable)
  gsapRef = gsap
  drag = Draggable.create(box.value!, {
    type: 'x,y',
    trigger: handle.value!,
    bounds: props.bounds,
    edgeResistance: 0.75,
    zIndexBoost: false,
    onPress() { dragging.value = true },
    onRelease() { dragging.value = false; moved.value = Math.abs(this.x) + Math.abs(this.y) > 1 },
  })[0]
  syncDrag()
  media.addEventListener('change', syncDrag)
})

// Resize from the bottom-right corner; the left edge stays put, 16:9 comes from .cw-screen.
// capped by the bounds' right edge and by the viewport's bottom, so the corner handle stays reachable
function maxWidth() {
  if (!win.value) return 1600
  const r = win.value.getBoundingClientRect()
  const b = props.bounds ? document.querySelector(props.bounds) : null
  const byBounds = b ? b.getBoundingClientRect().right - r.left - 16 - DOCK_WIDTH : 1600
  const chrome = r.width - screen.value!.offsetWidth // frame gutters and border
  const byViewport = (innerHeight - r.top - 48) * 16 / 9 + chrome
  return Math.max(MIN_WIDTH, Math.min(byBounds, byViewport))
}
function setWidth(w: number) {
  slotHeight.value ??= root.value!.offsetHeight
  width.value = Math.round(Math.min(maxWidth(), Math.max(MIN_WIDTH, w)))
  requestAnimationFrame(() => drag?.applyBounds())
}
function onResizeStart(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  const startW = win.value!.offsetWidth
  const startX = e.clientX
  el.setPointerCapture(e.pointerId)
  dragging.value = true
  const move = (ev: PointerEvent) => setWidth(startW + ev.clientX - startX)
  const end = () => {
    dragging.value = false
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerup', end)
    el.removeEventListener('pointercancel', end)
  }
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerup', end)
  el.addEventListener('pointercancel', end)
}
function onResizeKey(e: KeyboardEvent) {
  const step = e.shiftKey ? 80 : 20
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setWidth(win.value!.offsetWidth + step)
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setWidth(win.value!.offsetWidth - step)
  else return
  e.preventDefault()
}

function snapBack() {
  width.value = null
  slotHeight.value = null
  moved.value = false
  drag?.tween?.kill()
  gsapRef?.to(box.value!, { x: 0, y: 0, duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.7, ease: 'power3.out', onUpdate: () => drag?.update() })
}

onBeforeUnmount(() => { disposed = true; ro?.disconnect(); media?.removeEventListener('change', syncDrag); drag?.kill(); gsapRef?.killTweensOf(box.value!) })
</script>

<template>
  <div ref="root" class="cw" :class="{ 'can-drag': canDrag }" :style="slotHeight ? { height: `${slotHeight}px` } : undefined">
    <div ref="box" class="cw-box" :class="{ 'is-dragging': dragging, 'is-docked': docked }">
     <div ref="win" class="cw-window" :style="width ? { width: `${width}px` } : undefined">
      <div ref="handle" class="cw-frame" :class="{ 'can-drag': canDrag }" @dblclick="snapBack">
        <div ref="screen" class="cw-screen" :style="material">
          <img
            class="cw-poster"
            :class="{ 'is-hidden': demo.ready.value }"
            :aria-hidden="demo.ready.value"
            src="/client/lobby-poster.webp"
            alt="The League Client's Draft lobby, running Pengu Loader"
            width="2560" height="1440"
            fetchpriority="high"
          >
          <iframe
            :ref="setFrame"
            class="cw-iframe"
            :class="{ 'no-events': dragging }"
            src="/client/lobby/index.html"
            title="Live League Client lobby"
            :style="{ transform: `scale(${scale})` }"
            @load="onLoad"
          />
        </div>
      </div>
      <button
        v-if="canDrag"
        class="cw-resize" type="button"
        aria-label="Resize the Client. Arrow keys change the size."
        title="Drag to resize"
        @pointerdown.prevent="onResizeStart"
        @keydown="onResizeKey"
      />
     </div>
      <div v-show="docked" id="cw-dock" class="cw-dock" :style="{ width: `${DOCK_WIDTH}px`, height: `${Math.max(frameHeight, DOCK_MIN_HEIGHT)}px` }" />
      <!-- part of the window, so it follows the Client when moved or resized -->
      <button v-if="changed" class="cw-reset" type="button" @click="snapBack">Reset position and size</button>
    </div>
  </div>
</template>

<style scoped>
.cw {
  position: relative;
  width: 100%;
}
/* room under the Client for the reset link, reserved so it can appear without shifting the page */
.cw.can-drag { padding-bottom: 34px; }
.cw-box {
  position: relative;
  z-index: 1; /* moved or enlarged, the Client floats over the page like a window */
  will-change: transform;
}
.cw-window { position: relative; }
.cw-box.is-docked { display: flex; align-items: flex-start; width: max-content; }
.cw-box.is-docked .cw-frame { border-top-right-radius: 0; border-bottom-right-radius: 0; }
.cw-dock {
  flex: none;
  display: flex;
  padding: 16px 16px 10px;
  border: 1px solid var(--cw-frame-border, rgb(255 255 255 / 0.12));
  border-left: 0;
  border-radius: 0 var(--cw-radius, 14px) var(--cw-radius, 14px) 0;
  background: var(--cw-dock-bg, var(--cw-frame-bg, transparent));
  box-shadow: var(--cw-shadow, none);
}
.cw-dock > * { flex: 1; min-width: 0; }
.cw-resize {
  position: absolute;
  right: -7px;
  bottom: -7px;
  width: 22px;
  height: 22px;
  cursor: nwse-resize;
  touch-action: none;
  border-radius: 6px;
  /* two short diagonal strokes in the corner */
  background:
    linear-gradient(135deg, transparent 45%, var(--cp-dim-strong, #888) 45% 52%, transparent 52% 64%, var(--cp-dim-strong, #888) 64% 71%, transparent 71%);
  opacity: 0.7;
  transition: opacity 0.15s;
}
.cw-resize:hover, .cw-box.is-dragging .cw-resize { opacity: 1; }
.cw-resize:focus-visible { opacity: 1; outline: 2px solid var(--cp-accent); outline-offset: 2px; }
.cw-frame {
  padding: var(--cw-gutter, 10px);
  border-radius: var(--cw-radius, 14px);
  background: var(--cw-frame-bg, rgb(255 255 255 / 0.06));
  border: 1px solid var(--cw-frame-border, rgb(255 255 255 / 0.12));
  box-shadow: var(--cw-shadow, 0 40px 120px -30px rgb(0 0 0 / 0.6));
  /* no backdrop-filter here: it would become the backdrop root and the
     acrylic material inside could no longer see the page behind it */
}
.cw-frame.can-drag { cursor: grab; }
.is-dragging .cw-frame { cursor: grabbing; }
.cw-screen {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--cw-screen-radius, 4px);
  transition: background-color 0.4s;
}
.cw-poster {
  z-index: 1;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.4s;
}
.cw-poster.is-hidden {
  opacity: 0;
  pointer-events: none;
}
.cw-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 1280px;
  height: 720px;
  border: 0;
  transform-origin: 0 0;
  background: transparent;
  /* a scheme mismatch with the page would paint the frame opaque */
  color-scheme: normal;
}
.cw-iframe.no-events { pointer-events: none; }
.cw-reset {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 6px;
  padding: 3px 8px;
  border-radius: 6px;
  /* backed, since after a move it can sit over other content */
  background: var(--cw-frame-bg, transparent);
  white-space: nowrap;
  font: 12px/1.5 var(--cp-sans, inherit);
  color: var(--cp-dim-strong);
}
.cw-reset:hover { color: var(--cp-accent); }
.cw-reset:focus-visible { outline: 2px solid var(--cp-accent); outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) {
  .cw-screen, .cw-poster { transition: none; }
}
</style>
