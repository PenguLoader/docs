# DataStore namespace

League Client does not store user data on disk, similar to incognito mode in web
browsers. This namespace helps you to store user data on disk.

The whole store is read from disk **before any plugin runs**, and kept in memory
for the rest of the session. Reads (`get`, `has`) are therefore synchronous and
safe to call from your plugin's `init`. Writes update memory immediately and
commit to disk on a short debounce, so a burst of `set` calls (a settings slider,
say) collapses into a single write.

## DataStore.set()

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.0.1" />

```ts
function set(key: string, value: unknown): boolean
```

Stores data associated with the specified key.

#### Parameters

- `key` (string) The key under which the data will be stored. Keys must be unique across
  all plugins to avoid conflicts.

- `value` (unknown) The value to store. Supported types include:
  - Primitive types: string, number, boolean, null
  - Collections: arrays, objects

All data is serialized into JSON format, so non-serializable types such as
functions and runtime objects will be ignored.

#### Returns

`true` if the value was accepted, `false` if `key` was not a string.

The return value is **not** a write confirmation — it means "stored in memory,
and it will reach disk shortly". Use [`flush()`](#datastore-flush) if you need
to know the data is durable.

#### Example

```js
let my_num = 10
let my_str = 'hello'
DataStore.set('my_num', my_num)
DataStore.set('my_str', my_str)
```

#### Remarks

To avoid data conflicts, use unique and descriptive key names, preferably
prefixed with your plugin’s identifier. For example, use
`plugin-name/user-settings` instead of generic names like `settings` or `data`.

For multiple data entries such as config or user settings, you should store them
in an object.

```ts
let config = { a: 10, b: 'hello' }
DataStore.set('my-config', config)
```

## DataStore.get()

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.0.1" />

```ts
function get<T = unknown>(key: string, fallback?: T): T | undefined
```

Retrieves stored data by key. If the key does not exist, the function will
return undefined or an optional fallback value.

This is a synchronous read against the in-memory copy, so it is safe to call
from your plugin's `init`.

#### Parameters

- `key` (string) The key associated with the data.

- `fallback` (T) (optional) A default value to return if the key does not exist.

#### Returns

The stored data, or the fallback value if the key is missing.

#### Example

```js
console.log(DataStore.get('my_str'))
// some string
console.log(DataStore.get('key-does-not-exist'))
// undefined
```

Since **v1.0.5**, you can set fallback value for non-existent keys.

```js
console.log(DataStore.get('key-does-not-exist', 1000))
// 1000
```

## DataStore.has()

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.0.1" />

```ts
function has(key: string): boolean
```

Checks if a specific key exists in the storage.

#### Parameters

- `key` (string) The key to check.

#### Returns

A boolean value indicating whether the key exists.

#### Example

```js
console.log(DataStore.has('my_num'))
console.log(DataStore.has('key-does-not-exist'))
```

## DataStore.remove()

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.0.1" />

```ts
function remove(key: string): boolean
```

Removes a key-value pair from storage.

#### Parameters

- `key` (string) The key of the data to remove.

#### Returns

- `true` if the key was found and removed.
- `false` if the key does not exist.

Like `set`, the removal applies to memory immediately and is committed to disk
on the same debounce.

#### Example

```js
DataStore.remove('some-key')
DataStore.has('some-key') // -> false
```

## DataStore.flush()

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

```ts
function flush(): Promise<void>
```

Writes any pending changes out immediately and resolves once they are durable
on disk.

Most plugins never need this — the debounced commit already handles normal use.
Reach for it when you are about to do something that could end the session
before the debounce fires, such as calling `restartClient()`.

#### Example

```js
DataStore.set('my-config', config)
await DataStore.flush()
window.restartClient()
```
