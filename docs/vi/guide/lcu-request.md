# LCU Request

## Tạo API request

Sử dụng `fetch` để thực hiện các request tới LCU:

```js
function acceptMatchFound() {
  fetch('/lol-matchmaking/v1/ready-check/accept', {
    method: 'POST',
  })
}
```

Lưu ý rằng `fetch` trả về một Promise cho async context, bạn nên bọc nó bên trong
một async function.

```js
async function getSummonerName() {
  const res = await fetch('/lol-summoner/v1/current-summoner')
  const data = await res.json()
  return data['displayName']
}
```

Với lệnh gọi LCDS (RTMP), bạn có thể sử dụng `URLSearchParams` và `JSON.stringify` để
xây dựng tham số gọi.

```js
async function quitLobby() { // k hiểu tại sao người ta hay gọi là 'né'
  const params = new URLSearchParams({
    destination: 'lcdsServiceProxy',
    method: 'call',
    args: JSON.stringify(['', 'teambuilder-draft', 'quitV2', '']),
  })
  const url = '/lol-login/v1/session/invoke?' + params.toString()
  await fetch(url, { method: 'POST' })
}
```

::: details Tài liệu API LCU mới nhất

https://lcu.kebs.dev.

:::

## LCU WebSocket

Khi WebSocket đã sẵn sàng, thẻ link này sẽ xuất hiện:

```html
<link rel="riot:plugins:websocket" href="wss://riot:.../">
```

Lấy URI của nó bằng một truy vấn đơn giản.

```js
document.querySelector('link[rel="riot:plugins:websocket"]').href
```

Dưới đây là một ví dụ subscribe tất cả các lệnh gọi API:

```js
function subscribe() {
  const uri = document.querySelector('link[rel="riot:plugins:websocket"]').href
  const socket = new WebSocket(uri, 'wamp')

  socket.onopen = () => socket.send(JSON.stringify([5, 'OnJsonApiEvent']))
  socket.onmessage = async (message) => {
    const data = JSON.parse(message.data)
    console.log(data)
    // @todo process data
  }
}

window.addEventListener('load', () => {
  subscribe()
})
```

Nghe một lệnh gọi API, ví dụ: `/lol-gameflow/v1/gameflow-phase`.

```js
const TARGET_API = '/lol-gameflow/v1/gameflow-phase'
const TARGET_EVENT = TARGET_API.replace(/\//g, '_')
// OnJsonApiEvent_lol-gameflow_v1_gameflow-phase

socket.send(JSON.stringify([5, 'OnJsonApiEvent' + TARGET_EVENT]))
```

Gửi `6` để hủy subscribe một lệnh gọi API cụ thể hoặc `OnJsonApiEvent` cho tất cả.

```js
socket.send(JSON.stringify([6, '<EventName>']))
```

## Lỗi Unauthenticated

Trong một số trường hợp Ux tải nhanh hơn máy chủ LCU, nhiều API
yêu cầu authenticate sẽ dẫn đến giá trị sai. Bạn cần đợi cho đến khi
nó được thực hiện trước khi bạn initialize plugin.

```js
const delay = (t) => new Promise((r) => setTimeout(r, t))

async function init() {
  while (!await getSummonerName()) {
    await delay(500)
  }

  // continue
}

window.addEventListener('load', init)
```

::: tip

Bạn có thể làm điều đó bằng WebSocket.

:::

## RiotClient API

Chúng tôi đã cung cấp miền `riotclient` để giúp bạn gửi request tới RiotClient
API.

```
//riotclient/<api>
https://riotclient/<api>
```

Ví dụ:

```js
function getAuthStatus() {
  return fetch('//riotclient/app-command/v1/auth/status')
    .then((res) => res.json())
}
```

::: details Tài liệu RiotClient API mới nhất

https://riotclient.nomi.dev

:::
