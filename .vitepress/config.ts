import { defineConfig } from 'vitepress';
import { resolve } from 'node:path';
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';

export default defineConfig({
  srcDir: './docs',
  vite: {
    publicDir: resolve(__dirname, '../public'),
  },

  lang: 'en',
  title: 'Pengu Loader',
  description: 'Unleash the power of Customization from your League of Legends Client.',
  appearance: 'dark',

  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['meta', { name: 'theme-color', content: '#1e1e20' }],
    ['link', { rel: 'icon', href: '/PenguLoader.png', type: 'image/png' }],
  ],

  markdown: {
    headers: {
      level: [0, 0]
    },
    config: (md) => {
      md.use(tabsMarkdownPlugin);
    }
  },

  themeConfig: {
    logo: '/PenguLoader.png',
    nav: nav(),

    // algolia: {
    //   apiKey: '',
    //   appId: '',
    //   indexName: ''
    // },

    editLink: {
      pattern: 'https://github.com/PenguLoader/docs/blob/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    socialLinks: [
      { icon: 'discord', link: 'https://chat.pengu.lol' },
      { icon: 'github', link: 'https://github.com/PenguLoader/PenguLoader' }
    ],

    sidebar: {
      '/guide/': sidebarGuide(),
      '/runtime-api/': sidebarGuide()
    },

    footer: {
      message: 'Released under the WTF License.',
      copyright: `Copyright © 2023-present Pengu Loader`
    },
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    'vi': {
      label: 'Tiếng Việt',
      lang: 'vi',
      link: '/vi/',
    }
  }
});

function nav() {
  return [
    {
      text: 'Guide',
      link: '/guide/welcome',
      activeMatch: '/guide/'
    },
    {
      text: 'Runtime API',
      link: '/runtime-api/',
      activeMatch: '/runtime-api/'
    },
    {
      text: 'v1.0.1-stable',
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/PenguLoader/PenguLoader/blob/main/CHANGELOG.md'
        },
        {
          text: 'Contributing',
          link: 'https://github.com/PenguLoader/PenguLoader/blob/main/.github/contributing.md'
        }
      ]
    }
  ]
}

function sidebarGuide() {
  return [
    {
      text: 'Getting Started',
      collapsed: false,
      items: [
        { text: 'Welcome', link: '/guide/welcome' },
        { text: 'Installation', link: '/guide/installation' },
        { text: 'FAQs', link: '/guide/faqs' },
      ]
    },
    {
      text: 'Plugins',
      collapsed: false,
      items: [
        { text: 'JavaScript Plugin', link: '/guide/javascript-plugin' },
        { text: 'Module System', link: '/guide/module-system' },
        { text: 'CSS Theme', link: '/guide/css-theme' },
        { text: 'Asset Handling', link: '/guide/asset-handling' },
        { text: 'LCU Request', link: '/guide/lcu-request' },
        { text: 'Npm Compatibility', link: '/guide/npm-compatibility' },
      ]
    },
    {
      text: 'Runtime API',
      collapsed: false,
      items: [
        { text: 'Overview', link: '/runtime-api/' },
        { text: '[AuthCallback]', link: '/runtime-api/auth-callback' },
        { text: '[DataStore]', link: '/runtime-api/data-store' },
        { text: '[Effect]', link: '/runtime-api/effect' },
      ]
    },
    {
      text: 'Migrations',
      collapsed: false,
      items: [
        { text: 'Migration from v0.6', link: '/guide/migration-from-v0-6' },
      ]
    }
  ]
}