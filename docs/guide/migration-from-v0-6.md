# Migration from v0.6

## New plugin project structure

<Badge type="tip" text="^1.0" />

Since v0.5, we have introduced the `//assets/` domain which supports access to
resources from the **assets** folder. And now, this folder is only used for
large-common-unique resources. So every plugin will have its assets and you can
access them via `//plugins/`.

Since v1.0, the top-level `js` is not executed as a plugin entry point. Stop
putting your plugin JS files directly into the **plugins** folder. You need to
create a new folder for your plugin.

```
plugins/
  |__your-plugin/
    |__assets/
      |...         <- resources
    |__index.js    <- plugin entry
    |...           <- other utils
```

## Removed CommonJS

<Badge type="tip" text="^1.0" />

In v1.0, we have been removed CommonJS support and switched to ES module. This
means all scripts from v0.6 that use `require` and `module.exports` will not
work in the new version.

Please refer to the migration guide below.

### Update your `require()`:

```js
// before
const utils = require('./utils')

// after
import utils from './utils'
```

```js
// before
const { hello } = require('./greeting')

// after
import { hello } from './greeting'
```

> Read more at
> [MDN import statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).
> Please note that you no need to add the `.js` extension to import path.

### Also update your `module.exports`:

```js
// before
module.exports = {
  greet: () => 'Hello',
}

// after
export default {
  greet: () => 'Hello',
}
```

```js
// before
module.exports = to_export

// after
export default to_export
```

Just `exports.<id>`:

```js
// before
exports.data = some_value

// after
export let data = some_value
// or with const if data is immutable
export const data = some_value
```

This also works with named functions:

```js
// before
exports.todo = function () { ... }
exports.todoAsync = async function () { ... }

// after
export function todo() { ... }
export async function todoAsync() { ... }
```

> Read more at
> [MDN export statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).

### Dynamic import

`import` statement does not allow you to use it in non-top-level, in functions
or some scopes, likes `require()` does.

```js
// before
function load() {
  const utils = require('./utils')
}
```

Do it with async context:

```js
// after
async function load() {
  const utils = await import('./utils')
}
```

Or with Promise's `.then` callback:

```js
// after
function load() {
  import('./utils').then((module) => {
    const utils = module.default
    // ...
  })
}
```

In this case above, `import` becomes an async function like. You can also add a
`.catch` chain to catch module errors.

> Read more at
> [MDN import() operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).
> Please note that you no need to add the `.js` extension to import path.

### JSON and CSS modules

You should refer to the [Module System](/guide/module-system) to handle
importing them.
