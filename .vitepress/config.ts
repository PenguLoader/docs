import { defineConfig, type DefaultTheme } from 'vitepress'
import { join, resolve } from 'node:path'
import pkg from '../package.json'
import { execSync } from 'node:child_process'

import { sidebar } from './sidebar'

const gitBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trimEnd()
const isDev = gitBranch !== 'main'
const domain = isDev ? 'pengu.dev' : 'pengu.lol'

const meta = {
  title: 'Pengu Loader',
  description: 'The ultimate JavaScript plugin loader, build your unmatched LoL Client.',
  url: `https://${domain}/`,
  image: `https://${domain}/banner.jpg`,
}

// https://vitepress.dev/reference/site-config
export default defineConfig({

  title: meta.title,
  description: meta.description,

  lang: 'en',
  appearance: isDev ? undefined : 'dark',
  lastUpdated: true,
  cleanUrls: true,

  srcDir: resolve(__dirname, '../docs'),
  vite: {
    publicDir: resolve(__dirname, '../public'),
    resolve: {
      alias: [
        {
          find: '@components',
          replacement: resolve(__dirname, 'components'),
        },
        {
          find: /^.*VPSwitchAppearance\.vue$/,
          replacement: resolve(__dirname, 'components/CustomSwitchAppearance.vue'),
        },
      ]
    }
  },

  head: [
    ['meta', { name: 'theme-color', content: '#1e1e20' }],
    ['link', { rel: 'icon', href: '/icon.png', type: 'image/png' }],

    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:url', content: meta.url }],
    ['meta', { name: 'og:title', content: meta.title }],
    ['meta', { name: 'og:description', content: meta.description }],
    ['meta', { name: 'og:image', content: meta.image }],

    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:url', content: meta.url }],
    ['meta', { name: 'twitter:title', content: meta.title }],
    ['meta', { name: 'twitter:description', content: meta.description }],
    ['meta', { name: 'twitter:image', content: meta.image }],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: `/icon.png`,
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
      '/guide/': sidebar(),
      '/runtime-api/': sidebar(),
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2023-present Pengu Loader`
    },
  },
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Download',
      link: '/download',
      activeMatch: '/download'
    },
    {
      text: 'Docs',
      link: '/guide/welcome',
      activeMatch: '/guide/'
    },
    {
      text: 'API',
      link: '/runtime-api/',
      activeMatch: '/runtime-api/'
    },
    // {
    //   text: `v${pkg.version}` + (isDev ? '-dev' : ''),
    //   link: isDev ? 'https://github.com/PenguLoader/PenguLoader/tree/dev'
    //     : `https://github.com/PenguLoader/PenguLoader/releases/tag/v${pkg.version}`
    // }
  ]
}