# window.Settings

<Badge type="tip" text="since v1.2.0" />

Register a settings form and Pengu renders it for you, inside the Client's own
settings drawer. You describe the fields, Pengu builds the widgets, and your
values object is kept up to date as the user changes them.

This replaces the usual approach of hand-rolling a settings UI, or asking users
to edit a JSON file by hand.

## A complete example

```js
import config from './config.json'

const schema = {
  enabled: {
    type: 'boolean',
    label: 'Enable my plugin',
    default: true,
  },
  intensity: {
    type: 'number',
    label: 'Effect intensity',
    default: 50,
    min: 0,
    max: 100,
    slider: true,
  },
}

Settings.register({
  id: 'my-plugin',
  name: 'My Plugin',
  description: 'Does something great.',
  schema,
  state: config,
  onChange: () => config.$write(2),
})
```

Pairing `state` with a [writable JSON module](./modules/json) is the shortest
path to settings that survive a restart: the drawer mutates `config` directly,
and `onChange` writes it back to disk.

## Settings.register(options)

<Badge type="info" text="function" />

```ts
function register<S extends Schema>(
  options: SettingsRegister<S>,
): SettingsHandle<InferValues<S>>
```

Add your plugin to the settings drawer.

#### Options

- `id` (string) a stable identifier, used as the drawer entry key. Your plugin's
  folder name is the usual choice.
- `name` (string) the display name in the drawer sidebar.
- `description` (string) [optional] a one-line description shown under the name.
- `icon` (string) [optional] a single character or emoji shown next to the name.
- `schema` ([Schema](#field-types)) the fields to render.
- `hotkey` (string) [optional] a shortcut that opens the drawer with your plugin
  selected, e.g. `'Ctrl+,'`. See [Hotkeys](#hotkeys).
- `state` (object) [optional] the object the drawer reads and writes. Omit it
  for ephemeral settings that live only for the session.
- `onChange` (function) [optional] called after any change. See
  [Persisting values](#persisting-values).

#### Returns

A handle:

```ts
interface SettingsHandle<V> {
  values: () => V
  set: (patch: Partial<V>) => void
  unregister: () => void
}
```

- `values()` returns the current values. Call it each time you need them rather
  than holding onto the result.
- `set(patch)` applies a partial update and fires `onChange`.
- `unregister()` removes the drawer entry and unbinds the hotkey.

#### Remarks

Registering the same `id` twice replaces the first registration and logs a
warning. This is deliberate, so reloading a plugin during development doesn't
leave a duplicate entry behind.

## Field types

A schema is a plain object of field id → field. The rendered order follows the
order you write them in.

```ts
type Field =
  | { type: 'boolean'; label: string; default: boolean; description?: string }
  | { type: 'string';  label: string; default: string;  description?: string
      placeholder?: string; multiline?: boolean }
  | { type: 'number';  label: string; default: number;  description?: string
      min?: number; max?: number; step?: number; slider?: boolean }
  | { type: 'select';  label: string; default: string;  description?: string
      options: ReadonlyArray<{ value: string; label: string }> }
  | { type: 'action';  label: string; description?: string; perform: () => void }
  | { type: 'note';    text: string }
```

- **`boolean`** renders a toggle.
- **`string`** renders a text input, or a textarea with `multiline: true`.
- **`number`** renders a number input, or a slider with `slider: true`.
- **`select`** renders a dropdown of `options`.
- **`action`** renders a button that calls `perform`. Holds no value.
- **`note`** renders a line of explanatory text. Holds no value.

`action` and `note` are the two field types that carry no value, so they never
appear in your values object.

```js
const schema = {
  mode: {
    type: 'select',
    label: 'Theme mode',
    default: 'auto',
    options: [
      { value: 'auto', label: 'Follow Client' },
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
    ],
  },
  note: {
    type: 'note',
    text: 'Changes apply on the next Client reload.',
  },
  reload: {
    type: 'action',
    label: 'Reload now',
    perform: () => window.reloadClient(),
  },
}
```

## Persisting values

Pengu does not persist anything on its own. You choose the storage:

```js
// writable JSON module — the file lives next to your plugin
import config from './config.json'
Settings.register({ id, name, schema, state: config,
  onChange: () => config.$write(2) })

// DataStore — a single key holding the whole object
const state = DataStore.get('my-plugin/settings', {})
Settings.register({ id, name, schema, state,
  onChange: (values) => DataStore.set('my-plugin/settings', values) })

// nothing — settings reset every launch
Settings.register({ id, name, schema })
```

At register time, any schema key missing from `state` is filled in with its
`default`, mutating your object in place. A `config.json` that starts as `{}`
therefore ends up fully populated on the first save.

`onChange` is debounced by about 80 ms, so dragging a slider produces one write
rather than one per pixel. It receives the current values object. An async
`onChange` is not awaited — rejections are logged to the console so a failed
save doesn't block the drawer.

::: warning

The drawer only re-renders for changes made through the drawer itself or
through `handle.set()`. If you mutate your `state` object directly, the form
will keep showing the old value until it is reopened — route programmatic
changes through `set()` instead.

:::

## Hotkeys

```js
Settings.register({
  id: 'my-plugin',
  name: 'My Plugin',
  hotkey: 'Ctrl+Shift+S',
  schema,
})
```

The hotkey opens the drawer with your plugin selected. Rules:

- At least one modifier (`Ctrl`, `Alt`, `Shift`, `Meta`) is required. A bare key
  is rejected with a console warning.
- `Ctrl` also matches `Cmd` on macOS, so one registration covers both platforms.
- Hotkeys don't fire while a text input or textarea has focus.
- If two plugins claim the same combination, the most recently registered one
  wins and a warning is logged.

`Cmd`, `Command`, `Control` and `Option` are all accepted spellings.

## Settings.open(pluginId?)

<Badge type="info" text="function" />

```ts
function open(pluginId?: string): void
```

Open the drawer. Pass a plugin id to focus that pane; omit it to reopen wherever
the user last was.

```js
CommandBar.addAction({
  name: 'My Plugin settings',
  perform: () => Settings.open('my-plugin'),
})
```

## Settings.close()

<Badge type="info" text="function" />

```ts
function close(): void
```

Close the drawer.

## Settings.list()

<Badge type="info" text="function" />

```ts
function list(): Array<{ id: string; name: string }>
```

Every plugin currently registered, in registration order.

```js
console.log(Settings.list())
// [ { id: 'my-plugin', name: 'My Plugin' } ]
```

## TypeScript

With [`@pengujs/types`](../guide/npm-typescript) installed, writing the schema
`as const` lets TypeScript infer the shape of your values object from the
defaults:

```ts
const schema = {
  enabled: { type: 'boolean', label: 'Enabled', default: true },
  threshold: { type: 'number', label: 'Threshold', default: 50 },
} as const

const handle = Settings.register({ id: 'my-plugin', name: 'My Plugin', schema })

handle.values().enabled // boolean
handle.values().threshold // number
handle.set({ threshold: 80 }) // ok
handle.set({ threshold: 'high' }) // type error
```
