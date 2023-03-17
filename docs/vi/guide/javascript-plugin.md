# JavaScript Plugin

Phát triển plugin yêu cầu kiến thức cơ bản về
[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) và
[CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) nếu bạn muốn tự tạo một
theme. Nó khá dễ dàng nếu bạn đã quen với lập trình web.

## Tạo một plugin

Giả sử tên plugin mới của bạn là `your-plugin`.

Trước tiên, bạn cần tạo một thư mục mới có tên `your-plugin` trong thư mục **plugins**
(bên trong thư mục gốc của Pengu Loader).

```
root/
  |__plugins/
    |__@default/        <- plugin mặc định
      |...
    |__your-plugin/     <- plugin mới của bạn
      |__index.js       <- các mục của plugin
```

Sau đó, tạo một tệp mới có tên `index.js` trong thư mục plugin của bạn. File index này là nơi bắt đầu cho plugin của bạn, sẽ được thực thi khi Client Liên Minh được
mở lên. Bây giờ bạn có thể mở nó trong bất kỳ trình chỉnh sửa văn bản nào và bắt đầu code.

::: tip

Chúng tôi khuyên bạn nên sử dụng các trình soạn thảo JavaScript hiện đại như
[Visual Studio Code](https://code.visualstudio.com/) để phát triển plugin của bạn, bởi vì
nó hỗ trợ intellisense, linter và tự động complete code.

:::

Tiếp theo, chỉ cần thêm dòng này vào file index và lưu nó.

```js
console.log('Hello, League Client!')
```

::: info

Tất cả các file code/văn bản của bạn phải được lưu ở dạng mã hóa UTF-8 (không BOM). Nếu không,
plugin của bạn sẽ không hoạt động như mong đợi.

:::

Sau đó bật Client Liên minh của bạn lên và khi Client đã sẵn sàng, hãy thử nhấn
Phím `Ctrl Shift I` để mở **Chrome DevTools**. Điều hướng đến tab **Console**
trong DevTools và kéo lên trên cùng, bạn sẽ thấy thông báo đầu ra.

```
Hello, League Client!
```

## Tiếp theo là?

🎉 Chúc mừng! Bạn đã hoàn thành phần hướng dẫn dành cho người mới bắt đầu. Hãy đọc tiếp các trang tiếp theo để buff thêm sức mạnh cho các plugin của bạn.

- [Module System](./module-system) - Tìm hiểu thêm về hệ thống mô-đun
- [CSS Theme](./css-theme) - Tạo 1 theme của bạn bằng CSS
- [Assets Handling](./asset-handling) - Thêm nội dung tùy chỉnh vào plugin của bạn
- [LCU Request](./lcu-request) - Một số hướng dẫn giúp bạn làm việc với LCU
- [Runtime API](/runtime-api/) - Các API tích hợp hữu ích để sử dụng trong plugin của bạn