# Toast

This namespace is used to push your toast notifications onto the League Client screen.

## Toast.success(message)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

```ts
function success(message: string): void
```

Push a simple notification with a success checkmark.

Params:

- `message` a string to be shown on the notification.

Example:

```ts
Toast.success('Welcome to my theme!')
```

## Toast.error(message)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

```ts
function error(message: string): void
```

Push a simple notification with a failure icon.

Params:

- `message` a string to be shown on the notification.

Example:

```ts
Toast.error('Oops! Something went wrong.')
```

## Toast.promise(promise, msg)

<Badge type="info" text="function" />
<Badge type="tip" text="since v1.1.0" />

```ts
function promise(promise: Promise<T>, msg: {
  loading: string
  success: string
  error: string
}): Promise<T>
```

Push a progress notification and wait for the given promise to complete.
This function returns the given promise that is helpful for then/catch chain.

Params:

- `promise` a promise that the progress waits for.
- `msg` an object with these properties:
  - `loading` a string message to be shown when the progress starts loading.
  - `success` a string to be shown when the promise is resolved.
  - `error` a string to be shown when the promise is rejected.

Example:

```ts
let myTask = new Promise((resolve, reject) => {
  // wait for 3s then fulfill randomly
  setTimeout(() => {
    if (Math.random() > 0.5)
      resolve(10)
    else
      reject()
  }, 3000)
})

Toast.promise(myTask, {
  loading: 'Working in progress...',
  success: 'Oh nice! 😎',
  error: 'OOps! 😥'
})
```