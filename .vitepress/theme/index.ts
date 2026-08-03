// https://vitepress.dev/guide/custom-theme

// must stay first: Tailwind's Preflight has to be emitted before the default
// theme's stylesheet, otherwise it overrides VitePress base styles site-wide
import './tailwind.css'

import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext, Theme } from 'vitepress'

import { vitepressGoogleAnalytics } from './analytics'
import vitepressNprogress from 'vitepress-plugin-nprogress'

import './custom.css'
import 'vitepress-plugin-nprogress/lib/css/index.css'

import Layout from './Layout.vue'

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp(ctx: EnhanceAppContext) {
    vitepressNprogress(ctx)
    vitepressGoogleAnalytics('G-KX1BWHTJ9S')
  }
} as Theme