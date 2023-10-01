// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import Theme from 'vitepress/theme';
import type { EnhanceAppContext } from 'vitepress';

import { vitepressGoogleAnalytics } from './analytics';
import vitepressNprogress from 'vitepress-plugin-nprogress';

import './style.css';
import 'vitepress-plugin-nprogress/lib/css/index.css';

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp(ctx: EnhanceAppContext) {
    vitepressNprogress(ctx);
    vitepressGoogleAnalytics('G-KX1BWHTJ9S');
  }
}