# LCU Socket observation

This namespace helps you to observe specific LCU APIs without creating a new WebSocket.
You cannot get it directly from `window`, instead use the context of the [`init` entry point](../guide/javascript-plugin#plugin-entry-points).

## socket.observe(api, listener)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

```ts
function observe(
  api: string,
  listener: ApiListener
): { disconnect: () => void }

interface EventData {
  data: any
  uri: string
  eventType: 'Create' | 'Update' | 'Delete'
}

interface ApiListener {
  (message: EventData): void
}
```

Subscribe a listener to listen when the given API endpoint get called.

### Params:

- `api` a string that presents a LCU API endpoint.
- `listener` a function that gets called with one data param.

### Return value:

An object with a prop `disconnect` that could be called to disconnect the observer.

Example:

```js
socket.observe('/lol-matchmaking/v1/ready-check', (data) => {
  doAcceptReadyCheck()
})
```

## socket.disconnect(api, listener)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

```ts
function disconnect(api: string, listener: ApiListener)
```

Disconnect a subscribed listener. The function parameters like the function above.