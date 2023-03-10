# Rntime API

These APIs are designed to use inside League Client with Pengu Loader plugin
runtime.

## `window.openDevTools()`

<Badge type="tip" text="since v0.3" />

Call this function to open the built-in Chrome DevTools window.

Example:

```js
window.openDevTools()
```

## `window.openAssetsFolder()`

<Badge type="tip" text="since v1.0" />

Call this function to open the assets folder in new File Explorer window.

Example:

```js
window.openAssetsFolder()
```

## `window.openPluginsFolder()`

<Badge type="tip" text="since v1.0" />

Call this function to open the plugins folder in new File Explorer window.

Example:

```js
window.openPluginsFolder()
```

## `window.__llver`

<Badge type="tip" text="since v0.6" />

This property returns the current version of Pengu Loader.

Example:

```js
console.log(window.__llver) // e.g 0.6.0
console.log('You are using Pengu Loader v' + window.__llver)
```

## TypeScript declaration

```ts
namespace globalThis {
  function openAssetsFolder(): void
  function openPluginsFolder(): void
  function openDevTools(remote?: boolean): void
  var __llver: string

  namespace AuthCallback {
    function createURL(): string
    function readResponse(url: string, timeout: number): Promise<string | null>
  }

  namespace DataStore {
    function has(key: string): boolean
    function get(key: string): any
    function set(key: string, value: any): void
    function remove(key: string): boolean
  }

  namespace Effect {
    type EffectName = 'mica' | 'acrylic' | 'unified' | 'blurbehind'
    const current: EffectName | null
    function apply(name: EffectName): boolean
    function apply(
      name: Exclude<EffectName, 'mica'>,
      options: { color: string },
    ): boolean
    function clear(): void
    function on(
      event: 'apply',
      listener: (name: string, options?: object) => any,
    ): void
    function on(event: 'clear', listener: () => any): void
    function off(event: 'apply' | 'clear', listener: () => any): void
  }
}
```
