# Runtime API

Các API này được thiết kế để sử dụng bên trong League Client với plugin Pengu Loader.

## `window.openDevTools()`

<Badge type="tip" text="since v0.3" />

Gọi hàm này để mở cửa sổ Chrome DevTools.

Ví dụ:

```js
window.openDevTools()
```

## `window.openAssetsFolder()`

<Badge type="tip" text="since v1.0" />

Gọi hàm này để mở thư mục assets trong một cửa sổ File Explorer mới.

Ví dụ:

```js
window.openAssetsFolder()
```

## `window.openPluginsFolder()`

<Badge type="tip" text="since v1.0" />

Gọi hàm này để mở thư mục plugins trong một cửa sổ File Explorer mới.

Ví dụ:

```js
window.openPluginsFolder()
```

## `window.__llver`

<Badge type="tip" text="since v0.6" />

Thuộc tính này trả về phiên bản hiện tại của Pengu Loader.

Ví dụ:

```js
console.log(window.__llver) // e.g 0.6.0
console.log('Bạn đang sử dụng Pengu Loader phiên bản ' + window.__llver)
```

## Khai báo TypeScript

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
