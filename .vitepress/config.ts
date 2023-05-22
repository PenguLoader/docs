import { defineConfig } from 'vitepress';
import { resolve } from 'node:path';
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';
import pkg from '../package.json';

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

    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:url', content: 'https://pengu.lol/' }],
    ['meta', { name: 'og:title', content: 'Pengu Loader' }],
    ['meta', { name: 'og:description', content: 'Unleash the power of Customization from your League of Legends Client.' }],
    ['meta', { name: 'og:image', content: 'https://pengu.lol/banner.jpg' }],

    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:url', content: 'https://pengu.lol/' }],
    ['meta', { name: 'twitter:title', content: 'Pengu Loader' }],
    ['meta', { name: 'twitter:description', content: 'Unleash the power of Customization from your League of Legends Client.' }],
    ['meta', { name: 'twitter:image', content: 'https://pengu.lol/banner.jpg' }],
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

    algolia: {
      apiKey: '470d1a268c45ebcec23f9cefd23a6387',
      appId: 'QXR7IBTC3K',
      indexName: 'pengu'
    },

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
      '/runtime-api/': sidebarGuide(),
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
    // 'vi': {
    //   label: 'Tiếng Việt',
    //   lang: 'vi',
    //   link: '/vi/',
    //   themeConfig: {
    //     sidebar: {
    //       '/vi/guide/': sidebarGuideVi(),
    //       '/vi/runtime-api/': sidebarGuideVi(),
    //     }
    //   }
    // },
    // 'pt-br': {
    //   label: 'Português (BR)',
    //   lang: 'pt-br',
    //   link: '/pt-br/',
    //   themeConfig: {
    //     sidebar: {
    //       '/pt-br/guide/': sidebarGuideBR(),
    //       '/pt-br/runtime-api/': sidebarGuideBR(),
    //     }
    //   }
    // },
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
      text: `v${pkg.version}-stable`,
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

function sidebarGuideVi() {
  return [
    {
      text: 'Bắt đầu',
      collapsed: false,
      items: [
        { text: 'Chào mừng', link: '/vi/guide/welcome' },
        { text: 'Cài đặt', link: '/vi/guide/installation' },
        { text: 'FAQs', link: '/vi/guide/faqs' },
      ]
    },
    {
      text: 'Plugins',
      collapsed: false,
      items: [
        { text: 'Plugin JavaScript', link: '/vi/guide/javascript-plugin' },
        { text: 'Hệ Thống Mô-đun', link: '/vi/guide/module-system' },
        { text: 'Theme CSS', link: '/vi/guide/css-theme' },
        { text: 'Xử lí Asset', link: '/vi/guide/asset-handling' },
        { text: 'LCU Request', link: '/vi/guide/lcu-request' },
        { text: 'Tương Thích Với NPM', link: '/vi/guide/npm-compatibility' },
      ]
    },
    {
      text: 'Runtime API',
      collapsed: false,
      items: [
        { text: 'Tổng Quan', link: '/vi/runtime-api/' },
        { text: '[AuthCallback]', link: '/vi/runtime-api/auth-callback' },
        { text: '[DataStore]', link: '/vi/runtime-api/data-store' },
        { text: '[Effect]', link: '/vi/runtime-api/effect' },
      ]
    },
    {
      text: 'Migrations',
      collapsed: false,
      items: [
        { text: 'Migrate từ phiên bản v0.6', link: '/vi/guide/migration-from-v0-6' },
      ]
    }
  ]
}

function sidebarGuideBR() {
  return [
    {
      text: "Começando",
      collapsed: false,
      items: [
        { text: "Bem Vindo", link: "/pt-br/guide/welcome" },
        { text: "Instalação", link: "/pt-br/guide/installation" },
        { text: "FAQs", link: "/pt-br/guide/faqs" },
      ],
    },
    {
      text: "Plugins",
      collapsed: false,
      items: [
        { text: "JavaScript Plugin", link: "/pt-br/guide/javascript-plugin" },
        { text: "Module System", link: "/pt-br/guide/module-system" },
        { text: "CSS Theme", link: "/pt-br/guide/css-theme" },
        { text: "Asset Handling", link: "/pt-br/guide/asset-handling" },
        { text: "LCU Request", link: "/pt-br/guide/lcu-request" },
        { text: "Npm Compatibility", link: "/pt-br/guide/npm-compatibility" },
      ],
    },
    {
      text: "Runtime API",
      collapsed: false,
      items: [
        { text: "Overview", link: "/pt-br/runtime-api/" },
        { text: "[AuthCallback]", link: "/pt-br/runtime-api/auth-callback" },
        { text: "[DataStore]", link: "/pt-br/runtime-api/data-store" },
        { text: "[Effect]", link: "/pt-br/runtime-api/effect" },
      ],
    },
    {
      text: "Migrations",
      collapsed: false,
      items: [
        { text: "Migration from v0.6", link: "/pt-br/guide/migration-from-v0-6" },
      ],
    },
  ]
}