<!-- The chosen landing direction (B, "Raycast clean"): neutral zinc, sky-400 as the single accent,
     Geist throughout, restrained motion. The Client and the editor share one workbench surface.
     The other directions (A, C, D) are in commit c08577a on prototype/landing. -->
<script setup lang="ts">
import { ref } from 'vue'
import './fonts.css'
import { PhArrowRight, PhArrowUpRight, PhBug, PhDiscordLogo, PhDownloadSimple, PhDrop, PhFolderSimple, PhPlugsConnected } from '@phosphor-icons/vue'
import ClientWindow from './ClientWindow.vue'
import AppOverview from './AppOverview.vue'
import CodePanel from './CodePanel.vue'
import CodeBlock from './CodeBlock.vue'
import { useClientDemo } from './useClientDemo'
import { useDownload } from './useDownload'
import { useMotion } from './useMotion'
import { authors, community, download, hero, riot } from './copy'

const demo = useClientDemo()
const dl = useDownload()
const root = ref<HTMLElement>()
const docked = ref(false) // resized Client: the editor lives in the window's dock until reset
const icons = [PhPlugsConnected, PhBug, PhDrop, PhFolderSimple]

useMotion(root, (gsap) => {
  gsap.from('.b-intro > *', { opacity: 0, y: 14, duration: 0.7, stagger: 0.06, ease: 'power2.out' })
  gsap.from('.b-bench', { opacity: 0, y: 32, duration: 0.9, delay: 0.25, ease: 'power3.out' })
  for (const t of gsap.utils.toArray('[data-reveal]') as HTMLElement[]) {
    gsap.from(t, { opacity: 0, y: 24, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: t, start: 'top 88%' } })
  }
})
</script>

<template>
  <div ref="root" class="vb">
    <section class="b-hero">
      <div class="b-grid-bg" aria-hidden="true" />
      <div class="b-wrap">
        <div class="b-intro">
          <h1 class="b-title">{{ hero.title[0] }}<br><span>{{ hero.title[1] }}</span></h1>
          <p class="b-sub">{{ hero.sub }}</p>
          <div class="b-cta">
            <p v-if="dl.mobile.value" class="b-note">Available for Windows and macOS.</p>
            <a v-else :href="dl.href.value" class="b-btn"><PhDownloadSimple :size="17" weight="bold" />{{ dl.label.value }}</a>
            <a :href="hero.secondary.href" class="b-btn b-btn-ghost">{{ hero.secondary.text }}</a>
          </div>
        </div>

        <div class="b-bench" :class="{ 'is-docked': docked }">
          <div class="b-bench-client">
            <ClientWindow v-model:docked="docked" :demo="demo" bounds=".b-hero" />
          </div>
          <aside v-show="!docked" class="b-bench-code">
            <!-- moved, not remounted, so the code, cursor and undo history carry over -->
            <Teleport defer to="#cw-dock" :disabled="!docked">
              <CodePanel :demo="demo" />
            </Teleport>
          </aside>
        </div>
        <p class="b-hint">{{ hero.demoHint }}</p>
      </div>
    </section>

    <AppOverview />

    <section class="b-section">
      <div class="b-wrap">
        <div class="b-head" data-reveal>
          <h2 class="b-h2">{{ community.title }}</h2>
          <p class="b-body">{{ community.body }}</p>
        </div>
        <div class="b-themes" data-reveal>
          <figure v-for="t in community.themes" :key="t.name" class="b-theme">
            <img :src="t.src" :alt="`The lobby with the ${t.name} theme`" loading="lazy" width="1600" height="900">
            <figcaption>
              <a :href="t.href" target="_blank" rel="noopener">{{ t.name }}</a>
              <span>by {{ t.author }}</span>
            </figcaption>
          </figure>
        </div>
        <div class="b-plugins" data-reveal>
          <a v-for="p in community.plugins" :key="p.name" :href="p.href" target="_blank" rel="noopener" class="b-plugin">
            <div>
              <h3>{{ p.name }} <span>by {{ p.author }}</span></h3>
              <p>{{ p.body }}</p>
            </div>
            <PhArrowUpRight :size="18" class="b-plugin-arrow" />
          </a>
        </div>
        <a :href="community.share.href" class="b-textlink" target="_blank" rel="noopener"><PhDiscordLogo :size="18" />{{ community.share.text }}</a>
      </div>
    </section>

    <section class="b-section">
      <div class="b-wrap">
        <div class="b-head" data-reveal>
          <h2 class="b-h2">{{ authors.title }}</h2>
          <p class="b-body">{{ authors.body }}</p>
        </div>
        <div class="b-code" data-reveal>
          <div class="b-code-bar"><span>plugins/hello/index.js</span></div>
          <CodeBlock :code="authors.code" />
        </div>
        <div class="b-points" data-reveal>
          <div v-for="(p, i) in authors.points" :key="p.title" class="b-point">
            <component :is="icons[i]" :size="20" class="b-point-icon" />
            <h3>{{ p.title }}</h3>
            <p>{{ p.body }}</p>
          </div>
        </div>
        <div class="b-devlinks" data-reveal>
          <a v-for="l in authors.links" :key="l.href" :href="l.href" class="b-textlink">{{ l.text }}<PhArrowRight :size="15" /></a>
        </div>
      </div>
    </section>

    <section class="b-section b-dl-section">
      <div class="b-wrap">
        <div class="b-dl" data-reveal>
          <div class="b-dl-copy">
            <h2 class="b-h2">{{ download.title }}</h2>
            <p class="b-body">{{ download.body }}</p>
            <p class="b-trust">{{ download.trust }}</p>
          </div>
          <div class="b-dl-actions">
            <!-- mascot slot: reserved for the animated Pengu, see BRIEF.md -->
            <div class="b-mascot-slot" aria-hidden="true" />
            <p v-if="dl.mobile.value" class="b-note">Available for Windows and macOS.</p>
            <a v-else :href="dl.href.value" class="b-btn b-btn-lg"><PhDownloadSimple :size="18" weight="bold" />{{ dl.label.value }}</a>
            <div class="b-dl-links">
              <a :href="download.other.href" class="b-textlink">{{ download.other.text }}</a>
              <a :href="download.discord.href" class="b-textlink" target="_blank" rel="noopener">{{ download.discord.text }}</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="b-foot"><div class="b-wrap"><p>{{ riot }}</p></div></footer>
  </div>
</template>

<style scoped>
.vb {
  --bg: #0b0b0d;
  --panel: #121215;
  --panel-2: #17171b;
  --line: rgb(255 255 255 / 0.08);
  --line-strong: rgb(255 255 255 / 0.14);
  --ink: #ededf0;
  --muted: #8d8d98;
  --accent: #38bdf8;
  --on-accent: #04121c;
  --sans: 'Geist', system-ui, sans-serif;
  --cp-fg: var(--ink);
  --cp-dim: #92929d;
  --cp-dim-strong: #8d8d98;
  --cp-accent: var(--accent);
  --cp-on-accent: var(--on-accent);
  --cp-border: var(--line);
  --cp-select: rgb(56 189 248 / 0.2);
  --cp-mono: 'Geist Mono', ui-monospace, monospace;
  --cp-sans: var(--sans);
  --cp-pill-radius: 8px;
  --cp-kw: #7dd3fc;
  --cp-str: #a5d6a7;
  --cp-num: #f0abfc;
  --cp-prop: #e4e4e7;
  --cp-sel: #fcd34d;
  --cw-gutter: 8px;
  --cw-radius: 10px;
  --cw-screen-radius: 6px;
  --cw-frame-bg: transparent;
  --cw-frame-border: var(--line-strong);
  --cw-shadow: none;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
}
html:not(.dark) .vb {
  --bg: #fafafa;
  --panel: #ffffff;
  --panel-2: #f4f4f5;
  --line: rgb(0 0 0 / 0.07);
  --line-strong: rgb(0 0 0 / 0.12);
  --ink: #111114;
  --muted: #5f5f6b;
  --accent: #0284c7;
  --on-accent: #ffffff;
  --cp-dim: #6b6b76;
  --cp-dim-strong: #6b6b76;
  --cp-select: rgb(2 132 199 / 0.15);
  --cp-kw: #0369a1;
  --cp-str: #15803d;
  --cp-num: #a21caf;
  --cp-prop: #27272a;
  --cp-sel: #b45309;
}

.b-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

.b-hero { position: relative; padding: 72px 0 40px; isolation: isolate; }
.b-grid-bg {
  position: absolute;
  inset: 0 0 20%;
  z-index: -1;
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(70% 60% at 50% 0%, #000 30%, transparent 75%);
}
.b-intro { max-width: 720px; }
.b-title {
  margin: 0;
  font-size: clamp(2.3rem, 4.6vw, 3.9rem);
  line-height: 1.04;
  font-weight: 600;
  letter-spacing: -0.035em;
}
.b-title span { color: var(--muted); }
.b-sub { margin: 20px 0 0; max-width: 52ch; font-size: 1.1rem; line-height: 1.6; color: var(--muted); }
.b-cta { margin-top: 28px; display: flex; flex-wrap: wrap; gap: 10px; }
.b-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 18px;
  border-radius: 8px;
  background: var(--accent);
  color: var(--on-accent);
  font-weight: 500;
  font-size: 14.5px;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.25);
  transition: filter 0.15s, transform 0.15s;
}
.b-btn:hover { filter: brightness(1.08); }
.b-btn:active { transform: scale(0.98); }
.b-btn-ghost {
  background: var(--panel);
  color: var(--ink);
  border: 1px solid var(--line-strong);
  box-shadow: none;
}
.b-btn-lg { height: 48px; padding: 0 22px; font-size: 15px; }
.b-note { margin: 0; color: var(--muted); }

.b-bench {
  margin-top: 56px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  border: 1px solid var(--line-strong);
  border-radius: 14px;
  background: transparent;
  box-shadow: 0 30px 80px -40px rgb(0 0 0 / 0.5);
  overflow: visible;
}
.b-bench-client { padding: 14px; border-right: 1px solid var(--line); }
.b-bench.is-docked { grid-template-columns: minmax(0, 1fr); }
.b-bench.is-docked .b-bench-client { border-right: 0; }
.b-bench-code { min-height: 400px; padding: 16px 16px 10px; display: flex; background: var(--panel); border-radius: 0 14px 14px 0; }
.b-bench-code > * { flex: 1; }
.b-hint { margin: 14px 2px 0; font-size: 13px; color: var(--muted); }

.b-section { padding: 120px 0 0; }
.b-head { max-width: 640px; }
.b-h2 { margin: 0; font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 600; letter-spacing: -0.03em; line-height: 1.1; }
.b-body { margin: 14px 0 0; font-size: 1.05rem; line-height: 1.6; color: var(--muted); }

.b-themes { margin-top: 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.b-theme { margin: 0; }
.b-theme img { display: block; width: 100%; height: auto; border-radius: 10px; border: 1px solid var(--line); }
.b-theme figcaption { margin-top: 10px; display: flex; justify-content: space-between; font-size: 14px; }
.b-theme figcaption a { color: var(--ink); font-weight: 500; }
.b-theme figcaption a:hover { color: var(--accent); }
.b-theme figcaption span { color: var(--muted); }
.b-plugins { margin-top: 40px; border-top: 1px solid var(--line); }
.b-plugin {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 4px;
  border-bottom: 1px solid var(--line);
  color: inherit;
  transition: background-color 0.15s;
}
.b-plugin:hover { background: var(--panel); }
.b-plugin h3 { margin: 0; font-size: 15px; font-weight: 500; }
.b-plugin h3 span { color: var(--muted); font-weight: 400; margin-left: 6px; }
.b-plugin p { margin: 4px 0 0; color: var(--muted); font-size: 14px; }
.b-plugin-arrow { color: var(--muted); flex: none; }
.b-plugin:hover .b-plugin-arrow { color: var(--accent); }
.b-textlink { display: inline-flex; align-items: center; gap: 6px; margin-top: 24px; color: var(--ink); font-weight: 500; font-size: 14.5px; }
.b-textlink:hover { color: var(--accent); }

.b-code { margin-top: 44px; border: 1px solid var(--line-strong); border-radius: 12px; background: var(--panel); overflow: hidden; }
.b-code-bar { padding: 10px 16px; border-bottom: 1px solid var(--line); font-family: var(--cp-mono); font-size: 12px; color: var(--muted); background: var(--panel-2); }
.b-code :deep(.cb) { padding: 20px; font-size: 14px; }
.b-points { margin-top: 40px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 32px; }
.b-point { padding-top: 16px; border-top: 1px solid var(--line-strong); }
.b-point-icon { color: var(--accent); }
.b-point h3 { margin: 12px 0 0; font-size: 15px; font-weight: 500; }
.b-point p { margin: 6px 0 0; font-size: 14px; line-height: 1.55; color: var(--muted); }
.b-devlinks { display: flex; flex-wrap: wrap; gap: 28px; }

.b-dl-section { padding-bottom: 120px; }
.b-dl {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 48px;
  align-items: end;
  padding: 48px;
  border: 1px solid var(--line-strong);
  border-radius: 16px;
  background:
    radial-gradient(60% 120% at 100% 100%, rgb(56 189 248 / 0.14), transparent 60%),
    var(--panel);
}
.b-trust { margin: 22px 0 0; font-size: 14px; color: var(--muted); }
.b-dl-actions { display: flex; flex-direction: column; align-items: flex-start; }
.b-mascot-slot { height: 0; }
.b-dl-links { display: flex; gap: 24px; }
.b-dl-links .b-textlink { margin-top: 18px; }
.b-foot { padding: 24px 0 96px; border-top: 1px solid var(--line); }
.b-foot p { margin: 0; font-size: 11px; line-height: 1.6; color: var(--muted); opacity: 0.75; }

@media (max-width: 1023px) {
  .b-bench { grid-template-columns: minmax(0, 1fr); }
  .b-bench-client { border-right: 0; border-bottom: 1px solid var(--line); }
  .b-bench-code { height: 360px; }
  .b-points { grid-template-columns: 1fr 1fr; }
  .b-dl { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 767px) {
  .b-wrap { padding: 0 16px; }
  .b-hero { padding-top: 40px; }
  .b-hint { display: none; } /* no dragging on phones */
  .b-section { padding-top: 80px; }
  .b-themes, .b-points { grid-template-columns: minmax(0, 1fr); }
  .b-dl { padding: 28px 20px; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition: none !important; scroll-behavior: auto !important; }
}
</style>
