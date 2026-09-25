<!-- PROTOTYPE (throwaway, branch prototype/landing): three art directions for the home page,
     switchable with ?variant=A|B|C and the floating bar. -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import './fonts.css'
import PrototypeSwitcher from './PrototypeSwitcher.vue'
import VariantA from './VariantA.vue'
import VariantB from './VariantB.vue'
import VariantC from './VariantC.vue'

const variants = [
  { key: 'A', name: "Summoner's Rift at night" },
  { key: 'B', name: 'Raycast clean' },
  { key: 'C', name: 'Ice' },
]
const current = ref('A')

onMounted(() => {
  const v = new URLSearchParams(location.search).get('variant')?.toUpperCase()
  if (v && variants.some(x => x.key === v)) current.value = v
})

function change(key: string) {
  current.value = key
  const url = new URL(location.href)
  url.searchParams.set('variant', key)
  history.replaceState(history.state, '', url)
  window.scrollTo({ top: 0 })
}
</script>

<template>
  <VariantA v-if="current === 'A'" />
  <VariantB v-else-if="current === 'B'" />
  <VariantC v-else />
  <PrototypeSwitcher :variants="variants" :current="current" @change="change" />
</template>
