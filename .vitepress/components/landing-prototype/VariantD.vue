<!-- PROTOTYPE (throwaway) Variant D, "Instrument": modelled on cominvi.com.mx. White, technical and
     monochrome, Geist with tiny mono labels, a full-bleed dark hero, a facts grid, and the
     "Minerals we extract" pinned stage turned into a scroll-driven tour of what a plugin changes. -->
<script setup lang="ts">
import { ref } from 'vue'
import {
  PhArrowDown, PhArrowRight, PhArrowUpRight, PhBug, PhCheckSquare, PhDiscordLogo, PhDownloadSimple, PhDrop,
  PhFileJs, PhMonitor, PhPalette, PhPower, PhScales, PhShieldCheck, PhStorefront, PhSwatches,
} from '@phosphor-icons/vue'
import ClientShowcase from './ClientShowcase.vue'
import CodeBlock from './CodeBlock.vue'
import { useDownload } from './useDownload'
import { useMotion } from './useMotion'
import { app, authors, community, d, download, hero, riot } from './copy'

const dl = useDownload()
const root = ref<HTMLElement>()
const factIcons = [PhFileJs, PhShieldCheck, PhDrop, PhPalette, PhMonitor, PhScales]
const featureIcons = [PhPower, PhCheckSquare, PhStorefront, PhSwatches, PhBug]

useMotion(root, (gsap) => {
  gsap.from('.d-hero-bg', { scale: 1.12, duration: 2.4, ease: 'power2.out' })
  gsap.from('.d-hero-copy > *', { opacity: 0, y: 24, duration: 1, stagger: 0.1, delay: 0.2, ease: 'power3.out' })
  gsap.from('.d-hero-card', { opacity: 0, x: 24, duration: 0.9, stagger: 0.1, delay: 0.6, ease: 'power3.out' })
  // the statement reads in: words go from faint to ink as it scrolls through
  gsap.fromTo('.d-statement .w', { opacity: 0.18 }, {
    opacity: 1, stagger: 0.05, ease: 'none',
    scrollTrigger: { trigger: '.d-statement', start: 'top 80%', end: 'bottom 45%', scrub: true },
  })
  for (const t of gsap.utils.toArray('[data-reveal]') as HTMLElement[]) {
    gsap.from(t, { opacity: 0, y: 28, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: t, start: 'top 88%' } })
  }
  gsap.from('.d-fact', { opacity: 0, y: 16, duration: 0.6, stagger: 0.07, ease: 'power2.out', scrollTrigger: { trigger: '.d-facts', start: 'top 80%' } })
})
</script>

<template>
  <div ref="root" class="vd">
    <section class="d-hero">
      <img class="d-hero-bg" src="/client/lobby-poster.webp" alt="" width="2560" height="1440" fetchpriority="high">
      <div class="d-hero-shade" aria-hidden="true" />
      <div class="d-hero-inner">
        <div class="d-hero-copy">
          <h1 class="d-title">{{ hero.title[0] }}<br>{{ hero.title[1] }}</h1>
          <p class="d-hero-sub">{{ hero.sub }}</p>
          <div class="d-cta">
            <p v-if="dl.mobile.value" class="d-note">Available for Windows and macOS.</p>
            <a v-else :href="dl.href.value" class="d-btn d-btn-light"><PhDownloadSimple :size="17" weight="bold" />{{ dl.label.value }}</a>
            <a :href="hero.secondary.href" class="d-btn d-btn-ghost">{{ hero.secondary.text }}</a>
          </div>
        </div>
        <nav class="d-hero-cards" aria-label="On this page">
          <a v-for="c in d.cards" :key="c.href" :href="c.href" class="d-hero-card">
            <img :src="c.img" alt="" width="1600" height="900">
            <span>{{ c.label }}<PhArrowDown :size="12" weight="bold" /></span>
          </a>
        </nav>
      </div>
    </section>

    <section class="d-sec d-intro">
      <div class="d-wrap">
        <span class="d-tag">Pengu Loader</span>
        <p class="d-statement">
          <span v-for="(w, i) in d.statement.split(' ')" :key="i" class="w">{{ `${w} ` }}</span>
        </p>
      </div>
    </section>

    <section class="d-sec d-facts-sec">
      <div class="d-wrap d-facts-grid">
        <figure class="d-facts-img" data-reveal>
          <img src="/home/community/irelia.webp" alt="The Client lobby with a community theme" loading="lazy" width="1600" height="900">
        </figure>
        <div class="d-facts">
          <div v-for="(f, i) in d.facts" :key="f.label" class="d-fact">
            <component :is="factIcons[i]" :size="20" class="d-fact-icon" />
            <strong>{{ f.value }}</strong>
            <span>{{ f.label }}</span>
          </div>
          <p class="d-facts-body">{{ d.factsBody }}</p>
        </div>
      </div>
    </section>

    <div id="showcase" class="d-showcase">
      <ClientShowcase />
    </div>

    <section class="d-sec d-alt">
      <div class="d-wrap">
        <span class="d-tag">The app</span>
        <p class="d-lead" data-reveal>{{ app.title }}. <span>{{ app.body }}</span></p>
        <div class="d-cards" data-reveal>
          <article v-for="(f, i) in d.features" :key="f.title" class="d-card">
            <component :is="featureIcons[i]" :size="22" />
            <div>
              <h3>{{ f.title }}</h3>
              <p>{{ f.body }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="community" class="d-sec">
      <div class="d-wrap">
        <h2 class="d-h2" data-reveal>{{ community.title }}</h2>
        <p class="d-body" data-reveal>{{ community.body }}</p>
        <div class="d-themes" data-reveal>
          <figure v-for="t in community.themes" :key="t.name" class="d-theme">
            <img :src="t.src" :alt="`The lobby with the ${t.name} theme`" loading="lazy" width="1600" height="900">
            <figcaption>
              <a :href="t.href" target="_blank" rel="noopener">{{ t.name }}</a>
              <span>{{ t.author }}</span>
            </figcaption>
          </figure>
        </div>
        <div class="d-rows" data-reveal>
          <a v-for="p in community.plugins" :key="p.name" :href="p.href" target="_blank" rel="noopener" class="d-row">
            <span class="d-row-name">{{ p.name }}</span>
            <span class="d-row-body">{{ p.body }}</span>
            <span class="d-row-by">{{ p.author }}</span>
            <PhArrowUpRight :size="16" />
          </a>
        </div>
        <a :href="community.share.href" class="d-link" target="_blank" rel="noopener"><PhDiscordLogo :size="17" />{{ community.share.text }}</a>
      </div>
    </section>

    <section class="d-sec d-dev">
      <div class="d-wrap d-dev-grid">
        <div data-reveal>
          <h2 class="d-h2">{{ authors.title }}</h2>
          <p class="d-body">{{ authors.body }}</p>
          <div class="d-devlinks">
            <a v-for="l in authors.links" :key="l.href" :href="l.href" class="d-link">{{ l.text }}<PhArrowRight :size="15" /></a>
          </div>
        </div>
        <div class="d-code" data-reveal>
          <div class="d-code-bar">plugins/hello/index.js</div>
          <CodeBlock :code="authors.code" />
        </div>
      </div>
    </section>

    <section class="d-dl">
      <div class="d-wrap d-dl-inner" data-reveal>
        <div>
          <h2 class="d-dl-title">{{ download.title }}</h2>
          <p class="d-dl-body">{{ download.body }} {{ download.trust }}</p>
        </div>
        <div class="d-dl-actions">
          <!-- mascot slot: reserved for the animated Pengu, see BRIEF.md -->
          <div class="d-mascot-slot" aria-hidden="true" />
          <p v-if="dl.mobile.value" class="d-note">Available for Windows and macOS.</p>
          <a v-else :href="dl.href.value" class="d-btn d-btn-light d-btn-lg"><PhDownloadSimple :size="18" weight="bold" />{{ dl.label.value }}</a>
          <div class="d-dl-links">
            <a :href="download.other.href">{{ download.other.text }}</a>
            <a :href="download.discord.href" target="_blank" rel="noopener">{{ download.discord.text }}</a>
          </div>
        </div>
      </div>
      <p class="d-riot">{{ riot }}</p>
    </section>
  </div>
</template>

<style scoped>
.vd {
  --bg: #ffffff;
  --bg-alt: #e9eeeb;
  --card: #ffffff;
  --ink: #111312;
  --muted: #6c716e;
  --faint: #d3d7d4;
  --tick: #d9ddda;
  --line: rgb(17 19 18 / 0.1);
  --dark: #0d0f0e;
  --sans: 'Geist', system-ui, sans-serif;
  --cp-fg: var(--ink);
  --cp-dim: #9aa09c;
  --cp-dim-strong: #6c716e;
  --cp-mono: 'Geist Mono', ui-monospace, monospace;
  --cp-kw: #0f766e;
  --cp-str: #9a3412;
  --cp-num: #7c3aed;
  --cp-prop: #111312;
  --cp-sel: #1d4ed8;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
}
html.dark .vd {
  --bg: #0d0f0e;
  --bg-alt: #151817;
  --card: #1a1d1c;
  --ink: #f1f3f1;
  --muted: #9aa09c;
  --faint: #343937;
  --tick: #2b302e;
  --line: rgb(241 243 241 / 0.1);
  --dark: #050606;
  --cp-dim: #5f6662;
  --cp-dim-strong: #9aa09c;
  --cp-kw: #5eead4;
  --cp-str: #fdba74;
  --cp-num: #c4b5fd;
  --cp-prop: #f1f3f1;
  --cp-sel: #93c5fd;
}

.d-wrap { max-width: 1400px; margin: 0 auto; padding: 0 32px; }
.d-sec { padding: 120px 0; }
.d-tag {
  display: inline-block;
  margin-bottom: 28px;
  padding: 3px 7px;
  border-radius: 3px;
  background: var(--ink);
  color: var(--bg);
  font-family: var(--cp-mono);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.d-note { margin: 0; color: inherit; opacity: 0.8; }

/* hero: full-bleed Client, copy bottom-left, jump cards bottom-right */
.d-hero {
  position: relative;
  min-height: calc(100dvh - var(--vp-nav-height, 64px));
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  color: #f4f5f4;
  background: #05080c;
}
.d-hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }
.d-hero-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgb(5 8 12 / 0.35) 0%, rgb(5 8 12 / 0.15) 35%, rgb(5 8 12 / 0.92) 100%),
    linear-gradient(90deg, rgb(5 8 12 / 0.7), transparent 60%);
}
.d-hero-inner {
  position: relative;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 32px 48px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 40px;
  align-items: end;
}
.d-title {
  margin: 0;
  font-size: clamp(2.5rem, 5.4vw, 5.2rem);
  font-weight: 600;
  line-height: 1.02;
  letter-spacing: -0.045em;
}
.d-hero-sub { margin: 22px 0 0; max-width: 46ch; font-size: 1.08rem; line-height: 1.6; color: rgb(244 245 244 / 0.78); }
.d-cta { margin-top: 28px; display: flex; flex-wrap: wrap; gap: 10px; }
.d-btn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 44px;
  padding: 0 18px;
  border-radius: 6px;
  font-size: 14.5px;
  font-weight: 500;
  transition: transform 0.15s, background-color 0.2s;
}
.d-btn:active { transform: scale(0.98); }
.d-btn-light { background: #f4f5f4; color: #0d0f0e; }
.d-btn-light:hover { background: #ffffff; }
.d-btn-ghost { border: 1px solid rgb(244 245 244 / 0.3); color: #f4f5f4; }
.d-btn-ghost:hover { background: rgb(244 245 244 / 0.08); }
.d-btn-lg { height: 50px; padding: 0 22px; font-size: 15px; }
.d-hero-cards { display: flex; gap: 10px; }
.d-hero-card {
  width: 170px;
  padding: 6px;
  border-radius: 8px;
  background: rgb(244 245 244 / 0.1);
  border: 1px solid rgb(244 245 244 / 0.18);
  backdrop-filter: blur(12px);
  color: #f4f5f4;
  transition: background-color 0.2s;
}
.d-hero-card:hover { background: rgb(244 245 244 / 0.18); }
.d-hero-card img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 4px; }
.d-hero-card span {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 3px 2px;
  font-family: var(--cp-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* intro statement */
.d-intro { padding-bottom: 60px; }
.d-statement {
  margin: 0;
  max-width: 30ch;
  font-size: clamp(1.9rem, 3.6vw, 3.4rem);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.035em;
}

/* facts */
.d-facts-sec { padding-top: 60px; }
.d-facts-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 32px; align-items: stretch; }
.d-facts-img { margin: 0; border-radius: 10px; overflow: hidden; }
.d-facts-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.d-facts { display: grid; grid-template-columns: 1fr 1fr; gap: 0 28px; align-content: start; }
.d-fact {
  display: grid;
  grid-template-columns: 28px 1fr;
  grid-template-rows: auto auto;
  column-gap: 12px;
  padding: 20px 0 26px;
  border-top: 1px solid var(--line);
}
.d-fact-icon { grid-row: 1 / 3; margin-top: 8px; color: var(--muted); }
.d-fact strong { font-size: 2.1rem; font-weight: 600; letter-spacing: -0.04em; line-height: 1.1; }
.d-fact span { margin-top: 4px; font-family: var(--cp-mono); font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.d-facts-body { grid-column: 2; margin: 28px 0 0; max-width: 34ch; font-size: 14.5px; line-height: 1.6; }

/* pinned stage */
.d-showcase { border-top: 1px solid var(--line); }

/* app features on the tinted band */
.d-alt { background: var(--bg-alt); }
.d-lead {
  margin: 0;
  max-width: 26ch;
  font-size: clamp(1.8rem, 3.2vw, 3rem);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.035em;
}
.d-lead span { color: var(--muted); }
.d-cards { margin-top: 72px; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px; }
.d-card {
  grid-column: span 2;
  min-height: 230px;
  padding: 20px;
  border-radius: 8px;
  background: var(--card);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.25s;
}
.d-card:nth-child(4), .d-card:nth-child(5) { grid-column: span 3; }
.d-card:hover { transform: translateY(-3px); }
.d-card h3 { margin: 0; font-size: 1.2rem; font-weight: 500; letter-spacing: -0.02em; }
.d-card p { margin: 6px 0 0; max-width: 36ch; color: var(--muted); font-size: 14px; line-height: 1.55; }

/* community */
.d-h2 { margin: 0; font-size: clamp(1.9rem, 3.2vw, 2.9rem); font-weight: 600; letter-spacing: -0.04em; line-height: 1.08; }
.d-body { margin: 14px 0 0; max-width: 52ch; color: var(--muted); font-size: 1.05rem; line-height: 1.6; }
.d-themes { margin-top: 48px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.d-theme { margin: 0; }
.d-theme img { display: block; width: 100%; height: auto; border-radius: 6px; }
.d-theme figcaption { display: flex; justify-content: space-between; margin-top: 10px; font-family: var(--cp-mono); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; }
.d-theme figcaption a { color: var(--ink); }
.d-theme figcaption a:hover { text-decoration: underline; text-underline-offset: 3px; }
.d-theme figcaption span { color: var(--muted); }
.d-rows { margin-top: 44px; border-top: 1px solid var(--line); }
.d-row {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 2fr) minmax(0, 0.8fr) 16px;
  gap: 24px;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
  color: inherit;
}
.d-row-name { font-weight: 500; }
.d-row-body { color: var(--muted); font-size: 14px; }
.d-row-by { font-family: var(--cp-mono); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }
.d-row:hover .d-row-name { text-decoration: underline; text-underline-offset: 3px; }
.d-link { display: inline-flex; align-items: center; gap: 7px; margin-top: 24px; color: var(--ink); font-weight: 500; font-size: 14.5px; }
.d-link:hover { text-decoration: underline; text-underline-offset: 4px; }

/* authors */
.d-dev { border-top: 1px solid var(--line); }
.d-dev-grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 64px; align-items: start; }
.d-devlinks { display: flex; flex-wrap: wrap; gap: 0 26px; }
.d-code { border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
.d-code-bar { padding: 10px 18px; border-bottom: 1px solid var(--line); font-family: var(--cp-mono); font-size: 11px; letter-spacing: 0.04em; color: var(--muted); background: var(--bg-alt); }
.d-code :deep(.cb) { padding: 20px 18px; font-size: 13.5px; }

/* download: dark closing band */
.d-dl { padding: 120px 0 0; background: var(--dark); color: #f4f5f4; }
.d-dl-inner { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 48px; align-items: end; padding-bottom: 96px; }
.d-dl-title { margin: 0; font-size: clamp(2.6rem, 6vw, 5.4rem); font-weight: 600; letter-spacing: -0.05em; line-height: 1; }
.d-dl-body { margin: 22px 0 0; max-width: 48ch; color: rgb(244 245 244 / 0.7); line-height: 1.6; }
.d-dl-actions { display: flex; flex-direction: column; align-items: flex-start; }
.d-mascot-slot { height: 0; }
.d-dl-links { display: flex; gap: 22px; margin-top: 16px; font-size: 14px; }
.d-dl-links a { color: rgb(244 245 244 / 0.8); }
.d-dl-links a:hover { color: #fff; }
.d-riot {
  max-width: 1400px;
  margin: 0 auto;
  padding: 22px 32px 96px;
  border-top: 1px solid rgb(244 245 244 / 0.1);
  font-size: 11px;
  line-height: 1.6;
  color: rgb(244 245 244 / 0.45);
}

@media (max-width: 1023px) {
  .d-hero-inner { grid-template-columns: 1fr; }
  .d-facts-grid, .d-dev-grid, .d-dl-inner { grid-template-columns: 1fr; }
  .d-facts-body { grid-column: 1 / -1; }
  .d-themes { grid-template-columns: 1fr 1fr; }
  .d-cards { grid-template-columns: 1fr 1fr; }
  .d-card, .d-card:nth-child(4), .d-card:nth-child(5) { grid-column: auto; }
  .d-card:nth-child(5) { grid-column: 1 / -1; }
}
@media (max-width: 767px) {
  .d-wrap { padding: 0 16px; }
  .d-sec { padding: 80px 0; }
  .d-hero-inner { padding: 0 16px 32px; }
  .d-hero-cards { display: none; }
  .d-facts { grid-template-columns: 1fr 1fr; }
  .d-cards { grid-template-columns: 1fr; }
  .d-card { min-height: 170px; }
  .d-row { grid-template-columns: minmax(0, 1fr) 16px; gap: 6px 12px; }
  .d-row-body, .d-row-by { grid-column: 1; }
  .d-row svg { grid-row: 1; grid-column: 2; }
  .d-riot { padding: 22px 16px 96px; }
}
</style>
