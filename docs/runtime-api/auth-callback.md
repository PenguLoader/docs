# ~~AuthCallback~~

<Badge type="danger" text="removed in v1.0.6" />

This namespace helps you to create a callback URL and read its response from an
auth flow.

## ~~AuthCallback.createURL~~

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.0.1" />
<Badge type="danger" text="removed in v1.0.6" />

Create a unique callback URL that can be used for auth callback/redirect from
external web browsers.

## ~~AuthCallback.readResponse~~

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.0.1" />
<Badge type="danger" text="removed in v1.0.6" />

This function wait for response from a given callback URL. It returns a
`Promise` for async context, contains string if success or null when timeout.

Parameters:

- `url` - Callback URL created by `AuthCallback.createURL()`.
- `timeout` - Optional timeout in milliseconds, default is 180s.

Callback URL supports **GET** request only, the response of this function could
be search params fullfilled by auth flow.

Example:

```js
async function requestUserAuth() {
  const callbackURL = AuthCallback.createURL()
  const requestAuth = 'https://.../?redirect_uri=' +
    encodeURIComponent(callbackURL)
  // Open in web browser
  window.open(callbackURL)

  const response = await AuthCallback.readResponse(callbackURL)
  if (response === null) {
    console.log('timeout/fail')
  } else {
    console.log(response)
  }

  // Should show UX to get back focus
  fetch('/riotclient/ux-show', { method: 'POST' })
}
```

See [spotify-gateway](https://github.com/LeagueLoader/spotify-gateway) example
to learn more.
