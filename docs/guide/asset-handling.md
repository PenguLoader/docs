# Asset Handling

Assets can be other resources such as fonts, images, media, etc. that you use
from your plugin to load custom content.

## Local assets

### Plugin assets

Each plugin should have its own assets folder to store assets.

For example, with the plugin structure below:

```
plugins/
  |__your-plugin/
    |__assets/            <- assets
      |__background.png
      |...
    |__index.js           <- entry
    |__theme.css          <- theme
```

If your plugin folder name is unique and will not change in the future, you can
use this link to access the `background.png` directly:

```
//plugins/your-plugin/assets/background.png
```

We recommend that you use the module system instead.

::: code-group

```js [index.js]
import background from './assets/background.png'

// usage
const img = document.getElementById('some-img')
img.src = background
```

```css [theme.css]
/* note that you should
import this theme.css from your index.js */

.some-div {
  background-image: url('./assets/background.png');
}
```

:::

### Common assets

Since v0.5, we have provided access to local assets via the `//assets/` domain.

Example:

```
loader/
  |__assets/
    |__your-image.png
    |__your-background.mp4
    |...
  |__plugins/
    |...
```

```html
<img src="//assets/your-image.png" />
<video src="//assets/your-background.mp4"></video>
```

## Remote assets

### GitHub file hosting

If you prefer to host your assets on GitHub, you should use the **RawGitHack**
CDN to avoid access restrictions. It also supports GitLab and Bitbucket.

Try it now: https://raw.githack.com/

![](/guide/rawgithack.png)

### Imgur image hosting

Imgur is a great free image hosting service. You can upload your images to the
Imgur site and retrieve the link.

Try it now: https://imgur.com/

## Optimizing your resources

You should reduce the asset size to optimize your plugin load time.

- JavaScript and CSS code should be minified for production
- For SVGs, you can use https://github.com/svg/svgo
- With images, you should convert them to **webp** format
- With video, you can try to convert to **webm** format
