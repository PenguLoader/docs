<!-- PROTOTYPE (throwaway) Variant C, "Ice": the Pengu identity pushed hard. Frosted cyan and white,
     Outfit, soft 28px shapes, and the Client on physics (inertia + tilt while dragging). -->
<script setup lang="ts">
import { ref } from 'vue'
import { PhArrowRight, PhBug, PhDiscordLogo, PhDownloadSimple, PhDrop, PhFolderSimple, PhPlugsConnected } from '@phosphor-icons/vue'
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
const icons = [PhPlugsConnected, PhBug, PhDrop, PhFolderSimple]

useMotion(root, (gsap) => {
  gsap.from('.c-title-line', { opacity: 0, y: 60, rotation: 2, duration: 1, ease: 'back.out(1.6)', stagger: 0.1 })
  gsap.from('.c-lede > *', { opacity: 0, y: 20, duration: 0.8, delay: 0.3, stagger: 0.08, ease: 'power3.out' })
  gsap.from('.c-window', { opacity: 0, y: 80, rotation: -3, duration: 1.3, delay: 0.2, ease: 'elastic.out(1, 0.75)' })
  gsap.from('.c-editor', { opacity: 0, x: 40, duration: 1, delay: 0.6, ease: 'power3.out' })
  gsap.to('.c-shard', { y: -24, rotation: '+=6', duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 1.5 })
  for (const t of gsap.utils.toArray('[data-reveal]') as HTMLElement[]) {
    gsap.from(t, { opacity: 0, y: 50, scale: 0.97, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: t, start: 'top 88%' } })
  }

})
</script>

<template>
  <div ref="root" class="vc">
    <section class="c-hero">
      <div class="c-ice" aria-hidden="true">
        <span class="c-shard c-shard-1" />
        <span class="c-shard c-shard-2" />
      </div>
      <div class="c-wrap">
        <div class="c-top">
          <h1 class="c-title">
            <span v-for="l in hero.title" :key="l" class="c-title-line">{{ l }}</span>
          </h1>
          <div class="c-lede">
            <p class="c-sub">{{ hero.sub }}</p>
            <div class="c-cta">
              <p v-if="dl.mobile.value" class="c-note">Available for Windows and macOS.</p>
              <a v-else :href="dl.href.value" class="c-btn"><PhDownloadSimple :size="18" weight="bold" />{{ dl.label.value }}</a>
              <a :href="hero.secondary.href" class="c-btn c-btn-soft">{{ hero.secondary.text }}</a>
            </div>
          </div>
        </div>
        <div class="c-stage">
          <div class="c-window"><ClientWindow :demo="demo" :inertia="true" :tilt="true" bounds=".c-hero" /></div>
          <div class="c-editor"><CodePanel :demo="demo" /></div>
        </div>
        <p class="c-hint">{{ hero.demoHint }}</p>
      </div>
    </section>

    <AppOverview />

    <section class="c-comm">
      <div class="c-wrap">
        <div class="c-head" data-reveal>
          <h2 class="c-h2">{{ community.title }}</h2>
          <p class="c-body">{{ community.body }}</p>
        </div>
        <div class="c-gallery">
          <figure v-for="t in community.themes" :key="t.name" class="c-theme" data-reveal>
            <img :src="t.src" :alt="`The lobby with the ${t.name} theme`" loading="lazy" width="1600" height="900">
            <figcaption><a :href="t.href" target="_blank" rel="noopener">{{ t.name }}</a><span>by {{ t.author }}</span></figcaption>
          </figure>
        </div>
        <div class="c-plugins" data-reveal>
          <a v-for="p in community.plugins" :key="p.name" :href="p.href" target="_blank" rel="noopener" class="c-plugin">
            <h3>{{ p.name }}</h3>
            <p>{{ p.body }}</p>
            <span>by {{ p.author }}</span>
          </a>
          <a :href="community.share.href" target="_blank" rel="noopener" class="c-plugin c-plugin-share">
            <PhDiscordLogo :size="28" weight="duotone" />
            <h3>{{ community.share.text }}</h3>
          </a>
        </div>
      </div>
    </section>

    <section class="c-dev">
      <div class="c-wrap c-dev-grid">
        <div data-reveal>
          <h2 class="c-h2">{{ authors.title }}</h2>
          <p class="c-body">{{ authors.body }}</p>
          <div class="c-devlinks">
            <a v-for="l in authors.links" :key="l.href" :href="l.href" class="c-chip">{{ l.text }}<PhArrowRight :size="15" /></a>
          </div>
        </div>
        <div class="c-code" data-reveal>
          <div class="c-code-bar">plugins/hello/index.js</div>
          <CodeBlock :code="authors.code" />
        </div>
        <div class="c-tiles" data-reveal>
          <div v-for="(p, i) in authors.points" :key="p.title" class="c-tile" :class="`c-tile-${i}`">
            <component :is="icons[i]" :size="26" weight="duotone" />
            <h3>{{ p.title }}</h3>
            <p>{{ p.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="c-dl">
      <div class="c-wrap">
        <div class="c-dl-card" data-reveal>
          <!-- mascot slot: reserved for the animated Pengu, see BRIEF.md -->
          <div class="c-mascot-slot" aria-hidden="true" />
          <h2 class="c-h2 c-dl-title">{{ download.title }}</h2>
          <p class="c-body">{{ download.body }}</p>
          <p v-if="dl.mobile.value" class="c-note">Available for Windows and macOS.</p>
          <a v-else :href="dl.href.value" class="c-btn c-btn-lg"><PhDownloadSimple :size="20" weight="bold" />{{ dl.label.value }}</a>
          <div class="c-dl-links">
            <a :href="download.other.href">{{ download.other.text }}</a>
            <a :href="download.discord.href" target="_blank" rel="noopener">{{ download.discord.text }}</a>
          </div>
          <p class="c-trust">{{ download.trust }}</p>
        </div>
      </div>
    </section>

    <footer class="c-foot"><div class="c-wrap"><p>{{ riot }}</p></div></footer>
  </div>
</template>

<style scoped>
.vc {
  --bg: #03101c;
  --ink: #e3f4ff;
  --muted: #8fb0c9;
  --accent: #38bdf8;
  --on-accent: #03101c;
  --card: rgb(14 44 70 / 0.55);
  --card-solid: #0a2033;
  --line: rgb(125 211 252 / 0.16);
  --font: 'Outfit', system-ui, sans-serif;
  --cp-fg: var(--ink);
  --cp-dim: #8aa8c0;
  --cp-dim-strong: #8fb0c9;
  --cp-accent: var(--accent);
  --cp-on-accent: var(--on-accent);
  --cp-border: var(--line);
  --cp-select: rgb(56 189 248 / 0.22);
  --cp-mono: 'Geist Mono', ui-monospace, monospace;
  --cp-sans: var(--font);
  --cp-kw: #67e8f9;
  --cp-str: #bef264;
  --cp-num: #fda4af;
  --cp-prop: #e0f2fe;
  --cp-sel: #fde68a;
  --cw-gutter: 12px;
  --cw-radius: 28px;
  --cw-screen-radius: 16px;
  --cw-frame-bg: rgb(186 230 253 / 0.12);
  --cw-frame-border: rgb(186 230 253 / 0.3);
  --cw-shadow: 0 50px 120px -40px rgb(0 20 40 / 0.9), inset 0 1px 0 rgb(255 255 255 / 0.25);
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font);
  overflow-x: clip;
}
html:not(.dark) .vc {
  --bg: #eef7fd;
  --ink: #0a2440;
  --muted: #47627d;
  --accent: #0284c7;
  --on-accent: #ffffff;
  --card: rgb(255 255 255 / 0.62);
  --card-solid: #ffffff;
  --line: rgb(10 36 64 / 0.1);
  --cp-dim: #56708a;
  --cp-dim-strong: #56708a;
  --cp-select: rgb(2 132 199 / 0.15);
  --cp-kw: #0369a1;
  --cp-str: #4d7c0f;
  --cp-num: #be123c;
  --cp-prop: #0a2440;
  --cp-sel: #a16207;
  --cw-frame-bg: rgb(255 255 255 / 0.55);
  --cw-frame-border: rgb(255 255 255 / 0.9);
  --cw-shadow: 0 50px 120px -40px rgb(2 60 110 / 0.45), inset 0 1px 0 rgb(255 255 255 / 0.9);
}

.c-wrap { max-width: 1320px; margin: 0 auto; padding: 0 24px; }

/* hero */
.c-hero { position: relative; padding: 56px 0 88px; isolation: isolate; }
.c-ice {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(45% 50% at 85% 25%, rgb(56 189 248 / 0.45), transparent 70%),
    radial-gradient(40% 45% at 15% 75%, rgb(45 212 191 / 0.28), transparent 70%),
    radial-gradient(35% 40% at 55% 95%, rgb(59 130 246 / 0.35), transparent 70%),
    var(--bg);
}
html:not(.dark) .c-ice {
  background:
    radial-gradient(45% 50% at 85% 20%, rgb(125 211 252 / 0.85), transparent 70%),
    radial-gradient(40% 45% at 10% 80%, rgb(153 246 228 / 0.7), transparent 70%),
    radial-gradient(35% 40% at 55% 100%, rgb(147 197 253 / 0.75), transparent 70%),
    var(--bg);
}
.c-shard {
  position: absolute;
  width: 420px;
  height: 420px;
  background: conic-gradient(from 200deg, rgb(255 255 255 / 0.5), rgb(186 230 253 / 0.1), rgb(255 255 255 / 0.35), transparent);
  clip-path: polygon(50% 0, 100% 38%, 78% 100%, 18% 88%, 0 30%);
  filter: blur(1px);
  opacity: 0.35;
}
.c-shard-1 { top: 6%; right: 4%; transform: rotate(18deg); }
.c-shard-2 { bottom: 4%; left: -60px; width: 300px; height: 300px; transform: rotate(-24deg); }

.c-top { display: grid; grid-template-columns: minmax(0, 8fr) minmax(0, 4fr); gap: 48px; align-items: end; }
.c-title {
  margin: 0;
  font-weight: 800;
  font-size: clamp(2.4rem, 4.3vw, 4.1rem);
  line-height: 0.98;
  letter-spacing: -0.035em;
}
.c-title-line { display: block; }
.c-title-line + .c-title-line { color: var(--accent); }
.c-sub { margin: 0; font-size: 1.12rem; line-height: 1.55; color: var(--muted); max-width: 40ch; }
.c-cta { margin-top: 22px; display: flex; flex-wrap: wrap; gap: 10px; }
.c-btn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 50px;
  padding: 0 24px;
  border-radius: 999px;
  background: var(--accent);
  color: var(--on-accent);
  font-weight: 600;
  font-size: 15.5px;
  box-shadow: 0 14px 34px -14px rgb(2 132 199 / 0.8), inset 0 1px 0 rgb(255 255 255 / 0.35);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s;
}
.c-btn:hover { transform: translateY(-2px) scale(1.02); }
.c-btn:active { transform: scale(0.97); }
.c-btn-soft { background: var(--card); color: var(--ink); border: 1px solid var(--line); box-shadow: none; backdrop-filter: blur(12px); }
.c-btn-lg { height: 58px; padding: 0 30px; font-size: 17px; }
.c-note { margin: 0; color: var(--muted); }

.c-stage { position: relative; margin-top: 48px; display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 24px; align-items: center; }
.c-window { position: relative; z-index: 2; }
.c-editor {
  position: relative;
  z-index: 3;
  margin-left: 0;
  transform: translateY(32px);
  height: 420px;
  display: flex;
  padding: 20px 20px 12px;
  border-radius: 28px;
  background: var(--card);
  border: 1px solid var(--line);
  backdrop-filter: blur(22px) saturate(1.4);
  box-shadow: 0 30px 80px -30px rgb(0 20 40 / 0.6), inset 0 1px 0 rgb(255 255 255 / 0.2);
}
.c-editor > * { flex: 1; }
.c-hint { margin: 18px 6px 0; font-size: 14px; color: var(--muted); }

.c-head { max-width: 620px; }
.c-h2 { margin: 0; font-weight: 700; font-size: clamp(2rem, 3.6vw, 3.2rem); line-height: 1.05; letter-spacing: -0.03em; }
.c-body { margin: 16px 0 0; font-size: 1.1rem; line-height: 1.6; color: var(--muted); }
/* community: offset two-column gallery */
.c-comm { padding: 120px 0 40px; }
.c-gallery { margin-top: 56px; display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
.c-theme { margin: 0; }
.c-theme:nth-child(even) { transform: translateY(90px); }
.c-theme img { display: block; width: 100%; height: auto; border-radius: 24px; border: 1px solid var(--line); }
.c-theme figcaption { margin: 12px 8px 0; display: flex; gap: 8px; align-items: baseline; }
.c-theme figcaption a { color: var(--ink); font-weight: 600; font-size: 1.1rem; }
.c-theme figcaption a:hover { color: var(--accent); }
.c-theme figcaption span { color: var(--muted); font-size: 0.95rem; }
.c-plugins { margin-top: 150px; display: grid; grid-template-columns: 1fr 1fr 0.8fr; gap: 16px; }
.c-plugin {
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 24px;
  background: var(--card);
  border: 1px solid var(--line);
  color: inherit;
  backdrop-filter: blur(12px);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.c-plugin:hover { transform: translateY(-4px); }
.c-plugin h3 { margin: 0; font-size: 1.1rem; font-weight: 600; }
.c-plugin p { margin: 8px 0 14px; color: var(--muted); line-height: 1.55; }
.c-plugin span { margin-top: auto; font-size: 0.9rem; color: var(--muted); }
.c-plugin-share { justify-content: space-between; background: var(--accent); color: var(--on-accent); border-color: transparent; }
.c-plugin-share h3 { margin-top: 20px; }

/* authors */
.c-dev { padding: 140px 0 40px; }
.c-dev-grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 32px 56px; align-items: start; }
.c-devlinks { margin-top: 28px; display: flex; flex-wrap: wrap; gap: 10px; }
.c-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--ink);
  font-weight: 500;
  font-size: 14.5px;
}
.c-chip:hover { border-color: var(--accent); color: var(--accent); }
.c-code { border-radius: 28px; background: var(--card-solid); border: 1px solid var(--line); overflow: hidden; }
.c-code-bar { padding: 14px 24px; border-bottom: 1px solid var(--line); font-family: var(--cp-mono); font-size: 12px; color: var(--muted); }
.c-code :deep(.cb) { padding: 22px 24px; font-size: 14px; }
.c-tiles { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.c-tile { padding: 24px; border-radius: 24px; border: 1px solid var(--line); }
.c-tile svg { color: var(--accent); }
.c-tile h3 { margin: 16px 0 0; font-size: 1.05rem; font-weight: 600; }
.c-tile p { margin: 8px 0 0; color: var(--muted); line-height: 1.55; font-size: 0.95rem; }
.c-tile-0 { background: linear-gradient(160deg, rgb(56 189 248 / 0.22), transparent 70%), var(--card); }
.c-tile-1 { background: var(--card); }
.c-tile-2 { background: linear-gradient(160deg, rgb(45 212 191 / 0.22), transparent 70%), var(--card); }
.c-tile-3 { background: var(--card); }

/* download */
.c-dl { padding: 120px 0; }
.c-dl-card {
  position: relative;
  padding: 72px 32px 64px;
  border-radius: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  border: 1px solid var(--line);
  background:
    radial-gradient(60% 80% at 50% 0%, rgb(56 189 248 / 0.35), transparent 70%),
    radial-gradient(50% 60% at 100% 100%, rgb(45 212 191 / 0.2), transparent 70%),
    var(--card);
}
.c-mascot-slot { height: 88px; }
.c-dl-title { font-size: clamp(2.4rem, 5vw, 4.2rem); }
.c-dl-card .c-body { margin-bottom: 32px; }
.c-dl-links { display: flex; gap: 24px; margin-top: 24px; }
.c-dl-links a { color: var(--ink); font-weight: 500; text-decoration: underline; text-decoration-color: var(--line); text-underline-offset: 4px; }
.c-dl-links a:hover { color: var(--accent); }
.c-trust { margin: 32px 0 0; color: var(--muted); font-size: 0.95rem; }
.c-foot { padding: 0 0 96px; }
.c-foot p { margin: 0 auto; max-width: 900px; text-align: center; font-size: 11px; line-height: 1.6; color: var(--muted); opacity: 0.75; }

@media (max-width: 1023px) {
  .c-top, .c-dev-grid { grid-template-columns: minmax(0, 1fr); }
  .c-stage { grid-template-columns: minmax(0, 1fr); gap: 24px; }
  .c-editor { margin-left: 0; height: 380px; transform: none; }
  .c-tiles { grid-template-columns: 1fr 1fr; }
  .c-plugins { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 767px) {
  .c-wrap { padding: 0 16px; }
  .c-hero { padding-top: 32px; }
  .c-hint { display: none; } /* no dragging on phones */
  .c-comm, .c-dev { padding-top: 80px; }
  .c-gallery, .c-tiles, .c-plugins { grid-template-columns: minmax(0, 1fr); }
  .c-theme:nth-child(even) { transform: none; }
  .c-plugins { margin-top: 48px; }
  .c-dl-card { padding: 48px 20px; border-radius: 28px; }
  .c-shard { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition: none !important; scroll-behavior: auto !important; }
}
</style>
