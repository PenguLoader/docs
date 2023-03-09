import DefaultTheme from 'vitepress/theme';
import { vitepressGoogleAnalytics } from './analytics';
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client';
import vitepressNprogress from 'vitepress-plugin-nprogress';
import 'vitepress-plugin-nprogress/lib/css/index.css';
import './custom.css';

const theme: typeof DefaultTheme = {
  ...DefaultTheme,
  enhanceApp: (ctx) => {
    vitepressNprogress(ctx);
    vitepressGoogleAnalytics('G-KX1BWHTJ9S');
    enhanceAppWithTabs(ctx.app);
  }
};

export default theme;