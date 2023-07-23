# Effect

This namespace supports changing window transparency effect.

<br>

![](https://user-images.githubusercontent.com/38210249/216951830-b3bb3ce3-7a5f-4e60-8a67-33d0bce799cf.png)

## Effect.current

<Badge type="info" text="string" />
<Badge type="tip" text="since v1.0.1" />

A read-only property that returns the currently applied effect or `null` if
no effect has been applied.

Available effects: `mica`, `acrylic`, `unified` and `blurbehind`.

Example:

```js
console.log(Effect.current)
// mica
```

## Effect.apply(name, options?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.0.1" />

A function that takes the name of the desired effect name and an optional
object.<br> It returns a boolean indicating whether the effect was successfully
applied or not.

Parameters:

- `name` [required] These effect names above to be applied, in string.

- `options` [optional] Additional options for the effect, `acrylic`, `unified`
  and `blurbehind` could have tint color, but `mica` will ignore this options.

This function returns `false` if the effect could not be applied, see the
[System compatibility](#system-compatibility) below.

Example:

```js
// enable acrylic on Windows 10
Effect.apply('acrylic')

// with a tint color
Effect.apply('unified', { color: '#4446' })

// mica on windows 11, no options needed
Effect.apply('mica')
```

::: info

Tint colors must be in CSS hex color format, e.g. #RGB, #RGBA, #RRGGBB,
#RRGGBBAA.

To see transparency effect correctly, you should remove all lowest backgrounds.

:::

![](https://user-images.githubusercontent.com/38210249/216951865-bb9c6676-58ec-4c81-ad96-67e94e91ac22.png)

## Effect.clear()

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.0.1" />

A function that clears any currently applied effect, then the Client background
will be black.<br> Using `Effect.current` after clearing will give you
`undefined`.

Example:

```js
// just clear applied effect, even if nothing applied
Effect.clear()
```

## System compatibility

<!-- - These effects are currently supported only Windows 7+. -->

- On Windows 7, only the `blurbehind` is supported.
- On Windows 10, requires build 1703 or higher to use `acrylic`.
- `mica` and `unified` are only supported on Windows 11, but `unified` can be
  enabled on Windows 10 without different from `acrylic`.

::: warning

On Windows 10 build **1903** (19H1) and higher, enabling `acrylic/mica/unified` with
**Transparency effects** (in Personalize -> Color settings) will cause lag when
moving the Client window.

:::

## Listening for changes

Add a listener which will be triggered when effect changed.

```js
window.addEventListener('effect-changed', (event) => {
  console.log(event.detail)
})
```