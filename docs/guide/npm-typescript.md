# NPM & TypeScript

## Using Node.js

We strongly recommend that you to use Node.js project to build your plugins.

With TypeScript or other languages that require transpilation, you need a build
tool to build them, Webpack, Rollup or Vite is the best choice.

You can also use any front-end library to build custom UI, e.g. React, Preact,
Vue, Svelte, SolidJS, etc. With front-end tooling, its hot-reload/HMR will help
you to do faster.

::: info

Note that NPM packages those are designed to run only in NodeJS cannot be used
to build plugins.

:::

::: tip

With the build tool, the output of your bundled assets may have incorrect paths.
Please refer to the [Asset Handling](./asset-handling) to make correct them.

:::

## Using TypeScript

<Badge type="tip" text="since v1.2" />

Pengu publishes its type definitions as **[`@pengujs/types`][pkg]**. Install it
as a dev dependency:

::: code-group

```sh [npm]
npm install --save-dev @pengujs/types
```

```sh [pnpm]
pnpm add -D @pengujs/types
```

```sh [yarn]
yarn add -D @pengujs/types
```

:::

Then pull the global declarations in, either from a single source file:

```ts
/// <reference types="@pengujs/types" />
```

Or once for the whole project, in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@pengujs/types"]
  }
}
```

Every Pengu surface on `window` is now type-checked —
[`Pengu`](../runtime-api/pengu), [`os`](../runtime-api/#window-os),
[`DataStore`](../runtime-api/data-store), [`Toast`](../runtime-api/toast),
[`CommandBar`](../runtime-api/command-bar), [`Effect`](../runtime-api/effect)
and [`Settings`](../runtime-api/settings) — with no imports at the call site.

### Typing your plugin entry

The package also exports the plugin module types, so your entry points get
checked against what the loader actually passes:

```ts
import type { PluginInitContext } from '@pengujs/types'

export function init({ rcp, socket, meta, fs }: PluginInitContext) {
  console.log('loading', meta?.name)
}

export function load() {
  Toast.success('Ready!')
}
```

`meta` and `fs` are optional in the type because single-file plugins don't
receive them — see [Plugin layouts](./javascript-plugin#plugin-layouts).

### Writable JSON imports

`$write` is added at runtime, so cast at the import site to surface it:

```ts
import _config from './config.json'
import type { WritableJson } from '@pengujs/types'

const config = _config as WritableJson<typeof _config>

config.theme = 'dark'
await config.$write(2)
```

[pkg]: https://www.npmjs.com/package/@pengujs/types

## Example plugins

- [balance-buff-viewer](https://github.com/nomi-san/balance-buff-viewer) - Shows
  Aram balance buffs/nerfs in champ-select. Built with Vite and TypeScript.
