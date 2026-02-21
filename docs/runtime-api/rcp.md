# rcp

This object provides easy access and hook to the Riot Client Plugin (RCP) system.

Get the `rcp` in your plugin entry:

```js
export function init(context) {
  const rcp = context.rcp
}
```

Or get it globally via `window` object:

```js
const rcp = window.rcp
```

## rcp.preInit(name, callback)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

Register a callback that will be triggered before the target plugin loads.

### Params
- `name` - RCP name, should be prefixed with `rcp-`.
- `callback` - A function will be triggered before the plugin loads.

You can delay the plugin loads by blocking your async callback.

Example:

```js
rcp.preInit('rcp-name', (context) => {
  // do something
})

rcp.preInit('rcp-name', async () => {
  // delay 2 seconds
  await new Promise(r => setTimeout(r, 2000))
})
```

::: warning

Do not pre-hook `rcp-fe-commom-libs`. It is used for the plugin loader, so your callbacks sometimes will not triggered.

:::

## rcp.postInit(name, callback, blocking?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

Register a callback that will be triggered after the target plugin is loaded. Gives you an opportunity to access the plugin API.

### Params
- `name` - RCP name, should be prefixed with `rcp-`.
- `callback` - A function will be triggered after the plugin is loaded.
- `blocking` - A boolean value indicating whether this callback will be executed in blocking way. It's `false` by default.

Example:

```js
rcp.postInit('rcp-name', (api) => {
  // do something
  console.log('got rcp-name:', api)
})
```

::: tip

`postInit` and `preInit` should be called before the target plugin loads, preferably witin your plugin's `init` entry. So they will not work after the plugin is loaded.

:::

## rcp.whenReady(name)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

This function works as same as `postInit` but allows you to get the target plugin asynchronously and also works even after the plugin is loaded.

Example:

```js
const uikit = await rcp.whenReady('rcp-fe-lol-uikit')
```
