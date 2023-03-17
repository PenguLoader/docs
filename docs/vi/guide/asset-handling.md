# Xử lí asset

Asset có thể là các tài nguyên khác nhau như phông chữ, hình ảnh, file phương tiện, v.v. mà bạn sử dụng
từ plugin của bạn để tải nội dung tùy chỉnh.

## Local assets

### Plugin assets

Mỗi plugin nên có thư mục nội dung riêng để lưu assets.

Ví dụ với cấu trúc plugin bên dưới:

```
plugins/
  |__your-plugin/
    |__assets/            <- assets
      |__background.png
      |...
    |__index.js           <- entry
    |__theme.css          <- theme
```

Nếu tên thư mục plugin của bạn cố định và sẽ không thay đổi trong tương lai, bạn có thể
sử dụng liên kết này để truy xuất trực tiếp `background.png`:

```
//plugins/your-plugin/assets/background.png
```

Chúng tôi khuyên bạn nên sử dụng hệ thống mô-đun để thay thế.

::: code-group

```js [index.js]
import background from './assets/background.png'

// cách sử dụng
const img = document.getElementById('some-img')
img.src = background
```

```css [theme.css]
/* lưu ý rằng bạn nên
import theme.css này từ index.js của bạn */

.some-div {
  background-image: url('./assets/background.png');
}
```

:::

### Common assets

Kể từ phiên bản 0.5, chúng tôi đã cung cấp quyền truy cập vào local assets thông qua miền `//assets/`.

Ví dụ:

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

Nếu bạn muốn lưu trữ assets của mình trên GitHub, bạn nên sử dụng CDN RawGitHack để tránh bị hạn chế quyền truy cập. Nó cũng hỗ trợ GitLab và Bitbucket.

Thử ngay: https://raw.githack.com/

![](/guide/rawgithack.png)

### Imgur image hosting

Imgur là một dịch vụ lưu trữ hình ảnh miễn phí tuyệt vời. Bạn có thể tải hình ảnh của mình lên
Trang web Imgur và lấy liên kết.

Thử ngay: https://imgur.com/

## Tối ưu hóa tài nguyên của bạn

Bạn nên giảm kích thước asset để tối ưu hóa thời gian tải plugin của mình.

- Code JavaScript và CSS nên được minified cho production
- Đối với SVG, bạn có thể sử dụng https://github.com/svg/svgo
- Với hình ảnh, bạn nên convert sang định dạng **webp**
- Với video, bạn có thể thử convert sang định dạng **webm**
