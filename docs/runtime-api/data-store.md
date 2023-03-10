# `DataStore` <Badge type="tip" text="since v1.0" />

League Client does not store user data on disk, similar to incognito mode in web
browsers. This namespace helps you to store user data on disk.

## `DataStore.set(key, value)`

Call this function to store your data with a given key.

- `key` (required) Keys should be string or number.
- `value` (required) Value may be string, number, boolean, null or collection
  like array and object. Actually, it will be stored as JSON format, so any
  value like function and runtime object are ignored.

Example:

```js
let my_num = 10
let my_str = 'hello'
DataStore.set('my_num', my_num)
DataStore.set('my_str', my_str)
```

::: tip

Unique keys You should use unique names for keys, do not use common names, e.g
`access_token`, `is_logged`, etc. Other plugins can override your data, you can
add prefix to your keys.

:::

## `DataStore.get(key)`

Retrieve your stored data with a given key. If the key does not exist, it will
return `undefined`.

Example:

```js
console.log(DataStore.get('my_str'))
console.log(DataStore.get('key-does-not-exist')) // undefined
```

## `DataStore.has(key)`

This function returns a boolean indicating whether data with the specified key
exists or not.

```js
console.log(DataStore.has('my_num'))
console.log(DataStore.has('key-does-not-exist'))
```

## `DataStore.remove(key)`

This function removes the specified data from storage by key, returns true if
the existing key-value pair has been removed.

Example:

```js
DataStore.remove('some-key')
DataStore.has('some-key') // -> false
```
