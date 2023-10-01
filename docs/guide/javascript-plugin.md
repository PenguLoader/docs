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

A plugin's entry point is an exported function in the plugin index that is called automatically by the loader.
The `init` entry should be called before League Client initializes its scripts.

```js
export function init(context) {
  // your code here
}
```
- See [`context.rcp`](../runtime-api/rcp) to use RiotClientPlugin hooks from this `context`.
- See [`context.socket`](../runtime-api/socket.md) to use built-in socket observation.

As of v1.1.0, you no longer need to put your load script in the `load` event of `window`.
Instead, you can put in the `load` entry, it will be called even after window is loaded.

```js
export function load() {
  // your code here
}
```

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
