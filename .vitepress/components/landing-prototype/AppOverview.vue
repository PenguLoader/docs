<script setup lang="ts">
import { app } from './copy'
</script>

<template>
  <section class="app-overview">
    <div>
      <h2>{{ app.title }}</h2>
      <p>{{ app.body }}</p>
      <a href="/guide/welcome">Set up Pengu Loader <span aria-hidden="true">↗</span></a>
    </div>
    <dl>
      <div><dt>Your plugins</dt><dd>Enable or disable each plugin in the app.</dd></div>
      <div><dt>Community store</dt><dd>Browse plugins and themes made by other players.</dd></div>
      <div><dt>Five accents</dt><dd>Choose blue, green, purple, pink or yellow for the Pengu app.</dd></div>
    </dl>
  </section>
</template>

<style scoped>
.app-overview { max-width: 1240px; margin: 0 auto; padding: 88px 24px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
h2 { margin: 0; font-family: var(--display, inherit); font-size: clamp(2rem, 3.4vw, 3rem); line-height: 1.15; letter-spacing: -.03em; }
p { max-width: 42ch; margin: 20px 0; color: var(--muted); font-size: 17px; line-height: 1.7; }
a { color: var(--gold, var(--accent)); font-weight: 600; }
dl { margin: 0; }
dl div { padding: 18px 0; border-top: 1px solid var(--line); }
dt { font-weight: 600; font-size: 17px; }
dd { margin: 6px 0 0; color: var(--muted); line-height: 1.6; }
@media (max-width: 767px) { .app-overview { grid-template-columns: 1fr; gap: 28px; padding: 64px 16px 0; } }
</style>
