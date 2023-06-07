# Module System

Plugin module system is actually the
[JavaScript module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
(also known as ES module).

## JS module

As you know, the plugin entry is a single `index.js` file, using multiple files
makes your code easier to manage.

The following will have two files, `index.js` and `utils.js.` The **index** will
acquire the **utils** and print out the retrieved value.

```
your-plugin/
  |__index.js
  |__utils.js
```

::: code-group

```js [index.js]
// import utils.js using the import statement
import utils from './utils'

console.log(utils.greeting) // -> hello
```

```ts [utils.js]
// export a simple object
export default {
  gretting: 'Hello'
}
```

:::

### `import`

> Read more at
> [MDN import statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).
> Please note that you no need to add the `.js` extension to import path.

### `export`

> Read more at
> [MDN export statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).

### Dynamic import

The `import` statement is designed to be used in top-level of code. So you
cannot use it inside functions or some scopes. Dynamic import allows you to load
your modules dynamically, even inside a function or scope.

```js
async function load() {
  const mod = await import('./mod')
  // do something
}
```

> Read more at
> [MDN import() operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).
> Please note that you no need to add the `.js` extension to import path.

### CDN import

For example, importing **axios** from [**Skypack**](https://skypack.dev).

```js
import axios from 'https://cdn.skypack.dev/axios'

async function testRequest() {
  const res = await axios.get('https://...')
  console.log(res.data)
}
```

::: info

Some libraries are designed only for NodeJS, they cannot be imported into the
plugins.

:::

::: tip Recommended CDNs

- [Skypack](https://www.skypack.dev/)
- [ESM>CDN](https://esm.sh/)
- [jsDelivr ESM](https://esm.run)
- [UNPKG](https://unpkg.com/)

:::

Using dynamic import will be useful when the CDN connection is slow.

```js
import('https://cdn.skypack.dev/axios')
  .then(async (mod) => {
    const axios = mod.default
    // make a request
  })
  .catch((err) => {
    // handle error
  })
```

## CSS module

```js
import './theme.css'
```

This line will inject a `link` tag into `body` to load your `theme.css`. It's
equivalent to the legacy way:

```js
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = '//plugins/your-plugin/theme.css'
document.body.appendChild(link)
```

In your CSS module, you can import plugin assets using relative path:

```css
.some-div {
  background-image: url(./assets/image.png);
  /* resolve to //plugins/your-plugin/assets/image.png */ 
}
```

## JSON module

Assuming your `config.json` like this:

```json
{
  "enabled": true
}
```

Let's import it:

```js
import config from './config.json'
console.log(config.enabled) // true
```

You can also change its value, but no change to the JSON file.

```js
config.enabled = false
// in other modules that require it
console.log(config.enabled) // false
```

## TOML and YAML module

Since v1.0.6, TOML and YAML formats are supported. They are easy to read and
solve the JSON brackets hell, as well as the trailing comma problem.

```js
import config from './config.toml'
console.log('test toml', config)
```

In the YAML format, both .yaml and .yml file extensions are legal.

```js
import config from './config.yaml'
import config2 from './config2.yml'
```

> Note that the third-party parsers are imported via esm.sh CDN, some restrcited
> regions may not work. Please report it.

## Importing assets

For updating HTML elements from JS, you can use `import` to get the asset path
without knowing its full path.

```
your-plugin/
  |__assets/
    |__background.jpg
  |__index.js

background URL: //plugins/your-plugin/assets/background.jpg
```

Here is the example code:

```js
import background from './assets/background.jpg'

function changeBackground() {
  const div = document.querySelector('some-div')
  div.style.backgroundImage = `url(${background})`
  // or with <img>'s src attribute
  myImg.src = background
}
```

You can log the `background` to see its value:

```js
console.log(background)
```

With the structure above, you got
`//plugins/your-plugin/assets/my-background.jpg`.

::: info

Note that asset import supports common image, font and media file types. Other
unsupported types won't work; you'll need to add the `?url` suffix in the next
section to get their path.

:::

## Explicit import

You can specific a suffix value as query param to the import URL.

```js
import content from './my-data.txt?raw'
// read the file as string

import path from './some-resource?url'
// get path to the asset
```

:::info

With `?raw`, your file should be saved in UTF-8 encoding.

:::
