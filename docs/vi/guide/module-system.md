# Hệ thống mô-đun

Hệ thống mô-đun của plugin thực sự là các
[Mô-đun JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
(còn được gọi là mô-đun ES).

## Mô-đun JS

Như bạn đã biết, mục plugin là một tệp `index.js` duy nhất, sử dụng nhiều tệp
làm cho code của bạn dễ quản lý hơn.

Sau đây sẽ có hai tệp, `index.js` và `utils.js.` **index** sẽ
lấy **utils** và in ra giá trị đã truy xuất.

```
your-plugin/
  |__index.js
  |__utils.js
```

::: code-group

```js [index.js]
// nhập utils.js bằng câu lệnh nhập
import utils from './utils'

console.log(utils.greeting) // -> hello
```

```ts [utils.js]
// xuất một đối tượng đơn giản
export default {
  gretting: 'Hello'
}
```

:::

### `import`

> Đọc thêm tại
> [MDN import statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).
> Hãy chú ý rằng bạn không cần thêm đuôi `.js` vào đường dẫn import

### `export`

> Đọc thêm tại
> [MDN export statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).

### Import động

Câu lệnh `import` được thiết kế để sử dụng ở bậc cao nhất của code. Vì vậy, bạn
không thể sử dụng nó bên trong các function hoặc một số phạm vi (scope). Import động cho phép bạn load
các mô-đun của bạn một cách linh hoạt, ngay cả bên trong một function hoặc scope.

```js
async function load() {
  const mod = await import('./mod')
  // do something
}
```

> Đọc thêm tại
> [MDN import() operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).
> Hãy chú ý rằng bạn không cần thêm đuôi `.js` vào đường dẫn import

### Import CDN

Ví dụ, import **axios** của [**Skypack**](https://skypack.dev).

```js
import axios from 'https://cdn.skypack.dev/axios'

async function testRequest() {
  const res = await axios.get('https://...')
  console.log(res.data)
}
```

::: info

Một số thư viện được thiết kế chỉ dành riêng cho NodeJS, chúng không thể được import vào
plugin.

:::

::: tip Các CDN mình đề xuất

- [Skypack](https://www.skypack.dev/)
- [ESM>CDN](https://esm.sh/)
- [jsDelivr ESM](https://esm.run)
- [UNPKG](https://unpkg.com/)

:::

Sử dụng import động sẽ hữu ích khi kết nối CDN chậm.

```js
import('https://cdn.skypack.dev/axios')
  .then(async (mod) => {
    const axios = mod.default
    // tạo một request
  })
  .catch((err) => {
    // xử lí lỗi
  })
```

## Mô-đun CSS

```js
import './theme.css'
```

Dòng này sẽ đưa thẻ `link` vào `body` để load `theme.css` của bạn. Nó tương tự như cách sau:

```js
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = '//plugins/your-plugin/theme.css'
document.body.appendChild(link)
```

Trong mô-đun CSS của mình, bạn có thể import tài nguyên plugin bằng đường dẫn:

```css
.some-div {
  background-image: url(./assets/image.png);
  /* nó sẽ hiểu là //plugins/your-plugin/assets/image.png */ 
}
```

## Mô-đun JSON

Giả sử `config.json` của bạn như thế này:

```json
{
  "enabled": true
}
```

Hãy import nó:

```js
import config from './config.json'
console.log(config.enabled) // true
```

Bạn cũng có thể thay đổi giá trị của nó, nhưng nó sẽ không thay đổi trong file JSON.

```js
config.enabled = false
// trong các mô-đun khác require nó
console.log(config.enabled) // false
```

## Import assets

Để cập nhật các phần tử HTML từ JS, bạn có thể sử dụng `import` để lấy đường dẫn asset
mà không cần biết đường dẫn đầy đủ của nó.

```
your-plugin/
  |__assets/
    |__background.jpg
  |__index.js

background URL: //plugins/your-plugin/assets/background.jpg
```

Đây là code ví dụ:

```js
import background from './assets/background.jpg'

function changeBackground() {
  const div = document.querySelector('some-div')
  div.style.backgroundImage = `url(${background})`
  // or with <img>'s src attribute
  myImg.src = background
}
```

Bạn có thể console.log `background` để xem giá trị của nó:

```js
console.log(background)
```

Với cấu trúc trên, bạn có
`//plugins/your-plugin/assets/my-background.jpg`.

::: info

Lưu ý rằng tính năng import asset hỗ trợ các loại tệp hình ảnh, phông chữ và các file phương tiện phổ biến. Các loại không được hỗ trợ khác sẽ không hoạt động; bạn sẽ cần thêm hậu tố `?url` bên cạnh để có được đường dẫn của nó.

:::

## Explicit import

Bạn có thể chỉ định một giá trị hậu tố làm thông số truy vấn cho URL import.

```js
import content from './my-data.txt?raw'
// đọc tệp dưới dạng string

import path from './some-resource?url'
// lấy đường dẫn tới asset
```

:::info

Với `?raw`, tệp của bạn nên được lưu dưới dạng mã hóa UTF-8.

:::
