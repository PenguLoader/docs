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

## CSS module

## Remote theme

To use remote theme, e.g from <https://example.com/theme.css>

```javascript
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
