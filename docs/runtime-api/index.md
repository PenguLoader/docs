# Runtime API

These APIs are designed to use inside League Client with Pengu Loader plugin
runtime.

## window.openDevTools(remote?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v0.1" />

Call this function to open the built-in Chrome DevTools window.

Example:

```js
window.openDevTools()     // built-in DevTools
window.openDevTools(true) // remote DevTools
```

## window.openPluginsFolder(subdir?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v0.6" />

Call this function to open the plugins folder in new File Explorer window.

If `path` is given, it will open the path with respect to the plugins folder.

Example:

```js
window.openPluginsFolder()
window.openPluginsFolder("/plugin-demo/config")
```

## window.reloadClient()

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.0.4" />

Call this function to reload the Client and ignore caching.

Example:

```js
window.reloadClient()
```

## window.restartClient()

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.0.5" />

Call this function to restart the Client (entire the UX processes).

Example:

```js
window.restartClient()
```

## window.getScriptPath()

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

Call this function get the current script path.

Example:

```js
// https://plugins/your-plugin/index.js
window.getScriptPath()
```

## window.__llver

<Badge type="info" text="string" />
<Badge type="tip" text="since v1.0.1" />
<Badge type="warning" text="deprecated" />

This property returns the current version of Pengu Loader.

Example:

```js
console.log(window.__llver) // 0.6.0
console.log(`You are using Pengu Loader v${window.__llver}`)
```

::: tip

Since v1.1.0, this property has been deprecated.
Please use `Pengu.version` instead.

:::
