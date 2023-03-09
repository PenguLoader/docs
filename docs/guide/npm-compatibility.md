# Npm Compatibility

## Using NodeJS project

We strongly recommend that you to use NodeJS project to build your plugins.

With TypeScript or other languages that require transpilation, you need a build
tool to build them, Webpack, Rollup or Vite is the best choice.

You can also use any front-end library to build custom UI, e.g. React, Preact,
Vue, Svelte, SolidJS, etc. With front-end tooling, its hot-reload/HMR will help
you to do faster.

::: info

Note that npm packages those are designed to run only in NodeJS cannot be used
to build plugins.

:::

::: tip

With the build tool, the output of your bundled assets may have incorrect paths.
Please refer to the [Asset Handling](/guide/asset-handling) to make correct
them.

:::

## Example plugins

### Webpack 📦

- [douugdev/league-a-better-client](https://github.com/douugdev/league-a-better-client) -
  A LCU utilities with HMR + ⚛ Preact + SASS + TypeScript

### Vite ⚡

- [Pengu vite-theme](https://github.com/PenguLoader/PenguLoader/blob/main/plugins/vite-theme) -
  A simple theme with HMR + SASS + TypeScript
- [Pengu @default](https://github.com/PenguLoader/PenguLoader/blob/main/plugins/@default) -
  The first plugin with HMR + SolidJS + SASS + TypeScript
