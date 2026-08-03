# JavaScript Plugin

Plugin development requires basic knowledge of
[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), and
[CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) if you want to make a
theme. It's pretty easy if you're already familiar with web programming.

## Creating a plugin

Suppose your new plugin name is `your-plugin`.

First, you need to create a new folder called `your-plugin` in the **plugins**
folder (inside the Pengu Loader root folder).

```
root/
  |__plugins/
    |__@default/        <- the default plugin
      |...
    |__your-plugin/     <- your new plugin
      |__index.js       <- plugin entry
```

Then create a new file called `index.js` in your plugin folder. This index is an
entry point for your plugin which will be executed when the League Client is
ready. Now you can open it in any editor and start coding.

::: tip

We recommend that you use modern JavaScript editors such as
[Visual Studio Code](https://code.visualstudio.com/) to develop your plugins, as
it supports intellisense, linter and code auto-completion.

:::

Next, just add this line to the index and save it.

```js
console.log('Hello, League Client!')
```

::: info

All your code/text files should be saved in UTF-8 encoding (no BOM). If not,
your plugin won't work as expected.

:::

Then launch your League Client, and when the Client is ready, try pressing
`Ctrl Shift I` key to open **Chrome DevTools**. Navigate to the **Console** tab
in the DevTools and scroll to the top, you will see the output message.

```
Hello, League Client!
```

## Plugin entry points

<Badge type="tip" text="since v1.1.0" />

A plugin's entry point is an exported function in the plugin index that is
called automatically by the loader. The `init` entry is called before League
Client initializes its scripts.

```js
export function init(context) {
  // your code here
}
```

The `context` gives you:

- [`context.rcp`](../runtime-api/rcp) — RiotClientPlugin hooks.
- [`context.socket`](../runtime-api/socket) — built-in socket observation.
- `context.meta` — `{ name }`, your plugin's folder name.
  <Badge type="tip" text="since v1.2" />
- [`context.fs`](../runtime-api/fs) — read/write access to your own plugin
  folder. <Badge type="tip" text="since v1.2" />

`meta` and `fs` are only present for **folder plugins** — see
[Plugin layouts](#plugin-layouts) below.

`init` may be `async`, and the loader awaits it. That is how you delay the
Client's own startup until your setup is done — but keep it short, see
[Load timing](#load-timing).

As of v1.1.0, you no longer need to register a `load` listener on `window`
yourself. Export a `load` entry instead and the loader wires it up for you.

```js
export function load() {
  // your code here
}
```

`load` runs once the Client's HTML has been parsed, which is where you should
touch the DOM. A `default` export is treated the same way if you don't export
`load`:

```js
export default function () {
  // same as `export function load()`
}
```

## Plugin layouts

Pengu recognises three shapes inside the **plugins** folder:

```
plugins/
  |__quick-tweak.js           <- single-file plugin
  |__your-plugin/
  |  |__index.js              <- folder plugin
  |__@author/
     |__their-plugin/
        |__index.js           <- namespaced folder plugin
```

Single-file plugins work, but they get neither `context.meta` nor `context.fs`
— they have no folder of their own to scope those to. If your plugin needs to
store anything next to itself, give it a folder.

Namespaced plugins (`@author/name/index.js`) are supported since v1.2, and are
the convention for anything you publish for others to install.

## Load timing

Every plugin's `init` is awaited before the Client's first RCP plugin is
released, so slow work in `init` delays Client startup for your users.

Pengu caps the total wait at **15 seconds**. If your plugins collectively take
longer, the Client is released anyway and a warning appears in the console.
Plugins still finish loading in the background, but they may miss `preInit` /
`postInit` hooks for RCP plugins that already got past those phases.

If a plugin throws while loading, the error is logged with the plugin name and
the remaining plugins carry on — one broken plugin does not take down the rest.

## Plugin templates

To get started with ease, we have already provided base plugins, check it out:
https://github.com/PenguLoader/PenguLoader/tree/v1.0.5/plugins

## What's next?

🎉 Congratulations! You have completed the beginner tutorial. Follow the next
pages to get more power out of your plugins.

- [Module System](./module-system) - Learn more about module system
- [CSS Theme](./css-theme) - Build your theme with CSS
- [Assets Handling](./asset-handling) - Add custom content to your plugins
- [LCU Request](./lcu-request) - Some guides helps you to work with LCU
- [Runtime API](../runtime-api/) - Useful built-in APIs to use in your plugins
