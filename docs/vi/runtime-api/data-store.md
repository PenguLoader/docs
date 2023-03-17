# `DataStore` <Badge type="tip" text="since v1.0" />

League Client không lưu trữ dữ liệu người dùng trên ổ cứng, tương tự như chế độ ẩn danh trên trình duyệt web. Namespace này giúp bạn lưu dữ liệu người dùng trên ổ cứng.

## `DataStore.set(key, value)`

Gọi hàm này để lưu trữ dữ liệu của bạn với một key đã cho.

- `key` (bắt buộc) Các key phải là chuỗi hoặc số.
- `value` (bắt buộc) Giá trị có thể là chuỗi, số, boolean, null hoặc gồm nhiều giá trị như mảng và đối tượng. Trên thực tế, nó sẽ được lưu trữ dưới dạng định dạng JSON, vì vậy bất kỳ giá trị như hàm và runtime object bị bỏ qua.

Ví dụ:

```js
let my_num = 10
let my_str = 'hello'
DataStore.set('my_num', my_num)
DataStore.set('my_str', my_str)
```

::: tip

Bạn nên sử dụng một tên riêng biệt cho key, đừng sử dụng các tên phổ thông, ví dụ
`access_token`, `is_logged`, v.v. Các plugin khác có thể sẽ ghi đè dữ liệu của bạn, bạn cũng có thể thêm tiền tố cho key của mình.

:::

## `DataStore.get(key)`

Truy xuất dữ liệu được lưu trữ của bạn bằng một key đã cho. Nếu key không tồn tại, nó sẽ trả về `undefined`.

Ví dụ:

```js
console.log(DataStore.get('my_str'))
console.log(DataStore.get('key-does-not-exist')) // undefined
```

## `DataStore.has(key)`

Hàm này trả về một giá trị boolean cho biết liệu dữ liệu có key được chỉ định
có tồn tại hay không.

```js
console.log(DataStore.has('my_num'))
console.log(DataStore.has('key-does-not-exist'))
```

## `DataStore.remove(key)`

Hàm này xóa dữ liệu đã chỉ định khỏi bộ nhớ theo key, trả về true nếu
cặp key-value hiện tại đã bị xóa.

Ví dụ:

```js
DataStore.remove('some-key')
DataStore.has('some-key') // -> false
```
