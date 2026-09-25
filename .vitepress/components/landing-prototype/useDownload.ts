// PROTOTYPE (throwaway): the OS-detected primary download, same logic as Download.vue.
import { computed, onMounted, ref } from 'vue'
import { detectMacArch, getPlatform, Platform, type MacArch } from '../../lib/utils'
import { getRelease, type Release } from '../../lib/gh-utils'

export function useDownload() {
  const platform = ref<Platform | null>(null)
  const macArch = ref<MacArch>('arm64')
  const release = ref<Release | null>()
  const mobile = ref(false)

  onMounted(async () => {
    const ua = navigator.userAgent
    mobile.value = /android|iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
    if (mobile.value || !/windows|macintosh|mac os/i.test(ua)) return
    platform.value = getPlatform(ua)
    if (platform.value === Platform.MacOS) macArch.value = await detectMacArch()
    release.value = await getRelease()
  })

  const href = computed(() => {
    if (!platform.value) return '/download'
    const list = release.value?.downloads[platform.value]
    if (!list?.length) return '/download'
    const pick = platform.value === Platform.MacOS
      ? list.find(a => a.arch === macArch.value) ?? list[0]
      : list.find(a => /\.(exe|msi)$/i.test(a.fileName)) ?? list[0]
    return pick.url
  })

  const label = computed(() => !platform.value ? 'View downloads' : platform.value === Platform.MacOS ? 'Download for macOS' : 'Download for Windows')

  return { href, label, mobile }
}
