# CSS Theme

Một Plugin được coi là **theme** nếu nó nhằm mục đích thay đổi giao diện mặc định của
Client Liên Minh, thay vì tạo thêm tính năng giúp cho Client.

## Tạo một theme

Từ mục plugin của bạn, sử dụng `import` để thêm nó:

```javascript
import './theme.css'
```

Dòng này sẽ thêm một thẻ link vào body trỏ đến `theme.css` bên cạnh
`index.js` .

```
your-plugin/
  |__index.js       <- plugin entry
  |__theme.css      <- theme của bạn
```

### Thay đổi phông chữ mặc định

Đoạn css dưới đây sẽ nhập một phông chữ tùy chỉnh từ
[Google Fonts](https://fonts.google.com/) và ghi đè phông chữ mặc định bằng cách sử dụng
selector `:root` và các biến CSS.

```css
/* theme.css */
@import url('https://fonts.googleapis.com/css2?family=Shantell+Sans&display=swap');

:root {
  /* override default League font */
  --font-display: 'Shantell Sans', sans-serif !important;
  --font-body: 'Shantell Sans', sans-serif !important;
}
```

Lưu ý rằng một số selector có thể không được áp dụng do mức độ ưu tiên, bạn có thể buộc
chúng bằng cách thêm hậu tố `!important` ở đầu các quy tắc.

Để có thêm các biến CSS được sử dụng bởi Client, bạn nên kiểm tra chúng bằng Chrome DevTools. Hãy thử nhấn phím Ctrl Shift I để mở nó.

## Mô-đun CSS

Khi bạn **import** theme, theme của bạn sẽ trở thành một mô-đun. Bây giờ bạn có thể sử dụng
đường dẫn `url()` để import assets.

```css
/* theme.css */
.some-div {
  background-image: url(./assets/background.png);
}

.another-div {
  background-image: url(./assets/some-image.jpg);
}
```

Cấu trúc plugin tương ứng:

```
your-plugin/
  |__assets/
    |__background.png
    |__some-image.jpg
  |__theme.css
```

## Theme từ xa

Việc sử dụng theme từ xa sẽ giúp theme của bạn luôn được cập nhật.

Đoạn code dưới đây sẽ chèn thẻ link stylesheet trỏ đến theme của bạn từ
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

Máy chủ của bạn nên trả về response với kiểu MIME `text/css` .

:::
