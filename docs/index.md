---
layout: page
title: Pengu Loader
titleTemplate: Pengu Loader
editLink: false
lastUpdated: false
---

<script setup>
  import Landing from '@components/Landing.vue'
</script>

<Landing>
<template #lcu>

```js
const res = await fetch('/lol-summoner/v1/current-summoner')
const me = await res.json()
```

</template>
<template #plugin>

```js
// plugins/hello/index.js
export function load() {
  console.log('Hello, League Client!')
}
```

</template>
</Landing>
