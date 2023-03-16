# CSS Theme

A plugin is considered a **theme** if it aims to to change the default style of
the League Client, rather than creating helpers for the Client.

## Creating a theme

From your plugin entry, use `import` to add it:

```javascript
import './theme.css'
```

This line will append a link tag to body pointing to `theme.css` next to your
`index.js` .

```
your-plugin/
  |__index.js       <- plugin entry
  |__theme.css      <- your theme
```

### Changing the default font

The following will import a custom font from
[Google Fonts](https://fonts.google.com/) and override the default font using
the `:root` selector and CSS variables.

```css
/* theme.css */
@import url('https://fonts.googleapis.com/css2?family=Shantell+Sans&display=swap');

:root {
  /* override default League font */
  --font-display: 'Shantell Sans', sans-serif !important;
  --font-body: 'Shantell Sans', sans-serif !important;
}
```

Note that some selectors may no be applied due to the priority, you can force
them on top of the rules with the `!important` suffix.

To get more CSS variables used by the Client, you should inpsect them using the
Chrome DevTools. Try hitting the `Ctrl Shift I` key to open it.

## CSS module

When you **import** the theme, your theme becomes a module. Now you can use the
relative path of `url()` to import assets.

```css
/* theme.css */
.some-div {
  background-image: url(./assets/background.png);
}

.another-div {
  background-image: url(./assets/some-image.jpg);
}
```

The corresponding plugin structure:

```
your-plugin/
  |__assets/
    |__background.png
    |__some-image.jpg
  |__theme.css
```

## Remote theme

Using remote theme keeps your theme up to date.

The following will inject a stylesheet link tag pointing to your theme from
https://example.com/theme.css

```javascript
// index.js
function addCssLink(url) {
  const link = document.createElement('link')
  link.href = url
  link.type = 'text/css'
  link.rel = 'stylesheet'
  document.head.appendChild(link)
}

window.addEventListener('load', () => {
  addCssLink('https://example.com/theme.css')
})
```

::: info

Your server should respond with MIME type `text/css` .

:::
