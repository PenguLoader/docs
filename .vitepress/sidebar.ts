import { type DefaultTheme } from 'vitepress'

export function sidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'Welcome', link: '/guide/welcome' },
        { text: 'Installation', link: '/guide/installation' },
        { text: 'FAQs', link: '/guide/faqs' },
        { text: 'What\'s new in v1.2', link: '/guide/pengu-v1.2' },
      ]
    },
    {
      text: 'Plugins',
      // collapsed: false,
      items: [
        { text: 'JavaScript Plugin', link: '/guide/javascript-plugin' },
        { text: 'Module System', link: '/guide/module-system' },
        { text: 'CSS Theme', link: '/guide/css-theme' },
        { text: 'Asset Handling', link: '/guide/asset-handling' },
        { text: 'LCU Request', link: '/guide/lcu-request' },
        { text: 'NPM & TypeScript', link: '/guide/npm-typescript' },
      ]
    },
    {
      text: 'Runtime API',
      // collapsed: false,
      items: [
        { text: 'General', link: '/runtime-api/' },
        { text: 'window.Pengu', link: '/runtime-api/pengu' },
        { text: 'window.DataStore', link: '/runtime-api/data-store' },
        { text: 'window.Effect (Visual)', link: '/runtime-api/effect' },
        { text: 'window.CommandBar (UI)', link: '/runtime-api/command-bar' },
        { text: 'window.Toast (UI)', link: '/runtime-api/toast' },
        { text: 'context.rcp', link: '/runtime-api/rcp' },
        { text: 'context.socket', link: '/runtime-api/socket' },
        { text: 'context.fs (PluginFS)', link: '/runtime-api/fs' },
        {
          text: 'Modules',
          // collapsed: false,
          items: [
            { text: 'JSON', link: '/runtime-api/modules/json' },
            { text: 'Directory', link: '/runtime-api/modules/directory' },
          ]
        },
      ]
    },
    {
      text: 'Migrations',
      // collapsed: false,
      items: [
        { text: 'Migration from v0.6', link: '/guide/migration-from-v0-6' },
      ]
    }
  ]
}