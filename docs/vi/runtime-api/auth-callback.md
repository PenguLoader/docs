# `AuthCallback` <Badge type="tip" text="since v1.0" />

Namespace này giúp bạn tạo một callback URL và đọc response của nó từ auth flow.

## `AuthCallback.createURL()`

Tạo một callback URL độc nhất có thể được sử dụng để callback/redirect auth từ
trình duyệt web bên ngoài.

## `AuthCallback.readResponse(url, timeout?)`

Hàm này sẽ đợi response từ một callback URL đã cho. Nó trả về một
`Promise` cho async context, gồm string nếu success hoặc null nếu timeout.

Tham số:

- `url` - Callback URL được tạo bởi `AuthCallback.createURL()`.
- `timeout` - Thời gian chờ tùy chọn tính bằng mili giây, mặc định là 180 giây.

Callback URL chỉ hỗ trợ **GET** request, response của function này có thể là tham số tìm kiếm được thực hiện bởi auth flow.

Ví dụ:

```js
async function requestUserAuth() {
  const callbackURL = AuthCallback.createURL()
  const requestAuth = 'https://.../?redirect_uri=' +
    encodeURIComponent(callbackURL)
  // Mở trong trình duyệt
  window.open(callbackURL)

  const response = await AuthCallback.readResponse(callbackURL)
  if (response === null) {
    console.log('timeout/fail')
  } else {
    console.log(response)
  }

  // sẽ show UX để focus
  fetch('/riotclient/ux-show', { method: 'POST' })
}
```

Tham khảo ví dụ [spotify-gateway](https://github.com/LeagueLoader/spotify-gateway) để xem thêm.
