# DataStore namespace

League Client does not store user data on disk, similar to incognito mode in web
browsers. This namespace helps you to store user data on disk.

## DataStore.set(key, value)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.0.1" />

Call this function to store your data with a given key.

Parameters:

- `key` (required) Keys should be string or number.
- `value` (required) Value may be string, number, boolean, null or collection
  like array and object. Actually, it will be stored as JSON format, so any
  value like function and runtime object are ignored.

Returns:
- A boolean value that indicates your key is valid and the data is stored successfully. 

Example:

```js
let my_num = 10
let my_str = 'hello'
DataStore.set('my_num', my_num)
DataStore.set('my_str', my_str)
```

::: tip Unique keys

You should use unique names for keys, do not use common names, e.g
`access_token`, `is_logged`, etc. Other plugins can override your data, you can
add prefix to your keys.

:::

## DataStore.get(key, fallback?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.0.1" />

Retrieve your stored data with a given key. If the key does not exist, it will
return `undefined`.

Example:

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

## DataStore.has(key)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.0.1" />

This function returns a boolean indicating whether data with the specified key
exists or not.

```js
console.log(DataStore.has('my_num'))
console.log(DataStore.has('key-does-not-exist'))
```

## DataStore.remove(key)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.0.1" />

This function removes the specified data from storage by key, returns true if
the existing key-value pair has been removed.

Example:

```js
DataStore.remove('some-key')
DataStore.has('some-key') // -> false
```