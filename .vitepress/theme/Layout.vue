<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, provide } from 'vue'
// import { useMediumZoom } from './useMediumZoom'

const { isDark } = useData()

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

// guards against a second click while a transition is still running,
// which would abort the first one and leave a half-painted snapshot
let switching = false

provide('toggle-appearance', async ({ clientX: x, clientY: y }) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  if (switching) return
  switching = true

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  try {
    const transition = document.startViewTransition(async () => {
      isDark.value = !isDark.value
      await nextTick()
    })

    await transition.ready

    // Always reveal the *new* snapshot with an expanding circle, in both
    // directions. Animating the old snapshot instead (shrinking circle) breaks
    // the moment the animation's effect is removed: the clip-path reverts to
    // `none` and the full old snapshot repaints on top for a frame right before
    // the pseudo-elements are torn down -- that was the white flash on dark.
    // `fill: 'forwards'` keeps the final clip until the transition ends.
    document.documentElement.animate(
      { clipPath },
      {
        duration: 300,
        easing: 'ease-in',
        fill: 'forwards',
        pseudoElement: '::view-transition-new(root)'
      }
    )

    await transition.finished
  } catch {
    // a skipped/aborted transition rejects `ready`; the theme itself has
    // already flipped at that point, so there is nothing to recover
  } finally {
    switching = false
  }
})

// useMediumZoom()
</script>

<template>
  <DefaultTheme.Layout />
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

/* the outgoing snapshot is the static backdrop, the incoming one wipes over it */
::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 9999;
}
</style>