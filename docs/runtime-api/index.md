# Runtime API

These APIs are designed to use inside League Client with Pengu Loader plugin
runtime.

## window.openDevTools()

<Badge type="info" text="function" />
<Badge type="tip" text="since v0.3" />

Call this function to open the built-in Chrome DevTools window.

Example:

```js
// open the DevTools
window.openDevTools()
```

## window.openPluginsFolder(path?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.0" />

Call this function to open the plugins folder in new File Explorer window.

If `path` is given, it will open the path with respect to the plugins folder.

Example:

```js
window.openPluginsFolder()
window.openPluginsFolder('/plugin-demo/config')
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

```ts
function getScriptPath(): string | undefined
```

Returns the URL of the script that called it, or `undefined` if it could not be
determined.

It works by reading the current stack trace, so call it **directly from your own
script**. Calling it from inside a callback that Pengu or the Client invokes may
return a different script's URL, or nothing at all.

Example:

```js
console.log(window.getScriptPath())
// https://plugins/your-plugin/index.js
```

## window.os

<Badge type="info" text="object" />
<Badge type="tip" text="since v1.2.0" />

A read-only object describing the operating system the Client is running on.

```ts
interface OsGlobal {
  name: 'win' | 'mac'
  version: string
  build: string
}
```

Example:

```js
console.log(window.os)
// { name: 'win', version: '10.0', build: '19045' }

if (os.name === 'mac') {
  // macOS-only code path
}
```

For a simple platform check, [`Pengu.isMac`](./pengu#pengu-ismac) is shorter.
Use `os.version` / `os.build` when an effect or API you rely on needs a minimum
OS build — see [Effect compatibility](./effect#system-compatibility).
