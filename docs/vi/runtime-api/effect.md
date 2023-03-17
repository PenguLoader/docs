# `Effect` <Badge type="tip" text="since v1.0" />

Namespace này hỗ trợ thay đổi hiệu ứng cửa sổ.<br>

Các hiệu ứng có sẵn: `mica`, `acrylic`, `unified` và `blurbehind`.

![](https://user-images.githubusercontent.com/38210249/216951830-b3bb3ce3-7a5f-4e60-8a67-33d0bce799cf.png)

## `Effect.current`

Một thuộc tính read-only trả về hiệu ứng hiện tại đang được xác định hoặc trả về `undefined` nếu không có hiệu ứng nào đang được áp dụng.

Vĩ dụ:

```js
// in ra màn hình hiệu ứng đang được áp dụng
console.log(Effect.current)
```

## `Effect.apply(name, options?)`

Một hàm lấy tên của một hiệu ứng mong muốn và một tùy chọn.<br> Nó trả về một giá trị boolean cho biết liệu hiệu ứng có được áp dụng thành công hay không.

- `name` [bắt buộc] Tên các hiệu ứng bên trên để áp dụng, dưới dạng chuỗi.

- `options` [bắt buộc] Tùy chọn thêm cho hiệu ứng, `acrylic`, `unified`
  và `blurbehind` có thể có thêm một tông màu, riêng `mica` sẽ không có tùy chọn này.

Hàm này trả về `false` nếu không thể áp dụng hiệu ứng, hãy xem
[Khả năng tương thích hệ thống](#system-compatibility) bên dưới.

Ví dụ:

```js
// bật acrylic trên Windows 10
Effect.apply('acrylic')

// với một tông màu
Effect.apply('unified', { color: '#4446' })

// mica trên windows 11, không có tùy chọn thêm
Effect.apply('mica')
```

::: info

Màu phải ở định dạng CSS hex color, ví dụ. #RGB, #RGBA, #RRGGBB,
#RRGGBBAA.

:::

![](https://user-images.githubusercontent.com/38210249/216951865-bb9c6676-58ec-4c81-ad96-67e94e91ac22.png)

### Khả năng tương thích hệ thống

<!-- - These effects are currently supported only Windows 7+. -->

- Trên Windows 7, chỉ hỗ trợ `blurbehind`.
- Trên Windows 10, yêu cầu bản 1703 trở lên để sử dụng `acrylic`.
- `mica` và `unified` chỉ được hỗ trợ trên Windows 11, nhưng `unified` thì có thể
   được kích hoạt trên Windows 10 nhưng sẽ không khác gì so với `acrylic`.

::: warning

Trên Windows 10 bản **1903** (19H1) trở lên, áp dụng `acrylic/mica/unified` với
**Transparency effects** (trong Personalize -> Color settings) sẽ bị lag khi
di chuyển cửa sổ Client.

:::

## `Effect.clear()`

Một hàm sẽ xóa toàn bộ hiệu ứng đang được áp dụng, sau đó nền Client sẽ thành màu đen.<br> Sử dụng `Effect.current` sau khi xóa sẽ trả về
`undefined`.

Ví dụ:

```js
// chỉ cần xóa hiệu ứng được áp dụng, kể cả khi không áp dụng hiệu ứng gì
Effect.clear()
```

## `Effect.on(event, callback)`

Thêm một listener sẽ được kích hoạt khi hiệu ứng được thay đổi.

```js
Effect.on('apply', ({ old, name, options }) => {
  // do something
})

Effect.on('clear', () => {
  // do something
})
```

## `Effect.off(event, callback)`

Xóa listener đã thêm của bạn.
