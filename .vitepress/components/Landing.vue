<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// screenshots are the real app UI (packages/hub in PenguLoader), one per accent
const accents = [
  { id: 'blue', name: 'Pengu Blue', color: '#38bdf8', src: '/home/hub.webp' },
  { id: 'green', name: 'Mint Green', color: '#22c55e', src: '/home/theme-green.webp' },
  { id: 'purple', name: 'Royal Purple', color: '#a855f7', src: '/home/theme-purple.webp' },
  { id: 'pink', name: 'Sakura Pink', color: '#ec4899', src: '/home/theme-pink.webp' },
  { id: 'yellow', name: 'Lemon Yellow', color: '#facc15', src: '/home/theme-yellow.webp' },
]
const tabs = [
  { id: 'plugins', label: 'Plugins', body: 'Every plugin in your plugins folder, with a checkbox to switch it off.' },
  { id: 'store', label: 'Store', body: 'Community plugins and themes, each linked to its source on GitHub.' },
  { id: 'accent', label: 'Accent', body: 'The app comes in five accent colors.' },
]
const tab = ref('plugins')
const accent = ref('blue')
const activeTab = computed(() => tabs.find(t => t.id === tab.value)!)
// the stage shows the store shot on the Store tab, otherwise the picked accent
const shot = computed(() => tab.value === 'store' ? '/home/store.webp' : accents.find(a => a.id === accent.value)!.src)
const shots = ['/home/store.webp', ...accents.map(a => a.src)]

const steps = [
  { title: 'Install', body: 'Run the installer on Windows, or open the DMG on macOS. A short tour covers the rest.' },
  { title: 'Activate', body: 'Click Activate in the app, then restart the League Client.' },
  { title: 'Add plugins', body: 'Drop plugins into your plugins folder, or pick one from the store.' },
]

// reveal sections once as they scroll into view
const root = ref<HTMLElement>()
const ready = ref(false)
let observer: IntersectionObserver | undefined
onMounted(() => {
  ready.value = true
  observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in')
        observer!.unobserve(e.target)
      }
    }
  }, { rootMargin: '0px 0px -10% 0px' })
  root.value!.querySelectorAll('[data-reveal]').forEach(el => observer!.observe(el))
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <main ref="root" :class="['landing', { 'can-reveal': ready }]">

    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="glow" aria-hidden="true" />
      <div class="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-[6fr_6fr] lg:pb-28 lg:pt-24">
        <div class="rise">
          <h1 class="text-[2.6rem] font-bold leading-[1.08] tracking-tight md:text-[3.4rem]">
            Build your unmatched<br><span class="accent">LoL Client</span>
          </h1>
          <p class="lead mt-6 max-w-[36ch]">
            Pengu Loader runs JavaScript plugins and themes inside the League Client. Free and open source, for Windows and macOS.
          </p>
          <div class="mt-9 flex flex-wrap gap-3">
            <a href="/download" class="btn btn-primary">Download</a>
            <a href="/guide/welcome" class="btn btn-ghost">Get Started</a>
          </div>
        </div>

        <div class="shots rise rise-late">
          <img class="shot shot-back" src="/home/store.webp" width="1000" height="640" alt="" aria-hidden="true" decoding="async">
          <img class="shot shot-front" src="/home/hub.webp" width="1000" height="640"
            alt="The Pengu Loader app with four installed plugins and Pengu activated" fetchpriority="high" decoding="async">
        </div>
      </div>
    </section>

    <!-- What plugins can do -->
    <section class="section" data-reveal>
      <div class="mx-auto max-w-7xl px-6">
        <h2 class="h2">Plugins run inside the Client</h2>
        <p class="body mt-4">They load with the League Client's own UI, so they can restyle any screen, call the Client's API and add features of their own.</p>

        <div class="bento mt-10">
          <article class="cell cell-wide cell-media">
            <div>
              <h3 class="h3">Restyle any screen</h3>
              <p class="small mt-2">Themes are plain CSS. Add a window effect like acrylic, blur or full transparency behind the Client.</p>
            </div>
            <img src="/images/visual-acrylic.png" width="500" height="255" loading="lazy" decoding="async"
              alt="The League Client lobby with the acrylic window effect, showing the desktop through a frosted background">
          </article>

          <article class="cell cell-tint">
            <h3 class="h3">Chrome DevTools, built in</h3>
            <p class="small">Inspect elements, edit styles live and read your plugin's console from inside the Client.</p>
            <p class="keys mt-auto" aria-label="Keyboard shortcut Ctrl Shift I"><kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>I</kbd></p>
          </article>

          <article class="cell">
            <h3 class="h3">A plugin is one JavaScript file</h3>
            <p class="small">Put an <code>index.js</code> in your plugins folder. Export <code>load</code> and it runs once the Client is ready.</p>
            <div class="code vp-doc"><slot name="plugin" /></div>
          </article>

          <article class="cell cell-wide">
            <h3 class="h3">Talk to the Client</h3>
            <p class="small">Call the LCU API with plain <code>fetch</code>. No ports or tokens to dig up.</p>
            <div class="code vp-doc"><slot name="lcu" /></div>
          </article>
        </div>

        <div class="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          <a class="link" href="/guide/javascript-plugin">Create your first plugin</a>
          <a class="link" href="/guide/css-theme">Create your first theme</a>
          <a class="link" href="/runtime-api/">API reference</a>
        </div>
      </div>
    </section>

    <!-- The app -->
    <section class="section" data-reveal>
      <div class="mx-auto max-w-5xl px-6 text-center">
        <h2 class="h2">Manage it from the Pengu app</h2>
        <p class="body mx-auto mt-4">Turn Pengu on, switch plugins on and off, and find new ones.</p>

        <div class="mt-8 inline-flex gap-1 rounded-full border border-[var(--vp-c-divider)] p-1" role="tablist" aria-label="App views">
          <button v-for="t in tabs" :key="t.id" type="button" role="tab" :aria-selected="tab === t.id"
            class="tab" @click="tab = t.id">{{ t.label }}</button>
        </div>
        <p class="small mx-auto mb-8 mt-5">{{ activeTab.body }}</p>

        <div v-if="tab === 'accent'" class="mb-6 flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Accent color">
          <button v-for="a in accents" :key="a.id" type="button" role="radio" :aria-checked="accent === a.id"
            class="swatch" :style="{ '--sw': a.color }" @click="accent = a.id">
            <span class="dot" />{{ a.name }}
          </button>
        </div>

        <div class="stage">
          <img v-for="s in shots" :key="s" :src="s" width="1000" height="640" loading="lazy" decoding="async"
            :class="['shot', { 'is-on': shot === s }]" :alt="shot === s ? `The Pengu app, ${activeTab.label} view` : ''"
            :aria-hidden="shot !== s">
        </div>
      </div>
    </section>

    <!-- Get started -->
    <section class="section final" data-reveal>
      <div class="mx-auto max-w-5xl px-6">
        <h2 class="h2 text-center">Make the Client yours</h2>
        <ol class="steps mt-12">
          <li v-for="s in steps" :key="s.title">
            <h3 class="h3">{{ s.title }}</h3>
            <p class="small mt-2">{{ s.body }}</p>
          </li>
        </ol>
        <div class="mt-12 flex flex-wrap justify-center gap-3">
          <a href="/download" class="btn btn-primary">Download</a>
          <a href="https://chat.pengu.lol" class="btn btn-ghost">Join Discord</a>
        </div>
      </div>
    </section>

  </main>
</template>

<style scoped>
.landing {
  --pl-accent: #0369a1;
  --pl-ink: var(--vp-c-text-1);
  --pl-muted: var(--vp-c-text-2);
  color: var(--pl-ink);
}
.dark .landing {
  --pl-accent: #38bdf8;
}

.accent { color: var(--pl-accent); }

/* same deep-to-light walk as the app's --bg-glow-stops */
.glow {
  position: absolute;
  inset: -10% -10% auto 30%;
  height: 520px;
  background: linear-gradient(97.62deg, rgba(0, 71, 225, .22), rgba(26, 214, 255, .30), rgba(125, 211, 252, .36));
  filter: blur(120px);
  pointer-events: none;
}

.lead { font-size: 1.2rem; line-height: 1.6; color: var(--pl-muted); }
.body { font-size: 1.075rem; line-height: 1.65; color: var(--pl-muted); max-width: 60ch; }
.small { font-size: .95rem; line-height: 1.6; color: var(--pl-muted); }
.h2 { font-size: clamp(1.9rem, 3.2vw, 2.6rem); font-weight: 700; letter-spacing: -.02em; line-height: 1.15; }
.h3 { font-size: 1.1rem; font-weight: 600; }

.btn {
  display: inline-flex;
  align-items: center;
  height: 2.9rem;
  padding: 0 1.4rem;
  border-radius: 999px;
  font-weight: 600;
  white-space: nowrap;
  transition: background-color .2s, border-color .2s, transform .1s;
}
.btn:active { transform: scale(.98); }
/* the app's primary pairing: sky-400 fill, slate-900 label */
.btn-primary { background: #38bdf8; color: #0f172a; }
.btn-primary:hover { background: #7dd3fc; }
.btn-ghost { border: 1px solid var(--vp-c-divider); color: var(--pl-ink); }
.btn-ghost:hover { border-color: var(--vp-c-text-2); }

.link { font-weight: 500; color: var(--pl-accent); }
.link:hover { text-decoration: underline; text-underline-offset: 3px; }

.section { padding: 6rem 0; }
.final { padding-bottom: 8rem; }

.shot {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
  border: 1px solid rgba(128, 128, 128, .25);
  box-shadow: 0 30px 80px -20px rgba(2, 6, 23, .55);
}

.shots { position: relative; padding: 2.5rem 0 0 2.5rem; }
.shot-back {
  position: absolute;
  top: 0;
  right: -2.5rem;
  width: 88%;
  opacity: .45;
}
.shot-front { position: relative; }

.bento {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.cell {
  display: flex;
  flex-direction: column;
  gap: .6rem;
  min-width: 0;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.cell-wide { grid-column: span 2; }
.cell-media {
  display: grid;
  grid-template-columns: 5fr 6fr;
  align-items: center;
  gap: 1.5rem;
}
.cell-media img { width: 100%; height: auto; border-radius: 8px; }
.cell-tint {
  background:
    radial-gradient(120% 90% at 100% 0%, color-mix(in srgb, #38bdf8 22%, transparent), transparent 70%),
    var(--vp-c-bg-soft);
}
.cell code, .small code { font-size: .85em; }
.code :deep(div[class*='language-']) { margin: .5rem 0 0; border-radius: 8px; }

.keys { display: flex; gap: .4rem; }
kbd {
  padding: .35rem .7rem;
  border: 1px solid var(--vp-c-divider);
  border-bottom-width: 3px;
  border-radius: 8px;
  font-family: var(--vp-font-family-mono);
  font-size: .9rem;
  background: var(--vp-c-bg);
}

.tab {
  height: 2.3rem;
  padding: 0 1.1rem;
  border-radius: 999px;
  font-size: .92rem;
  font-weight: 500;
  color: var(--pl-muted);
  transition: background-color .2s, color .2s;
}
.tab[aria-selected='true'] { background: var(--vp-c-bg-soft); color: var(--pl-ink); }

.swatch {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  height: 2.4rem;
  padding: 0 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  font-size: .9rem;
  font-weight: 500;
  color: var(--pl-muted);
  transition: border-color .2s, color .2s;
}
.swatch .dot { width: .8rem; height: .8rem; border-radius: 999px; background: var(--sw); }
.swatch[aria-checked='true'] { border-color: var(--sw); color: var(--pl-ink); }

.stage { display: grid; }
.stage > .shot {
  grid-area: 1 / 1;
  opacity: 0;
  transition: opacity .35s ease;
}
.stage > .shot.is-on { opacity: 1; }

.steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2.5rem;
  list-style: none;
  padding: 2.5rem 0 0;
  border-top: 1px solid var(--vp-c-divider);
}

@media (max-width: 767px) {
  .section { padding: 4rem 0; }
  .shots { padding: 0; }
  .shot-back { display: none; }
  .bento, .steps, .cell-media { grid-template-columns: 1fr; }
  .cell-wide { grid-column: auto; }
}

@media (prefers-reduced-motion: no-preference) {
  .rise { animation: rise .7s cubic-bezier(.16, 1, .3, 1) both; }
  .rise-late { animation-delay: .12s; }
  .can-reveal [data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity .7s cubic-bezier(.16, 1, .3, 1), transform .7s cubic-bezier(.16, 1, .3, 1); }
  .can-reveal [data-reveal].is-in { opacity: 1; transform: none; }
}

@keyframes rise {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
}
</style>
