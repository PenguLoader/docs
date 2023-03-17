# Migrate từ phiên bản v0.6

## Cấu trúc project plugin mới

<Badge type="tip" text="^1.0" />

Kể từ phiên bản 0.5, chúng tôi đã giới thiệu miền `//assets/` hỗ trợ truy cập vào
tài nguyên từ thư mục **assets**. Và bây giờ, thư mục này chỉ được sử dụng cho
tài nguyên lớn, chung hoặc độc nhất. Vì vậy, mọi plugin sẽ có assets của nó và bạn có thể
truy cập chúng qua `//plugins/`.

Kể từ phiên bản 1.0, top-level `js` không được thực thi dưới dạng plugin entry point. Ngừng việc
đặt các tệp JS plugin của bạn trực tiếp vào thư mục **plugins**. Bạn cần phải
tạo một thư mục mới cho plugin của bạn.

```
plugins/
  |__your-plugin/
    |__assets/
      |...         <- tài nguyên
    |__index.js    <- plugin entry
    |...           <- các utils
```

## Xóa CommonJS

<Badge type="tip" text="^1.0" />

Trong v1.0, chúng tôi đã loại bỏ hỗ trợ CommonJS và chuyển sang mô-đun ES. Cái này
có nghĩa là tất cả các tập lệnh từ v0.6 sử dụng `require` và `module.exports` sẽ không
hoạt động trong phiên bản mới.

Vui lòng tham khảo hướng dẫn migrate bên dưới.

### Cập nhật hàm `require()` của bạn:

```js
// trước
const utils = require('./utils')

// sau
import utils from './utils'
```

```js
// trước
const { hello } = require('./greeting')

// sau
import { hello } from './greeting'
```

> Đọc thêm tại
> [MDN import statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).
> Hãy chú ý rằng bạn không cần thêm đuôi `.js` vào đường dẫn import.

### Đồng thời cập nhật `module.exports` của bạn:

```js
// trước
module.exports = {
  greet: () => 'Hello',
}

// sau
export default {
  greet: () => 'Hello',
}
```

```js
// trước
module.exports = to_export

// sau
export default to_export
```

Chỉ việc `exports.<id>`:

```js
// trước
exports.data = some_value

// sau
export let data = some_value
// hoặc với const nếu dữ liệu là bất biến
export const data = some_value
```

Điều này cũng hoạt động với các hàm được đặt tên:

```js
// trước
exports.todo = function () { ... }
exports.todoAsync = async function () { ... }

// sau
export function todo() { ... }
export async function todoAsync() { ... }
```

> Đọc thêm tại
> [MDN export statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).

### Import động

Câu lệnh `import` không cho phép bạn sử dụng nó ở mức non-top-level, trong các hàm
hoặc một số scope, chẳng hạn như `require()`.

```js
// trước
function load() {
  const utils = require('./utils')
}
```

Làm nó với async context:

```js
// sau
async function load() {
  const utils = await import('./utils')
}
```

Hoặc với `.then` của Promise callback:

```js
// sau
function load() {
  import('./utils').then((module) => {
    const utils = module.default
    // ...
  })
}
```

Trong trường hợp ở trên, `import` trở thành một async function. Bạn cũng có thể thêm một
chuỗi `.catch` để bắt lỗi mô-đun.

> Đọc thêm tại
> [MDN import() operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).
> Hãy chú ý rằng bạn không cần thêm đuôi `.js` vào đường dẫn import.

### Mô-đun JSON và CSS

Bạn nên tham khảo [Hệ thống mô-đun](/vi/guide/module-system) để xử lý
việc import chúng.
