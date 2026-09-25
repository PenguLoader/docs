// PROTOTYPE (throwaway): GSAP + ScrollTrigger scoped to one variant, skipped under reduced motion.
import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export function useMotion(root: Ref<HTMLElement | undefined>, setup: (gsap: any, ScrollTrigger: any, el: HTMLElement) => void) {
  let ctx: any
  let disposed = false
  onMounted(async () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value) return
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    if (disposed || !root.value) return
    gsap.registerPlugin(ScrollTrigger)
    ctx = gsap.context(() => setup(gsap, ScrollTrigger, root.value!), root.value)
  })
  onBeforeUnmount(() => { disposed = true; ctx?.revert() })
}
