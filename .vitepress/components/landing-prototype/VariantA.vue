<!-- PROTOTYPE (throwaway) Variant A, "Summoner's Rift at night": cinematic, Riot-adjacent.
     Deep night sky, gold as the single accent, Playfair Display for display type (justified by
     League's own flared-serif identity), long pinned and filmstrip sections. -->
<script setup lang="ts">
import { ref } from 'vue'
import { PhArrowRight, PhBug, PhDiscordLogo, PhDownloadSimple, PhDrop, PhFolderSimple, PhPlugsConnected } from '@phosphor-icons/vue'
import ClientWindow from './ClientWindow.vue'
import CodePanel from './CodePanel.vue'
import CodeBlock from './CodeBlock.vue'
import { useClientDemo } from './useClientDemo'
import { useDownload } from './useDownload'
import { useMotion } from './useMotion'
import { app, authors, community, download, hero, riot } from './copy'

const demo = useClientDemo()
const dl = useDownload()
const root = ref<HTMLElement>()
const activeShot = ref(0)
const icons = [PhPlugsConnected, PhBug, PhDrop, PhFolderSimple]

useMotion(root, (gsap, ScrollTrigger) => {
  gsap.from('.a-line', { yPercent: 115, duration: 1.2, ease: 'power4.out', stagger: 0.1 })
  gsap.from('.a-hero-sub, .a-hero-cta', { opacity: 0, y: 18, duration: 0.9, delay: 0.4, stagger: 0.08, ease: 'power3.out' })
  gsap.from('.a-window', { opacity: 0, y: 50, scale: 0.94, rotationX: 10, transformPerspective: 1400, duration: 1.6, delay: 0.1, ease: 'power3.out' })
  gsap.from('.a-editor', { opacity: 0, y: 24, duration: 1, delay: 0.7, ease: 'power3.out' })
  // the sky drifts slower than the page: depth behind the Client
  gsap.to('.a-sky', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.a-hero', start: 'top top', end: 'bottom top', scrub: true } })
  for (const t of gsap.utils.toArray('[data-reveal]') as HTMLElement[]) {
    gsap.from(t, { opacity: 0, y: 40, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: t, start: 'top 85%' } })
  }
  ;(gsap.utils.toArray('.a-shot') as HTMLElement[]).forEach((s, i) => {
    ScrollTrigger.create({ trigger: s, start: 'top 60%', end: 'bottom 60%', onToggle: (self: any) => { if (self.isActive) activeShot.value = i } })
  })
})
</script>

<template>
  <div ref="root" class="va">
    <section class="a-hero">
      <div class="a-sky" aria-hidden="true" />
      <div class="a-hero-grid">
        <h1 class="a-title">
          <span v-for="(l, i) in hero.title" :key="l" class="a-mask">
            <span class="a-line" :class="{ 'is-accent': i === 1 }">{{ l }}</span>
          </span>
        </h1>
        <div class="a-copy">
          <p class="a-hero-sub">{{ hero.sub }}</p>
          <div class="a-hero-cta">
            <p v-if="dl.mobile.value" class="a-note">Available for Windows and macOS.</p>
            <a v-else :href="dl.href.value" class="a-btn"><PhDownloadSimple :size="18" weight="bold" />{{ dl.label.value }}</a>
            <a :href="hero.secondary.href" class="a-link">{{ hero.secondary.text }}<PhArrowRight :size="16" /></a>
          </div>
          <div class="a-editor"><CodePanel :demo="demo" /></div>
        </div>
        <div class="a-stage">
          <div class="a-window"><ClientWindow :demo="demo" bounds=".a-hero" /></div>
          <p class="a-hint">{{ hero.demoHint }}</p>
        </div>
      </div>
    </section>

    <section class="a-app">
      <div class="a-wrap a-app-grid">
        <div class="a-app-copy">
          <h2 class="a-h2">{{ app.title }}</h2>
          <p class="a-body">{{ app.body }}</p>
          <ul class="a-app-list">
            <li v-for="(s, i) in app.shots" :key="s.label" :class="{ 'is-on': i === activeShot }">{{ s.label }}</li>
          </ul>
        </div>
        <div class="a-app-shots">
          <figure v-for="s in app.shots" :key="s.src" class="a-shot">
            <img :src="s.src" :alt="s.alt" loading="lazy" width="2000" height="1280">
          </figure>
        </div>
      </div>
    </section>

    <section class="a-comm">
      <div class="a-wrap" data-reveal>
        <h2 class="a-h2">{{ community.title }}</h2>
        <p class="a-body">{{ community.body }}</p>
      </div>
      <div class="a-strip">
        <figure v-for="t in community.themes" :key="t.name" class="a-theme">
          <img :src="t.src" :alt="`The lobby with the ${t.name} theme`" loading="lazy" width="1600" height="900">
          <figcaption><a :href="t.href" target="_blank" rel="noopener">{{ t.name }}</a> by {{ t.author }}</figcaption>
        </figure>
      </div>
      <div class="a-wrap a-plugins" data-reveal>
        <a v-for="p in community.plugins" :key="p.name" :href="p.href" target="_blank" rel="noopener" class="a-plugin">
          <h3>{{ p.name }} <span>by {{ p.author }}</span></h3>
          <p>{{ p.body }}</p>
        </a>
        <a :href="community.share.href" class="a-link" target="_blank" rel="noopener"><PhDiscordLogo :size="18" />{{ community.share.text }}</a>
      </div>
    </section>

    <section class="a-dev">
      <div class="a-wrap a-dev-grid">
        <div data-reveal>
          <h2 class="a-h2">{{ authors.title }}</h2>
          <p class="a-body">{{ authors.body }}</p>
          <div class="a-code">
            <div class="a-code-bar">plugins/hello/index.js</div>
            <CodeBlock :code="authors.code" />
          </div>
        </div>
        <div class="a-points" data-reveal>
          <div v-for="(p, i) in authors.points" :key="p.title" class="a-point">
            <component :is="icons[i]" :size="24" weight="duotone" class="a-point-icon" />
            <h3>{{ p.title }}</h3>
            <p>{{ p.body }}</p>
          </div>
          <div class="a-dev-links">
            <a v-for="l in authors.links" :key="l.href" :href="l.href" class="a-link">{{ l.text }}<PhArrowRight :size="16" /></a>
          </div>
        </div>
      </div>
    </section>

    <section class="a-dl">
      <div class="a-dl-inner" data-reveal>
        <!-- mascot slot: reserved for the animated Pengu, see BRIEF.md -->
        <div class="a-mascot-slot" aria-hidden="true" />
        <h2 class="a-h2 a-dl-title">{{ download.title }}</h2>
        <p class="a-body">{{ download.body }}</p>
        <p v-if="dl.mobile.value" class="a-note">Available for Windows and macOS.</p>
        <a v-else :href="dl.href.value" class="a-btn a-btn-lg"><PhDownloadSimple :size="20" weight="bold" />{{ dl.label.value }}</a>
        <div class="a-dl-links">
          <a :href="download.other.href" class="a-link">{{ download.other.text }}</a>
          <a :href="download.discord.href" class="a-link" target="_blank" rel="noopener">{{ download.discord.text }}</a>
        </div>
        <p class="a-trust">{{ download.trust }}</p>
      </div>
    </section>

    <footer class="a-foot"><p>{{ riot }}</p></footer>
  </div>
</template>

<style scoped>
.va {
  --bg: #060a12;
  --bg-2: #0a1120;
  --ink: #ede6d6;
  --muted: #98a1b1;
  --gold: #c8aa6e;
  --gold-ink: #0b0f18;
  --line: rgb(200 170 110 / 0.18);
  --glass: rgb(10 17 32 / 0.72);
  --display: 'Playfair Display', Georgia, serif;
  --sans: 'Geist', system-ui, sans-serif;
  --cp-fg: var(--ink);
  --cp-dim: #5d6679;
  --cp-dim-strong: #98a1b1;
  --cp-accent: var(--gold);
  --cp-on-accent: var(--gold-ink);
  --cp-border: var(--line);
  --cp-select: rgb(200 170 110 / 0.22);
  --cp-mono: 'Geist Mono', ui-monospace, monospace;
  --cp-kw: #d9b877;
  --cp-str: #9fbfd4;
  --cp-num: #d6a3a3;
  --cp-prop: #cdd6e4;
  --cp-sel: #e8cf99;
  --cw-frame-bg: rgb(200 170 110 / 0.07);
  --cw-frame-border: rgb(200 170 110 / 0.28);
  --cw-radius: 10px;
  --cw-screen-radius: 3px;
  --cw-shadow: 0 60px 140px -40px rgb(0 0 0 / 0.85), 0 0 0 1px rgb(0 0 0 / 0.4);
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
  overflow: hidden;
}
html:not(.dark) .va {
  --bg: #eef1f6;
  --bg-2: #e2e7f0;
  --ink: #0d1420;
  --muted: #4c5566;
  --gold: #8a6a2c;
  --gold-ink: #fbf7ee;
  --line: rgb(138 106 44 / 0.22);
  --glass: rgb(255 255 255 / 0.7);
  --cp-dim: #8a93a3;
  --cp-dim-strong: #566072;
  --cp-select: rgb(138 106 44 / 0.18);
  --cp-kw: #8a6a2c;
  --cp-str: #2f6b8a;
  --cp-num: #a2474f;
  --cp-prop: #1f2a3c;
  --cp-sel: #6b4f1a;
  --cw-frame-bg: rgb(255 255 255 / 0.55);
  --cw-frame-border: rgb(138 106 44 / 0.3);
  --cw-shadow: 0 50px 120px -40px rgb(13 20 32 / 0.45), 0 0 0 1px rgb(13 20 32 / 0.06);
}

.a-wrap { max-width: 1240px; margin: 0 auto; padding: 0 24px; }

/* hero */
.a-hero {
  position: relative;
  min-height: calc(100dvh - var(--vp-nav-height, 64px));
  padding: 56px 24px 72px;
  isolation: isolate;
}
.a-sky {
  position: absolute;
  inset: -10% 0 0;
  z-index: -1;
  background:
    radial-gradient(60% 55% at 78% 18%, rgb(56 88 160 / 0.35), transparent 70%),
    radial-gradient(40% 40% at 12% 90%, rgb(200 170 110 / 0.14), transparent 70%),
    linear-gradient(180deg, #081022 0%, var(--bg) 70%);
}
.a-sky::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 20% 30%, rgb(255 255 255 / 0.55), transparent),
    radial-gradient(1px 1px at 70% 12%, rgb(255 255 255 / 0.4), transparent),
    radial-gradient(1.5px 1.5px at 40% 70%, rgb(255 255 255 / 0.35), transparent),
    radial-gradient(1px 1px at 88% 60%, rgb(255 255 255 / 0.5), transparent),
    radial-gradient(1px 1px at 55% 45%, rgb(255 255 255 / 0.3), transparent);
  background-size: 340px 280px;
  opacity: 0.7;
}
html:not(.dark) .a-sky {
  background:
    radial-gradient(60% 55% at 78% 12%, rgb(255 214 160 / 0.55), transparent 70%),
    radial-gradient(45% 45% at 10% 95%, rgb(120 150 210 / 0.25), transparent 70%),
    linear-gradient(180deg, #dfe6f1 0%, var(--bg) 75%);
}
html:not(.dark) .a-sky::after { opacity: 0; }

.a-hero-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
  gap: 36px 56px;
  align-items: start;
}
.a-title {
  grid-column: 1 / -1;
  margin: 0;
  font-family: var(--display);
  font-weight: 600;
  font-size: clamp(2.4rem, 5vw, 4.6rem);
  line-height: 1.08;
  letter-spacing: -0.02em;
}
.a-mask { display: block; overflow: hidden; padding-bottom: 0.08em; }
.a-line { display: block; }
.a-line.is-accent { font-style: italic; color: var(--gold); }
.a-hero-sub {
  margin: 4px 0 0;
  max-width: 34ch;
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--muted);
}
.a-hero-cta { margin-top: 30px; display: flex; flex-wrap: wrap; align-items: center; gap: 22px; }
.a-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 13px 22px;
  border-radius: 2px;
  background: var(--gold);
  color: var(--gold-ink);
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.02em;
  box-shadow: 0 0 0 1px rgb(255 255 255 / 0.12) inset, 0 12px 30px -12px rgb(200 170 110 / 0.6);
  transition: transform 0.2s, box-shadow 0.2s;
}
.a-btn:hover { transform: translateY(-1px); box-shadow: 0 0 0 1px rgb(255 255 255 / 0.2) inset, 0 16px 40px -12px rgb(200 170 110 / 0.8); }
.a-btn:active { transform: translateY(1px); }
.a-btn-lg { padding: 16px 28px; font-size: 16px; }
.a-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--ink);
  font-weight: 500;
  border-bottom: 1px solid var(--line);
  padding-bottom: 2px;
  transition: border-color 0.2s, color 0.2s;
}
.a-link:hover { color: var(--gold); border-color: var(--gold); }
.a-note { margin: 0; color: var(--muted); }
.a-editor {
  margin-top: 44px;
  padding: 18px 18px 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--glass);
  backdrop-filter: blur(16px);
  height: 380px;
  display: flex;
}
.a-editor > * { flex: 1; }
.a-stage { position: relative; padding-top: 8px; }
.a-hint { margin: 18px 4px 0; font-size: 13px; color: var(--muted); }

/* app: pinned copy, scrolling screenshots */
.a-app { padding: 140px 0 60px; }
.a-app-grid { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); gap: 72px; }
.a-app-copy { position: sticky; top: calc(var(--vp-nav-height, 64px) + 80px); align-self: start; }
.a-h2 {
  margin: 0;
  font-family: var(--display);
  font-weight: 600;
  font-size: clamp(2rem, 3.4vw, 3.2rem);
  line-height: 1.1;
  letter-spacing: -0.015em;
}
.a-body { margin: 18px 0 0; max-width: 46ch; font-size: 1.05rem; line-height: 1.65; color: var(--muted); }
.a-app-list { margin: 36px 0 0; padding: 0; list-style: none; border-left: 1px solid var(--line); }
.a-app-list li {
  padding: 10px 0 10px 18px;
  margin-left: -1px;
  border-left: 2px solid transparent;
  color: var(--muted);
  transition: color 0.3s, border-color 0.3s;
}
.a-app-list li.is-on { color: var(--ink); border-left-color: var(--gold); }
.a-app-shots { display: grid; gap: 80px; }
.a-shot { margin: 0; border-radius: 10px; overflow: hidden; border: 1px solid var(--line); box-shadow: 0 40px 100px -40px rgb(0 0 0 / 0.7); }
.a-shot img { display: block; width: 100%; height: auto; }

/* community: filmstrip */
.a-comm { padding: 140px 0 40px; }
.a-strip {
  margin-top: 56px;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min(78vw, 980px);
  gap: 28px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 0 max(24px, calc((100vw - 1240px) / 2 + 24px)) 18px;
  scrollbar-width: thin;
  scrollbar-color: var(--line) transparent;
}
.a-theme { margin: 0; scroll-snap-align: center; }
.a-theme img { display: block; width: 100%; height: auto; border-radius: 8px; border: 1px solid var(--line); }
.a-theme figcaption { margin-top: 14px; font-size: 14px; color: var(--muted); }
.a-theme figcaption a { color: var(--ink); font-weight: 600; }
.a-theme figcaption a:hover { color: var(--gold); }
.a-plugins { margin-top: 64px; display: grid; grid-template-columns: 1fr 1fr; gap: 0 48px; }
.a-plugin { display: block; padding: 22px 0; border-top: 1px solid var(--line); color: inherit; }
.a-plugin h3 { margin: 0; font-size: 1.05rem; font-weight: 600; }
.a-plugin h3 span { font-weight: 400; color: var(--muted); }
.a-plugin p { margin: 8px 0 0; color: var(--muted); line-height: 1.6; }
.a-plugin:hover h3 { color: var(--gold); }
.a-plugins > .a-link { grid-column: 1 / -1; justify-self: start; margin-top: 18px; }

/* authors */
.a-dev { padding: 140px 0; }
.a-dev-grid { display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: 72px; align-items: start; }
.a-code { margin-top: 36px; border: 1px solid var(--line); border-radius: 10px; background: var(--bg-2); overflow: hidden; }
.a-code-bar { padding: 10px 18px; border-bottom: 1px solid var(--line); font-family: var(--cp-mono); font-size: 12px; color: var(--muted); }
.a-code :deep(.cb) { padding: 18px; }
.a-points { display: grid; grid-template-columns: 1fr 1fr; gap: 40px 32px; padding-top: 8px; }
.a-point h3 { margin: 14px 0 0; font-size: 1rem; font-weight: 600; }
.a-point p { margin: 8px 0 0; color: var(--muted); line-height: 1.6; font-size: 0.95rem; }
.a-point-icon { color: var(--gold); }
.a-dev-links { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 24px; margin-top: 8px; }

/* download */
.a-dl {
  position: relative;
  padding: 120px 24px 140px;
  text-align: center;
  background: radial-gradient(50% 60% at 50% 100%, rgb(200 170 110 / 0.14), transparent 70%);
}
.a-dl-inner { max-width: 620px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
.a-mascot-slot { height: 96px; }
.a-dl-title { font-size: clamp(2.4rem, 4.2vw, 3.8rem); }
.a-dl .a-body { margin-bottom: 36px; }
.a-dl-links { display: flex; gap: 28px; margin-top: 28px; }
.a-trust { margin: 40px 0 0; font-size: 14px; color: var(--muted); }
.a-foot { padding: 28px 24px 96px; border-top: 1px solid var(--line); }
.a-foot p { max-width: 900px; margin: 0 auto; font-size: 11px; line-height: 1.6; color: var(--muted); opacity: 0.7; text-align: center; }

@media (max-width: 1023px) {
  .a-hero-grid, .a-app-grid, .a-dev-grid { grid-template-columns: 1fr; gap: 40px; }
  /* title, copy, Client, then the editor */
  .a-copy { display: contents; }
  .a-hero-sub { order: 1; }
  .a-hero-cta { order: 2; margin-top: 0; }
  .a-stage { order: 3; }
  .a-editor { order: 4; margin-top: 0; }
  .a-app-copy { position: static; }
}
@media (max-width: 767px) {
  .a-hero { padding: 32px 16px 48px; }
  .a-hint { display: none; } /* no dragging on phones */
  .a-wrap { padding: 0 16px; }
  .a-editor { height: 340px; margin-top: 32px; }
  .a-app, .a-comm, .a-dev { padding-top: 88px; }
  .a-plugins, .a-points { grid-template-columns: 1fr; }
  .a-strip { grid-auto-columns: 86vw; padding: 0 16px 16px; }
  .a-app-shots { gap: 32px; }
}
</style>
