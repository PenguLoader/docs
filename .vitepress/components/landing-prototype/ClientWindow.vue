<!-- PROTOTYPE (throwaway): the real League Client lobby (live DOM snapshot) in a draggable frame.
     The frame around the Client is the drag handle, so the Client itself stays clickable. -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { effectStyle, type ClientDemo } from './useClientDemo'

const props = withDefaults(defineProps<{
  demo: ClientDemo
  draggable?: boolean
  inertia?: boolean
  tilt?: boolean
  bounds?: string
}>(), { draggable: true, inertia: false, tilt: false })

const box = ref<HTMLElement>()
const handle = ref<HTMLElement>()
const screen = ref<HTMLElement>()
const scale = ref(0.6)
const dragging = ref(false)
const canDrag = ref(false)

const setFrame = (el: any) => { props.demo.frame.value = el }
const onLoad = () => props.demo.onFrameLoad()
const material = computed(() => effectStyle(props.demo.effect.value))

let ro: ResizeObserver | undefined
let drag: any
let gsapRef: any
let media: MediaQueryList | undefined
let disposed = false
function syncDrag() {
  canDrag.value = !!drag && !media?.matches
  if (canDrag.value) drag.enable()
  else { drag?.disable(); gsapRef?.set(box.value, { x: 0, y: 0, rotation: 0 }) }
}

onMounted(async () => {
  ro = new ResizeObserver(([e]) => { scale.value = e.contentRect.width / 1280; drag?.applyBounds() })
  ro.observe(screen.value!)

  if (!props.draggable) return
  media = matchMedia('(max-width: 767px), (pointer: coarse)')
  const { gsap } = await import('gsap')
  const { Draggable } = await import('gsap/Draggable')
  const plugins: any[] = [Draggable]
  if (props.inertia) plugins.push((await import('gsap/InertiaPlugin')).InertiaPlugin)
  if (disposed || !box.value) return
  gsap.registerPlugin(...plugins)
  gsapRef = gsap
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  let lastX = 0
  drag = Draggable.create(box.value!, {
    type: 'x,y',
    trigger: handle.value!,
    bounds: props.bounds,
    inertia: props.inertia && !reduce,
    edgeResistance: 0.75,
    zIndexBoost: false,
    onPress() { dragging.value = true; lastX = this.x },
    onDrag() {
      if (!props.tilt || reduce) return
      const v = gsap.utils.clamp(-8, 8, (this.x - lastX) * 0.6)
      lastX = this.x
      gsap.to(box.value!, { rotation: v, duration: 0.3, overwrite: 'auto' })
    },
    onRelease() {
      dragging.value = false
      if (props.tilt) gsap.to(box.value!, { rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' })
    },
  })[0]
  syncDrag()
  media.addEventListener('change', syncDrag)
})

function snapBack() {
  drag?.tween?.kill()
  gsapRef?.to(box.value!, { x: 0, y: 0, rotation: 0, duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.7, ease: 'power3.out', onUpdate: () => drag?.update() })
}

onBeforeUnmount(() => { disposed = true; ro?.disconnect(); media?.removeEventListener('change', syncDrag); drag?.kill(); gsapRef?.killTweensOf(box.value!) })
</script>

<template>
  <div class="cw">
    <div ref="box" class="cw-box" :class="{ 'is-dragging': dragging }">
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
    </div>
    <button v-if="canDrag" class="cw-reset" type="button" @click="snapBack">Center Client</button>
  </div>
</template>

<style scoped>
.cw {
  position: relative;
  width: 100%;
}
.cw-box {
  position: relative;
  will-change: transform;
}
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
.cw-reset { position: relative; z-index: 2; display: block; margin: 10px 0 0 auto; padding: 4px 0; font: 12px/1.5 var(--cp-sans, inherit); color: var(--cp-dim-strong); }
.cw-reset:hover { color: var(--cp-accent); }
.cw-reset:focus-visible { outline: 2px solid var(--cp-accent); outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) {
  .cw-screen, .cw-poster { transition: none; }
}
</style>
