# What's new in Pengu v1.2

## New Features

### Settings API

Declare a schema and Pengu renders a settings form for your plugin inside the
Client, with an optional hotkey to open it:

```js
Settings.register({
  id: 'my-plugin',
  name: 'My Plugin',
  hotkey: 'Ctrl+Shift+S',
  schema: {
    enabled: { type: 'boolean', label: 'Enabled', default: true },
  },
  state: config,
  onChange: () => config.$write(2),
})
```

No more hand-rolled settings UI, and no more asking users to edit JSON by hand.
See [window.Settings](../runtime-api/settings).

### Writable JSON modules

`import config from './config.json'` now gives you a `$write` method to save
changes back to disk, with optional pretty-printing:

```ts
config.theme = 'dark'
await config.$write(2)
```

Writes are atomic, and `$write` can only ever overwrite the file it was
imported from. See [JSON Module](../runtime-api/modules/json).

### Directory imports

Append `?dir` to an import path to get a handle on a folder — list its files,
build URLs for them, or open it in Explorer / Finder for your user:

```js
import images from './images?dir'

for (const name of await images.files()) {
  document.body.append(Object.assign(new Image(), { src: images.urlFor(name) }))
}
```

See [Directory Module](../runtime-api/modules/directory).

### PluginFS is back

Folder plugins get `context.fs` again — `read`, `write`, `mkdir`, `stat`, `ls`
and `rm`, scoped to the plugin's own directory. Namespaced plugins
(`plugins/@author/my-plugin/`) are supported, and top-level single-file plugins
still don't receive it. See [PluginFS](../runtime-api/fs).

## API Changes

### PluginFS options objects

The trailing boolean flags on `write` and `rm` are now options objects:

```js
await context.fs.write('./log.txt', 'x', true) // [!code --]
await context.fs.write('./log.txt', 'x', { append: true }) // [!code ++]

await context.fs.rm('./dir', true) // [!code --]
await context.fs.rm('./dir', { recursive: true }) // [!code ++]
```

### `context.fs.mkdir` is idempotent

Creating a directory that already exists now resolves `true`. It used to
resolve `false`, which was indistinguishable from a real failure.

### `context.fs` can't touch your `index.js`

`write` returns `false` and `rm` returns `0` for your plugin's own entry point.
It's the only file Pengu auto-executes from your folder, so a write there would
let one bad dependency persist itself across restarts.

### `Directory.exists()` returns a promise

```js
if (images.exists()) {} // [!code --]
if (await images.exists()) {} // [!code ++]
```

It reads the filesystem on every call rather than caching at import time, which
matters now that `reveal()` can create the folder.

### `Directory.reveal()` takes no arguments

It always creates the folder if it's missing, so the `create` flag is gone. It
returns a promise that rejects on failure, instead of `void`.
