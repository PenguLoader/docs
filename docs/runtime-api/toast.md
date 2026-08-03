# Toast

This namespace is used to push your toast notifications onto the League Client
screen.

Every method that pushes a toast returns its **id** as a string. Keep it if you
want to [update](#toast-update-id-patch) or [dismiss](#toast-dismiss-id) the toast later —
otherwise you can ignore it.

## Toast options

<Badge type="tip" text="since v1.2.0" />

All push methods take an optional options object as their last argument.

```ts
interface ToastOptions {
  duration?: number
  position?: ToastPosition
  icon?: string
  className?: string
  id?: string
  dismissable?: boolean
}

type ToastPosition =
  | 'top-left'    | 'top-center'    | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'
```

- `duration` how long the toast stays, in milliseconds. Defaults to `5000`.
  `0`, a negative number, or `Infinity` makes it **sticky** — it stays until
  dismissed. `Toast.loading()` is sticky by default.
- `position` where it appears. Defaults to `bottom-right`.
- `icon` a single character or emoji, replacing the type's default glyph.
- `className` extra CSS class on the toast element, for your own styling.
- `id` reuse an id to **replace** the existing toast instead of stacking a new
  one. Handy for de-duping a toast fired from a repeating event.
- `dismissable` whether to show the × button. Defaults to `true`.

```js
Toast.info('Saved to your config', {
  duration: 2000,
  position: 'top-center',
  id: 'config-saved', // repeated saves replace, never stack
})
```

## Toast.success(message, options?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

```ts
function success(message: string, options?: ToastOptions): string
```

Push a simple notification with a success checkmark.

Params:

- `message` a string to be shown on the notification.
- `options` [optional] see [Toast options](#toast-options).

Example:

```ts
Toast.success('Welcome to my theme!')
```

## Toast.error(message, options?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

```ts
function error(message: string, options?: ToastOptions): string
```

Push a simple notification with a failure icon.

Params:

- `message` a string to be shown on the notification.
- `options` [optional] see [Toast options](#toast-options).

Example:

```ts
Toast.error('Oops! Something went wrong.')
```

## Toast.info(message, options?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

```ts
function info(message: string, options?: ToastOptions): string
```

Push a neutral, informational notification.

Example:

```ts
Toast.info('3 new plugins were loaded.')
```

## Toast.warning(message, options?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

```ts
function warning(message: string, options?: ToastOptions): string
```

Push a notification with a warning icon.

Example:

```ts
Toast.warning('This theme was built for an older Client version.')
```

## Toast.loading(message, options?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

```ts
function loading(message: string, options?: ToastOptions): string
```

Push a notification with a spinner. Unlike the others this one is **sticky by
default** — it stays until you `update` it into a terminal state or `dismiss`
it. Pass an explicit `duration` to override that.

If all you want is "spinner until this promise settles", use
[`Toast.promise`](#toast-promise-promise-msg) instead.

Example:

```js
const id = Toast.loading('Downloading assets...')

await downloadAssets()
Toast.update(id, { type: 'success', message: 'Assets ready!' })
```

## Toast.custom(html, options?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

```ts
function custom(html: string, options?: ToastOptions): string
```

Push a notification with a body you render yourself. The string is inserted as
HTML.

Params:

- `html` an HTML string for the toast body.
- `options` [optional] see [Toast options](#toast-options).

Example:

```js
Toast.custom('<b>Patch 14.1</b><br>Your theme has been updated.', {
  duration: 8000,
})
```

::: warning

The HTML is inserted as-is. Never build it from data you did not produce —
a champion name or summoner name pulled from the LCU should be escaped, or
passed as a plain `message` to one of the typed methods instead.

:::

## Toast.promise(promise, msg)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

```ts
function promise<T>(
  promise: Promise<T>,
  msg: {
    loading: string
    success: string
    error: string | ((err: unknown) => string)
  },
  options?: ToastOptions,
): Promise<T>
```

Push a progress notification and wait for the given promise to complete. This
function returns the given promise that is helpful for then/catch chain.

Params:

- `promise` a promise that the progress waits for.
- `msg` an object with these properties:
  - `loading` a string message to be shown when the progress starts loading.
  - `success` a string to be shown when the promise is resolved.
  - `error` a string to be shown when the promise is rejected, or a function
    receiving the rejection value and returning the message.
- `options` [optional] see [Toast options](#toast-options).

Example:

```ts
let myTask = new Promise((resolve, reject) => {
  // wait for 3s then fulfill randomly
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve(10)
    } else {
      reject()
    }
  }, 3000)
})

Toast.promise(myTask, {
  loading: 'Working in progress...',
  success: 'Oh nice! 😎',
  error: 'OOps! 😥',
})
```

Use the function form of `error` when you want the reason in the message:

```js
Toast.promise(fetchRank(), {
  loading: 'Fetching your rank...',
  success: 'Got it!',
  error: (err) => `Could not fetch rank: ${err}`,
})
```

## Toast.update(id, patch)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

```ts
function update(id: string, patch: {
  message?: string
  type?: ToastType
  icon?: string
}): void
```

Change a toast that is already on screen, keeping it in place instead of
stacking a new one. Does nothing if the id is unknown.

Moving a sticky `loading` toast to a terminal type (`success`, `error`, ...)
re-arms its auto-dismiss timer, so it will fade out on its own afterwards.

Params:

- `id` the id returned when the toast was pushed.
- `patch` the fields to change. Omitted fields are left alone.

Example:

```js
const id = Toast.loading('Connecting to server...')

try {
  await connect()
  Toast.update(id, { type: 'success', message: 'Connected!' })
} catch (err) {
  Toast.update(id, { type: 'error', message: 'Connection failed.' })
}
```

## Toast.dismiss(id?)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.2.0" />

```ts
function dismiss(id?: string): void
```

Remove a toast immediately. Omit `id` to clear **every** toast currently on
screen.

Example:

```js
const id = Toast.info('Hold tight...')
Toast.dismiss(id)

// clear everything
Toast.dismiss()
```
