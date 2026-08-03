# JSON Module

This page describes how to use ESM-style imports for JSON files and the special
`$write` functionality to persist changes back to the file system. This runtime
feature allows importing JSON files as modules, similar to Node.js, while also
enabling programmatic updates to the imported JSON data.

## Importing a JSON File

To import a JSON file in this CEF runtime, use ESM syntax as you would in
Node.js:

```ts
import config from './config.json'
```

Once imported, config holds the JSON data as an object.

::: warning

You cannot import JSON modules from remote URL.

:::

## Accessing JSON Properties

You can read properties from the imported JSON object as usual:

```ts
console.log(config.x) // Outputs the value of `x` in config.json
```

## Writing JSON Data

`since v1.2.0`

Pengu runtime allows you to modify properties of the imported JSON object. To
persist these changes back to the file system, use the special `$write` method.

Modify the properties:

```ts
config.x = 20 // Modify a property
```

Call `$write` to save:

```ts
await config.$write()
```

The `$write` method asynchronously writes the current state of the `config`
object back to `config.json`, preserving all modifications. The returned promise
resolves once the file is on disk, and rejects if the write failed.

### Formatting the output

`$write` accepts an optional argument that mirrors the third parameter of
[`JSON.stringify`][stringify]:

```ts
await config.$write() // compact, no whitespace
await config.$write(2) // indent with 2 spaces
await config.$write('\t') // indent with tabs
```

A number from 0 to 10 indents by that many spaces, and a string of up to 10
characters is used as the indent verbatim. Anything else is ignored and the
output is compact.

[stringify]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

### Writes are atomic

Pengu writes to a temporary file next to the target first, then renames it over
the original. If the client crashes mid-write, your `config.json` is left intact
rather than truncated.

::: tip

`$write` only exists on JSON files whose top level is an object or an array —
primitives like `42` or `"hello"` can't carry a method. Ship your config as
`{ ... }` and you'll never hit this.

:::

## What `$write` can reach

`since v1.2.0`

**`$write` can only overwrite the exact file it was imported from.** It takes no
path, and there is no way to point it somewhere else.

This is enforced by the runtime rather than by convention: the native side
identifies the calling script from the JavaScript stack, which can't be forged,
and refuses anything that isn't a `.json` module served from `https://plugins/`.

The practical consequence: importing a third-party library into your plugin does
**not** give that library the ability to modify your plugin's files, or any
other plugin's.

::: tip

Need to read or write more than one file? Folder plugins get a scoped
filesystem — see [PluginFS](../fs).

:::
