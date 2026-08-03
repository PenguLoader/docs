# Directory Module

Pengu runtime allows you to access plugins' folder using the `import` statement.

## Importing a directory (folder)

`since v1.2.0`

You can import a directory by appending `?dir` to the import path. The result is
an instance of a built-in **Directory** class, which provides various methods to
interact with the folder.

```js
import images from './images?dir'
```

The folder doesn't have to exist yet. `?dir` resolves as long as the path is
valid, so you can import a folder and let `reveal()` create it the first time
your user asks for it.

### Rules

- **Relative Paths Only**: Import paths must be relative.
- **No Dynamic Imports**: Using dynamic imports with `?dir` is unsupported.
- **Local Only**: Directory imports from remote URLs are not allowed.

These aren't style rules — together they're what keeps the plugins folder out of
reach of remote scripts. A relative import resolves against the URL of the file
doing the importing, so `./images?dir` inside your plugin resolves to
`https://plugins/your-plugin/images`, while the same line inside a script loaded
from `https://example.com/` resolves against *that* origin and never reaches
Pengu. There's no constructor and no way to build a Directory from a string at
runtime.

::: warning

A Directory is scoped to the **plugins folder**, not to your plugin. Any plugin
can reach any folder under `plugins/`. Don't treat it as a privacy boundary
between plugins — if you need one, folder plugins get a properly scoped
[PluginFS](../fs).

:::

<br>

See the sections below to use the instance properties and methods.

## `Directory.url` <Badge type="tip" text="property" />

```ts
const url: string
```

A read-only property that returns the URL to the directory, without a trailing
slash.

For example, your plugin name is `your-plugin` and the code is executed in the
`index.js`.

```ts
// plugin index.js
import images from './images?dir'

console.log(images.url)
// output: https://plugins/your-plugin/images
```

To build the URL of a file *inside* the folder, use `urlFor()` below rather than
joining strings yourself.

## `Directory.exists()` <Badge type="tip" text="method" />

```ts
function exists(): Promise<boolean>
```

Indicates whether the directory exists or not. The filesystem is checked on
every call, so the answer is always current.

```js
import images from './images?dir'

if (!(await images.exists())) {
  console.log('no images folder yet')
}
```

## `Directory.files()` <Badge type="tip" text="method" />

```ts
function files(): Promise<string[]>
```

Lists all files in the directory, not including folders and files in subfolders.
The method returns a promise with array of file names, sorted, so your UI
renders in a stable order.

```js
import images from './images?dir'

for (let file of await images.files()) {
  console.log('image: %s', file)
}
```

A directory that doesn't exist resolves to an empty array — that's the normal
state before your user has added anything, not an error. A directory that exists
but can't be read rejects, so a real permission problem doesn't quietly look
like an empty folder.

## `Directory.urlFor()` <Badge type="tip" text="method" />

```ts
function urlFor(name: string): string
```

Returns the URL of a file inside the directory, with the name properly encoded.

```js
import images from './images?dir'

for (const file of await images.files()) {
  const img = document.createElement('img')
  img.src = images.urlFor(file)
  document.body.appendChild(img)
}
```

::: warning

Don't join `url` and a file name yourself. `url` has no trailing slash, and raw
file names aren't URL-safe — a file called `hero#2.png` would be cut off at the
`#`, and names containing `%` or `?` break in other ways. `urlFor()` handles all
of it.

:::

`name` must be a plain file name. Path separators and `..` throw a `TypeError`,
since this method reaches into the folder and never out of it.

## `Directory.reveal()` <Badge type="tip" text="method" />

```ts
function reveal(): Promise<void>
```

Call this method to open the directory in the system's file explorer, such as
**Explorer** on Windows or **Finder** on macOS. If the directory doesn't exist,
it's created first, along with any missing parent folders.

That's useful when user needs to add files to the folder, just clicks a button
and the folder appears.

```js
import images from './images?dir'

document.querySelector('#browse').onclick = () => images.reveal()
```

The promise rejects if the folder couldn't be created or opened. To open only a
folder that already exists, check first:

```js
if (await images.exists()) {
  await images.reveal()
}
```

## What Directory doesn't do

These are deliberate omissions, not oversights:

- **No sub-folder listing.** There's no `dirs()`, because a Directory can't be
  built from a string — the names would be useless. A sub-folder you know about
  is still reachable with a second import:
  `import icons from './images/icons?dir'`.
- **No reading or writing files.** Use [`?raw` or `?url`](../../guide/asset-handling)
  imports to read a file, [`$write`](./json) on an imported `.json` to save one,
  or [PluginFS](../fs) for general access.
- **No delete or rename.**
