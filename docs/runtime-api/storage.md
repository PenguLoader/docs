# Storage

Per-plugin key/value storage that scales. Each plugin gets its own database, and
writing one key costs the same whether you've stored ten records or ten
thousand.

```js
export async function init({ meta, storage }) {
  if (!storage) return // top-level plugin, see below

  const profile = await storage.get('profile', { seen: 0 })
  profile.seen++
  await storage.set('profile', profile)
}
```

::: tip

**Top-level** plugins don't have this namespace, for the same reason they don't
have [`fs`](./fs): a `plugins/my-plugin.js` owns no directory, so there's no
identity to scope storage to. Ship your plugin as a folder —
`plugins/my-plugin/index.js` or `plugins/@author/my-plugin/index.js`.

:::

## Storage or DataStore?

Both persist across restarts. They're for different jobs.

|                   | [`DataStore`](./data-store)  | `context.storage`             |
| ----------------- | ---------------------------- | ----------------------------- |
| Scope             | shared by every plugin       | yours alone                   |
| Reads             | synchronous                  | `await`                       |
| Good for          | a handful of settings        | datasets, caches, per-match records |
| Limit             | 128 MB, shared with everyone | 256 MB, yours                 |

Use `DataStore` for a few settings you want to read synchronously during `init`.
Use `storage` for anything that grows.

::: warning Spread your data across keys

Storage is fast because it writes one record at a time. Putting everything in a
single key throws that away — `storage.set('everything', bigObject)` re-writes
the whole value *and* serializes it on the UI thread.

```js
// Slow, and gets slower as `all` grows
await storage.set('champions', all)  // [!code --]

// Flat, no matter how many champions there are
for (const c of all) await storage.set(`champion:${c.id}`, c)  // [!code ++]
```

:::

## Values

Anything JSON can represent, handed back as what you put in:

```js
await storage.set('config', { theme: 'dark', tags: ['a', 'b'] })
const config = await storage.get('config')
// { theme: 'dark', tags: ['a', 'b'] }
```

Strings included — you don't need to stringify anything yourself.

```js
await storage.set('name', 'Teemo')
await storage.get('name') // 'Teemo'  (a string, not a parsed document)
```

Because JSON does the serializing, its limits are yours:

| You store   | You get back            |
| ----------- | ----------------------- |
| `Date`      | an ISO string           |
| `Map`, `Set`| `{}`                    |
| `undefined` inside an object | the key disappears |
| `NaN`, `Infinity` | `null`            |
| `BigInt`, circular reference | **throws** |

This matches [`DataStore`](./data-store) exactly, so nothing changes if you're
migrating.

::: tip

Binary values aren't supported yet. Passing an `ArrayBuffer` or a typed array
throws, rather than silently storing `{}`.

:::

## Security model

`storage` is a **capability object**, exactly like [`fs`](./fs): whoever holds it
can use it, with no further check on who's calling.

::: danger

Passing your `storage` to imported third-party code gives that code your
plugin's data — reading it, rewriting it, and wiping it. Treat it like an API
key.

:::

What limits the damage is scope. A leaked `storage` reaches one plugin's data and
never another's, and it can't reach the filesystem at all.

Your data lives outside your plugin folder, which means two useful things:
reinstalling or updating your plugin doesn't wipe it, and a leaked
[`fs`](./fs#security-model) can't delete it.

## context.storage.get(key, fallback?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

```ts
function get<T = unknown>(key: string, fallback?: T): Promise<T | undefined>
```

Read a value back.

### Params

- `key` — the key to read.
- `fallback` — (optional) returned when the key doesn't exist.

### Return value

A `Promise` of the stored value, or `fallback` when the key is missing.

::: tip

A stored `null` is a real value and is returned as `null` — the fallback only
applies to keys that aren't there. Use
[`has()`](#context-storage-has-key) if you need to tell them apart.

:::

### Example

```js
const theme = await storage.get('theme', 'dark')

await storage.set('nothing', null)
await storage.get('nothing', 'fallback') // null, not 'fallback'
```

## context.storage.set(key, value)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

```ts
function set(key: string, value: unknown): Promise<boolean>
```

Store a value under a key, replacing whatever was there.

### Params

- `key` — the key to store under.
- `value` — any JSON-representable value. `undefined` deletes the key.

### Return value

A `Promise` of `true` on success.

`false` means the write didn't happen — almost always the
[quota](#storage-limits). A message naming your plugin and the key is logged to
the console when that happens.

::: warning

A value JSON can't represent — a circular reference, a `BigInt` — **throws**
rather than returning `false`. That's a bug in your code, not a storage failure,
and it would be miserable to debug as a silent `false`.

:::

### Example

```js
await storage.set('score', 42)
await storage.set('match:1234', { win: true, kda: [7, 2, 11] })

// Deletes, the same as calling delete()
await storage.set('score', undefined)
```

## context.storage.has(key)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

```ts
function has(key: string): Promise<boolean>
```

Whether a key exists. Cheaper than `get` when you don't need the value.

### Example

```js
if (!(await storage.has('migrated'))) {
  await migrate()
  await storage.set('migrated', true)
}
```

## context.storage.delete(key)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

```ts
function delete(key: string): Promise<boolean>
```

Remove one key.

### Return value

A `Promise` of `true` if the key existed and was removed, `false` if it wasn't
there.

### Example

```js
await storage.delete('stale-cache')
```

## context.storage.keys()

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

```ts
function keys(): Promise<string[]>
```

Every key in your store, sorted.

### Example

```js
// Clear one namespace without touching the rest
for (const key of await storage.keys()) {
  if (key.startsWith('cache:')) await storage.delete(key)
}
```

::: tip

Prefixing keys — `cache:`, `match:`, `champion:` — makes this pattern work well.
Keys sort alphabetically, so a prefix groups them.

:::

## context.storage.clear()

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

```ts
function clear(): Promise<number>
```

Remove every key.

### Return value

A `Promise` of how many keys were removed.

## context.storage.size()

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

```ts
function size(): Promise<number>
```

Bytes your store occupies on disk.

This is the file size, so it can be larger than the data you've stored — see
[`usage()`](#context-storage-usage) for the number the quota actually measures.

## context.storage.usage()

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

```ts
function usage(): Promise<{ used: number, quota: number }>
```

How much of your quota you're using, both values in bytes.

### Example

```js
const { used, quota } = await storage.usage()
console.log(`${Math.round(used / quota * 100)}% used`)
```

## Storage limits

Each plugin gets **256 MB**. It's per-plugin, so nothing another plugin does can
use yours up.

A write that would exceed it fails: `set` returns `false`, nothing is stored, and
a warning naming your plugin and the key appears in the console. Your existing
data is untouched and still readable — the store doesn't break, it just stops
growing.

Nothing is deleted on your behalf to make room. If you want cache eviction,
build it: `keys()` plus your own policy.

### Deleting gives the space back

Freed space returns to your quota shortly after you delete — a background pass
reclaims it once your plugin stops writing.

`usage()` reflects the deletion straight away, so use that rather than `size()`
to decide whether you're near the limit. `size()` is the file on disk, and the
file catches up a moment later.

```js
await storage.clear()
const { used } = await storage.usage() // already down
const bytes = await storage.size()     // still large for a moment
```

## Where the data lives

One database file per plugin, under Pengu's data folder — not inside your plugin
directory. That's deliberate: updating or reinstalling your plugin replaces its
folder, and your users' data shouldn't go with it.

The filename is a hash of your plugin's path, so it isn't readable at a glance.
The database records which plugin it belongs to internally, which is how Pengu
identifies leftover data from plugins that are no longer installed.
