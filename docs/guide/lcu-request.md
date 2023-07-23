# LCU Request

## Making API request

Just use `fetch` to make LCU requests:

```js
function acceptMatchFound() {
  fetch('/lol-matchmaking/v1/ready-check/accept', {
    method: 'POST',
  })
}
```

Note that `fetch` returns a Promise for async context, you should wrap it inside
an async function.

```js
async function getSummonerName() {
  const res = await fetch('/lol-summoner/v1/current-summoner')
  const data = await res.json()
  return data['displayName']
}
```

With LCDS (RTMP) calls, you can use `URLSearchParams` and `JSON.strigify` to
construct call parameters.

```js
async function quitLobby() { // dont know why people call it 'dodge'
  const params = new URLSearchParams({
    destination: 'lcdsServiceProxy',
    method: 'call',
    args: JSON.stringify(['', 'teambuilder-draft', 'quitV2', '']),
  })
  const url = '/lol-login/v1/session/invoke?' + params.toString()
  await fetch(url, { method: 'POST' })
}
```

::: details LCU API docs

- https://lcu.kebs.dev
- http://www.mingweisamuel.com/lcu-schema/tool/#/

:::

## LCU WebSocket

When the WebSocket is ready, this link tag will appear:

```html
<link rel="riot:plugins:websocket" href="wss://riot:.../">
```

Getting its URI with a simple query.

```js
document.querySelector('link[rel="riot:plugins:websocket"]').href
```

Here is an example that subscribes to all API calls:

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

Listening a single API call, e.g `/lol-gameflow/v1/gameflow-phase`.

```js
const TARGET_API = '/lol-gameflow/v1/gameflow-phase'
const TARGET_EVENT = TARGET_API.replace(/\//g, '_')
// OnJsonApiEvent_lol-gameflow_v1_gameflow-phase

socket.send(JSON.stringify([5, 'OnJsonApiEvent' + TARGET_EVENT]))
```

Send `6` to unsubscribe from a specific API call, or `OnJsonApiEvent` for all.

```js
socket.send(JSON.stringify([6, '<EventName>']))
```

## Unauthenticated issue

In some cases that the Ux loads faster than the LCU server, many API that
require authentication will result in wrong value. You need to wait for this to
be done before you start plugin initialization.

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

You can do it with the WebSocket way.

:::

## RiotClient API

We provided a `riotclient` domain which helps you to make request to RiotClient
API.

```
//riotclient/<api>
https://riotclient/<api>
```

For example:

```js
function getAuthStatus() {
  return fetch('//riotclient/app-command/v1/auth/status')
    .then((res) => res.json())
}
```

::: details RiotClient API docs

- https://riotclient.kebs.dev
- https://riotclient.nomi.dev

:::
