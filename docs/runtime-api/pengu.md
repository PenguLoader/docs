# Pengu

This namespace provides information about current Pengu version and its settings.

## Pengu.version

<Badge type="info" text="string" />
<Badge type="tip" text="since v1.1.0" />

A read-only property that returns the current version of Pengu Loader.

Example:

```js
console.log(Pengu.version)
// 1.0.6
```

## Pengu.superPotato

<Badge type="info" text="boolean" />
<Badge type="tip" text="since v1.1.0" />

A boolean value that indicates the **Super Low Spec Mode** is enabled or not.

Example:

```js
console.log(Pengu.superPotato)
// true
```

## Pengu.plugins

<Badge type="info" text="string[ ]" />
<Badge type="tip" text="since v1.1.0" />

An array of plugin entries.

Example:

```js
console.log(Pengu.plugins)
// [ '@default/index.js', 'your-plugin/index.js' ]
```

## Pengu.isMac

<Badge type="info" text="boolean" />
<Badge type="tip" text="since v1.1.2" />

A boolean value that indicates whether the current platform is macOS.

Example:

```js
if (Pengu.isMac) {
  console.log('Running on macOS')
}
```
