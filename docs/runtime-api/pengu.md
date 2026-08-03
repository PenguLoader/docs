# window.Pengu

This is an namespace object that provides information about current Pengu
version and the settings.

## Pengu.version

<Badge type="info" text="string" />
<Badge type="tip" text="since v1.1.0" />

A read-only property that returns the current version of Pengu Loader.

```js
console.log(Pengu.version)
// v1.2.0
```

## Pengu.superPotato

<Badge type="info" text="boolean" />
<Badge type="tip" text="since v1.1.0" />

A boolean value that indicates the **Super Low Spec Mode** is enabled or not.

```js
console.log(Pengu.superPotato)
// true or false
```

## Pengu.autoUpdateCheck

<Badge type="info" text="boolean" />
<Badge type="tip" text="since v1.2.0" />

A read-only property that indicates whether the user has **automatic update
checking** enabled. Mirrors the toggle in the Pengu hub.

```js
console.log(Pengu.autoUpdateCheck)
// true or false
```

If your plugin ships its own update check, respect this flag — a user who
turned updates off does not expect your plugin to phone home either.

## Pengu.plugins

<Badge type="info" text="string[ ]" />
<Badge type="tip" text="since v1.1.0" />

An array of plugin entries.

```js
console.log(Pengu.plugins)
// [ '@default/index.js', 'your-plugin/index.js' ]
```

## Pengu.isMac

<Badge type="info" text="boolean" />
<Badge type="tip" text="since v1.2.0" />

A read-only property that indicates the running operating system is **MacOS** or
not.

```js
console.log(Pengu.isMac)
// true or false
```
