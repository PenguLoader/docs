# `window.Effect`

This namespace object allows you to change the visual effect behind the Client
window.

## Visual Effects

### `transparent`

<p align="center">
  <img src="/images/visual-transparent.png" />
</p>

Transparent window background, you can see other windows and desktop background
under the window.

> Available on Windows 7+, macOS 10.14+

### `blurbehind`

<p align="center">
  <img src="/images/visual-blurbehind.png" />
</p>

Blurbehind is also known as **aero glass** effect, it looks like Windows Vista &
Windows 7 glossy blur effect.

> Available on Windows 7+, macOS 10.14+

### `acrylic`

<p align="center">
  <img src="/images/visual-acrylic.png" />
</p>

Acrylic is a type of brush that creates a translucent texture. You can apply
acrylic to app surfaces to add depth and help establish a visual hierarchy.
Works only on Windows 10 version 1803 or higher.

> Available on Windows 10 1803+, macOS 10.14+

### `unified`

Unified is a mix of Acrylic and Blurbehind. It is available on Windows 11, but
you can use on Windows 10 with no difference from Acrylic.

> Available on Windows 11, macOS 10.14+

### `mica`

Mica is an opaque, dynamic material that incorporates theme and desktop
wallpaper to paint the background of long-lived windows. Works only on Windows
11 or greater.

> Available on Windows 11, macOS 10.14+

[Mica Alt](https://learn.microsoft.com/en-us/windows/apps/design/style/mica#app-layering-with-mica-alt)
or mica with material is introduced in Windows 11 build 22523.

- `none`
- `auto`
- `mica`
- `acrylic` Acrylic is a type of brush that creates a translucent texture. You
  can apply acrylic to app surfaces to add depth and help establish a visual
  hierarchy.
- `tabbed` Tabbed is a Mica like material that incorporates theme and desktop
  wallpaper, but is more sensitive to desktop wallpaper color.

### `vibrancy`

Vibrancy is a subtle blending of foreground and background colors to increase
the contrast and make the foreground content stand out visually.

> Available on macOS 10.14+

Vibrancy works with material like Mica on Windows 11, here is the list based on
[NSVisualEffectMaterial](https://developer.apple.com/documentation/appkit/nsvisualeffectmaterial):

- `Titlebar` The material for a window's titlebar.
- `Selection` The material for text selection.
- `Menu` The material for menus.
- `Popover` The material for the background of popover windows.
- `Sidebar` The material for the background of window sidebars.
- `HeaderView` The material for in-line header or footer views.
- `Sheet` The material for the background of sheet windows.
- `WindowBackground` The material for the background of opaque windows.
- `HudWindow` The material for the background of heads-up display (HUD) windows.
- `FullScreenUI` The material for the background of a full-screen modal
  interface.
- `Tooltip` The material for the background of a tool tip.
- `ContentBackground` The material for the background of opaque content.
- `UnderWindowBackground` The material to show under a window's background.
- `UnderPageBackground` The material for the area behind the pages of a
  document.

## System compatibility

### Windows

<!-- - These effects are currently supported only Windows 7+. -->

- On Windows 7, only the `blurbehind` is supported.
- On Windows 10, requires version 1803 or higher to use `acrylic`.
- `mica` and `unified` are only supported on Windows 11, but `unified` can be
  enabled on Windows 10 without different from `acrylic`.

::: warning

On Windows 10 build **1903** (19H1) and higher, enabling `acrylic/mica/unified`
with **Transparency effects** (in Personalize -> Color settings) will cause lag
when moving the Client window.

:::

### macOS

On macOS, we only have the `vibrancy` effect, so those Windows-based effects
will be treated as `vibrancy` with the appropriate material, and the effect will
appear when the Client window is active.

- `transparent` => `UnderWindowBackground` material
- `blurbehind` => `HudWindow` material
- `acrylic` => `FullScreenUI` material
- `unified` => `Popover` material
- `mica` => `HeaderView` material

<br>

## API functions

### `Effect.apply()` <Badge type="tip" text="since v1.0.1" />

```ts
function apply(
  name: 'transparent' | 'blurbehind' | 'acrylic' | 'unified',
  options?: { color: string },
): void
function apply(
  name: 'mica',
  options?: { material?: 'auto' | 'none' | 'mica' | 'acrylic' | 'tabbed' },
): void
function apply(
  name: 'vibrancy',
  options: { material: string; alwaysOn?: boolean },
): void
```

Apply window visual effect with the name of the desired effect.

#### Parameters

- `name` These effect names above to be applied, in string.

- `options` [optional] Additional options for the effect.

An unknown effect name, or an unknown `mica` / `vibrancy` material, is ignored
with a warning in the DevTools console rather than throwing.

#### Remarks

- `transparent`, `blurbehind`, `acrylic` and `unified` require options object
  with a `color` field is CSS hex color.

  ```js
  // enable transparent effect with accent color is #0008
  Effect.apply('transparent', { color: '#0008' })
  ```

- The `mica` might require the options with material.

  ```js
  // enable pure mica effect (Windows 11)
  Effect.apply('mica')

  // enable mica alt effect with acrylic material (Windows 11 build 22523+)
  Effect.apply('mica', { material: 'acrylic' })
  ```

- The `vibrancy` effect is like the `mica` but also has an option `alwaysOn` to
  indicate that the effect should always appear even the window is inactive, it
  is `false` by default.

  ```js
  // enable vibrancy effect with HudWindow material (macOS)
  Effect.apply('vibrancy', { material: 'HudWindow' })
  // always on
  Effect.apply('vibrancy', { material: 'HudWindow', alwaysOn: true })
  ```

::: info

Accent color must be in CSS hex color format.

- #RGB, #RRGGBB (red-green-blue)
- #RGBA, #RRGGBBAA (red-green-blue-alpha)

To see transparency effect correctly, you should remove all opaque backgrounds.

:::

### Effect.clear() <Badge type="tip" text="since v1.0.1" />

```ts
function clear()
```

Call this function to clear the applied window visual effect.

### `Effect.setTheme()` <Badge type="tip" text="since v1.1.0" />

```ts
function setTheme(theme: 'light' | 'dark')
```

Change the default theme of the Client window. There are two options `light` or
`dark`, the initial value is set by system settings.

Since v1.2.0, window theme is set to `dark` by default, and won't be affected by
system settings. You can call this function to turn on `light` theme.
