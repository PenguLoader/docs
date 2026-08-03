# PluginFS

This namespace helps you to gain access to **plugin's own directory** and
perform some basic file system operations.

```js
export function init({ meta, fs }) {
  if (!fs) return // top-level plugin, see below
  await fs.write('state.json', JSON.stringify({ ok: true }))
}
```

::: tip

**Top-level** plugins don't have this namespace since they don't own a
directory.

A folder plugin — `plugins/my-plugin/index.js`, or
`plugins/@author/my-plugin/index.js` — gets an `fs` scoped to that folder. A
single-file `plugins/my-plugin.js` gets nothing, because the only folder it
could be scoped to is the plugins root, which holds everyone else's files. If
you need a filesystem, ship your plugin as a folder.

:::

::: warning

All paths passed into this API are **relative to the root** directory of your
plugin.

:::

::: danger

APIs under this namespace return a **Promise of `undefined`** (or `false` / `0`,
depending on the method) when the path is rejected. They don't throw, so check
the return value.

:::

## What counts as a legal path

Everything is resolved inside your plugin folder, and there is no way to address
anything outside it:

- Absolute paths are rejected.
- `..` is rejected as a path component — not stripped, rejected.
- Symlinks are rejected at **every** level of the path, not just the last one.
- The final resolved path is re-checked against your plugin root before anything
  runs.

Also rejected: empty path components, components longer than 255 bytes, paths
longer than 4096 bytes, `:` and NUL anywhere in a component, and — on Windows —
reserved device names (`CON`, `PRN`, `AUX`, `NUL`, `COM1`–`COM9`, `LPT1`–`LPT9`)
plus names ending in a dot or a space.

Reads and writes are capped at **16 MB**.

## Security model

`fs` is a **capability object**: whoever holds it can use it. There's no further
check on who's calling.

That's different from [`$write`](./modules/json) and
[`?dir`](./modules/directory), which figure out their target from the calling
script and can't be handed to anyone.

::: danger

Passing your `fs` to imported third-party code gives that code your plugin's
folder, including the ability to leave files behind that survive restarts. Treat
it like an API key.

:::

What limits the damage is the scope: a leaked `fs` reaches one plugin's folder,
never another plugin's, and never your `index.js`.

## context.fs.read(path)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

Read a file in text mode.

### Params

- `path` - The path of the file you want to access with respect to the plugin
  root directory.

### Return value

A `Promise` of content `string` on success.

A `Promise` of `undefined` on failure — missing, not a file, unreadable, or
larger than 16 MB. These aren't distinguished.

### Example

```javascript
context.fs.read('./index.js').then((content) => {
  console.log(content)
})

const content = await context.fs.read('./README.md')
```

::: tip

Text only. There's no byte-array API, so reading a binary file gives you
mojibake rather than an error.

:::

## context.fs.write(path,content,options?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

Write a file in text mode.

### Params

- `path` - The path of the file you want to access with respect to the plugin
  root directory.
- `content` - The content `string` you want to write into the file.
- `options.append` - Append to file if set to `true` or overwrite file if
  `false`. This is `false` by default.

::: warning

`since v1.2.0` the third argument is an options object. It used to be a bare
`enableAppendMode` boolean.

```javascript
await context.fs.write('./log.txt', 'x', true) // [!code --]
await context.fs.write('./log.txt', 'x', { append: true }) // [!code ++]
```

:::

### Return value

A `Promise` of `boolean` indicating success or failure.

### Example

```javascript
// Create test.txt and write "Hello" into it
context.fs.write('./test.txt', 'Hello').then((result) => {
  if (result) {
    // success
  } else {
    // fail
  }
})

// Appending " World!" to it
const result = await context.fs.write('./test.txt', ' World!', { append: true })
```

::: tip

This API can create a file but can't create a file under a non-existing
directory. Call `context.fs.mkdir` first.

:::

::: danger

**Your plugin's own `index.js` can't be written or removed.** `write` returns
`false` and `rm` returns `0` for it.

It's the only file in your folder that Pengu executes on its own at launch, so
allowing writes there would let a single bad dependency install itself
permanently. Every other file in your folder is writable, and nothing else is
auto-loaded.

:::

### Writes are atomic

Overwriting goes through a temporary file in the same directory, then a rename.
A crash mid-write leaves the previous contents intact instead of a truncated
file. Appending writes directly.

## context.fs.mkdir(path)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

Create directories recursively.

### Params

`path` - The directory path you want to create with respect to the plugin root
directory.

### Return Value

A `Promise` of `boolean` indicating success or failure.

::: warning

`since v1.2.0` this is idempotent — a directory that already exists counts as
success. It used to return `false` in that case.

:::

### Example

```javascript
const bMkdir0 = await context.fs.mkdir('utils')
const bMkdir1 = await context.fs.mkdir('/a/b')
const bMkdir2 = await context.fs.mkdir('/a\\c')
// true — already exists is not a failure
const bMkdir3 = await context.fs.mkdir('a\\b/')
```

## context.fs.stat(path)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

Get status of a file.

### Params

- `path` - The file path with respect to the plugin root directory. Omit it to
  stat your plugin root.

### Return value

A `Promise` of `FileStat` on success. A `Promise` of `undefined` on failure.

```typescript
interface FileStat {
  fileName: string

  // 0 if isDir is true
  length: number
  isDir: boolean
  isFile: boolean
}
```

### Example

```javascript
const stat1 = await context.fs.stat('a/b')
if (stat1) {
  console.log("it's a directory")
}
const stat2 = await context.fs.stat('a/random.js')
```

## context.fs.ls(path)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

List files and directories under given path.

### Params

- `path` - The directory path with respect to the plugin root directory. Omit it
  to list your plugin root.

### Return value

A `Promise` of `string[]` of file name strings on success, sorted
alphabetically. Symlinked entries are skipped rather than listed.

A `Promise` of `undefined` on failure.

## context.fs.rm(path,options?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

::: danger

You should know what you are doing when using this.

:::

Remove file/directories.

Just like `rm` command in Unix-like systems.

### Params

- `path` - The file/directory path with respect to the plugin root directory.
- `options.recursive` - Delete all files/directories under the given path
  recursively. This is `false` by default.

::: warning

`since v1.2.0` the second argument is an options object. It used to be a bare
`recursively` boolean.

```javascript
await context.fs.rm('./dir', true) // [!code --]
await context.fs.rm('./dir', { recursive: true }) // [!code ++]
```

:::

### Return value

A `Promise` of `number` showing how many files and directories is deleted.

Your plugin root itself and your `index.js` are refused, and return `0`.

### Example

You can only delete a non-empty directory with `recursive` set to `true`

```javascript
// 1
const bRm1 = await context.fs.rm('./empty-dir')
// 1
const bRm2 = await context.fs.rm('./random-file-under-plugin-root')

// bRm3 == 0 because it's not empty
const bRm3 = await context.fs.rm('./non-empty-dir')
// bRm4 >= 1 with recursive set to true
const bRm4 = await context.fs.rm('./non-empty-dir', { recursive: true })
```
