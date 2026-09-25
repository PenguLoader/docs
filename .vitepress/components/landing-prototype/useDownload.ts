// PROTOTYPE (throwaway): the OS-detected primary download, same logic as Download.vue.
import { computed, onMounted, ref } from 'vue'
import { detectMacArch, getPlatform, Platform, type MacArch } from '../../lib/utils'
import { getRelease, type Release } from '../../lib/gh-utils'

export function useDownload() {
  const platform = ref<Platform>(Platform.Windows)
  const macArch = ref<MacArch>('arm64')
  const release = ref<Release | null>()
  const mobile = ref(false)

  onMounted(async () => {
    mobile.value = /android|iphone|ipad|ipod/i.test(navigator.userAgent)
    platform.value = getPlatform(navigator.userAgent)
    if (platform.value === Platform.MacOS) macArch.value = await detectMacArch()
    release.value = await getRelease()
  })

  const href = computed(() => {
    const list = release.value?.downloads[platform.value]
    if (!list?.length) return '/download'
    const pick = platform.value === Platform.MacOS
      ? list.find(a => a.arch === macArch.value) ?? list[0]
      : list.find(a => /installer|setup/i.test(a.fileName)) ?? list[0]
    return pick.url
  })

  const label = computed(() => platform.value === Platform.MacOS ? 'Download for macOS' : 'Download for Windows')

  return { href, label, mobile }
}
