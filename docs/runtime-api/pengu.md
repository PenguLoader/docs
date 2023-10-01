# Pengu namespace

This namespace provides information about current Pengu version and its settings.

## Pengu.version

<Badge type="info" text="string" />
<Badge type="tip" text="since v1.1.0" />

A read-only property that returns the current version of Pengu Loader.

```js
console.log(Pengu.version)
// 1.0.6
```

## Pengu.superPotato

<Badge type="info" text="boolean" />
<Badge type="tip" text="since v1.1.0" />

A boolean value that indicates the **Super Low Spec Mode** is enabled or not.

```js
console.log(Pengu.superPotato)
// true
```

## Pengu.plugins

<Badge type="info" text="string[ ]" />
<Badge type="tip" text="since v1.1.0" />

An array of plugin entries.

```js
console.log(Pengu.plugins)
// [ '@default/index.js', 'your-plugin/index.js' ]
```