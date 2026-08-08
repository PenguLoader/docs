<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { archLabel, detectMacArch, getPlatform, Platform, type MacArch } from '../lib/utils'
import { getRelease, type AssetInfo, type Release } from '../lib/gh-utils'

// resolved on mount, not in setup: this component is server-rendered, so
// reading the UA here would make the client pick a different tab than the
// prerendered HTML and trip a hydration mismatch
const platform = ref<Platform>(Platform.Windows)
const macArch = ref<MacArch>('arm64')
const release = ref<Release | undefined | null>()

// the one build the big button hands over, picked from the visitor's platform
// and (on macOS) their CPU architecture
const primaryDownload = computed<AssetInfo | undefined>(() => {
  const downloads = release.value?.downloads[platform.value]
  if (!downloads?.length) {
    return undefined
  }

  if (platform.value === Platform.MacOS) {
    return downloads.find(a => a.arch === macArch.value)
      ?? downloads.find(a => !a.arch)
      ?? downloads[0]
  }

  return downloads.find(a => /installer|setup/i.test(a.fileName)) ?? downloads[0]
})

// arch detection is a guess on Safari/Firefox, so always offer the other build
const otherMacBuilds = computed<AssetInfo[]>(() =>
  (release.value?.downloads[Platform.MacOS] ?? [])
    .filter(a => a.arch && a.arch !== primaryDownload.value?.arch)
)

const downloadLabel = computed(() =>
  platform.value === Platform.MacOS && primaryDownload.value?.arch
    ? `Download for ${archLabel(primaryDownload.value.arch)}`
    : 'Download Pengu Loader'
)

onMounted(async () => {
  platform.value = getPlatform(window.navigator.userAgent)
  if (platform.value === Platform.MacOS) {
    macArch.value = await detectMacArch()
  }

  release.value = await getRelease()
})
</script>

<template>
  <main class="w-full py-24">
    <div class="flex w-full flex-col items-center">
      <div class="flex flex-col max-w-4xl p-4 lg:w-[56rem]">
        <h1 class="text-4xl mb-8 font-bold">Download</h1>

        <div role="alert"
          class="relative w-full rounded-lg border p-4 [&amp;>svg~*]:pl-7 [&amp;>svg+div]:translate-y-[-3px] [&amp;>svg]:absolute [&amp;>svg]:left-4 [&amp;>svg]:top-4 [&amp;>svg]:text-foreground bg-blue-100 text-blue-800 border-blue-500 dark:bg-transparent dark:text-blue-300 my-4">
          <div class="absolute right-4 top-4"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24"
              height="24" fill="currentColor" class="remixicon accent-blue-500 h-5 w-5">
              <path
                d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z">
              </path>
            </svg></div>
          <h5 class="mb-1 font-medium leading-none tracking-tight">Info</h5>
          <div class="text-sm [&amp;_p]:leading-relaxed">Pengu Loader only restyles the League Client and never
            touches the game — but it is a third-party tool, and what your plugins do is on you. Please read the <a
              href="/policy">Usage Policy</a> before downloading.</div>
        </div>

        <div v-if="release === undefined">
          Fetching download assets...
        </div>

        <div v-else-if="release === null">
          Failed to fetch download assets 😥
        </div>

        <section v-else class="mt-8">
          <div class="flex flex-col w-full sm:flex-row items-center justify-between sm:items-start gap-4">
            <div class="flex flex-col gap-4 h-full w-full">
              <div class="flex w-full h-full flex-col gap-4">
                <div data-orientation="horizontal" class="flex flex-col gap-4 justify-between h-full">
                  <div class="flex flex-row gap-4 justify-center sm:justify-start">
                    <span
                      class="inline-flex items-center text-sm font-medium ring-offset-background transition-colors pr-4 py-2 h-10">Platform</span>
                    <div role="tablist" aria-orientation="horizontal"
                      class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
                      tabindex="0" data-orientation="horizontal" style="outline: none;">

                      <button v-for="p of [Platform.Windows, Platform.MacOS] as Platform[]" :key="p" type="button"
                        role="tab" v-text="p" @click="platform = p" :data-active="platform === p"
                        class="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-sm"
                        tabindex="-1" />

                    </div>
                  </div>

                  <div v-if="release.downloads[platform]" data-state="active" data-orientation="horizontal"
                    role="tabpanel"
                    class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <div class="flex flex-col mt-4 gap-4 justify-between w-full">
                      <div>

                        <div class="flex flex-col items-center mb-2 gap-4">
                          <p class="text-sm text-muted-foreground">Version {{ release.version }}</p>
                          <p class="text-sm text-muted-foreground text-center sm:text-left">Released on {{
                            release.publishedAt }}</p>
                          <a v-if="primaryDownload" :href="primaryDownload.url" v-text="downloadLabel"
                            class="btn-download bg-foreground hover:bg-foreground/80 text-primary-foreground py-2 px-4 rounded-full no-underline" />

                          <p v-if="platform === Platform.MacOS && primaryDownload?.arch"
                            class="text-xs text-muted-foreground">
                            Detected {{ archLabel(primaryDownload.arch) }}. On the wrong Mac?
                            <a v-for="other of otherMacBuilds" :key="other.url" :href="other.url">
                              Get the {{ archLabel(other.arch!) }} build</a>.
                          </p>

                          <p v-if="platform === Platform.Windows"
                            class="text-sm ml-4 py-2 mt-8 mb-4 text-muted-foreground">
                            This app uses open-source code signing provided by <a href="https://signpath.io"
                              rel="nofollow">SignPath.io</a>, and a certificate by the <a href="https://signpath.org"
                              rel="nofollow">SignPath Foundation</a>. Signed releases are published by <a
                              href="https://github.com/PenguLoader">Pengu Loader Org</a>.
                          </p>
                          <p v-if="platform === Platform.MacOS"
                            class="text-sm ml-4 py-2 mt-8 mb-4 text-muted-foreground">
                            *This DMG is a universal macOS binary, meaning it runs on both Intel and Apple
                            Silicon Mac.
                          </p>
                        </div>

                        <div v-if="release.downloads[platform].length > 1" class="relative mt-16 w-full overflow-auto">
                          <p class="text-sm py-2 text-muted-foreground">Other downloads:</p>
                          <table class="w-full caption-bottom text-sm">
                            <thead class="[&amp;_tr]:border-b border-muted-foreground">
                              <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th
                                  class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                  Type</th>
                                <th
                                  class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 hidden sm:table-cell">
                                  File name</th>
                                <th
                                  class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                  File size</th>
                                <th
                                  class="h-12 px-4 align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right">
                                </th>
                              </tr>
                            </thead>
                            <tbody class="[&amp;_tr:last-child]:border-0">

                              <tr v-for="file of release.downloads[platform]" :key="file.url"
                                class="border-b dark:border-muted-foreground transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">{{ file.name
                                  }}</td>
                                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden sm:table-cell">{{
                                  file.fileName }}</td>
                                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">{{ file.fileSize }}</td>
                                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right"><a
                                    :href="file.url"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                      width="24" height="24" fill="currentColor" class="remixicon h-5 w-5">
                                      <path
                                        d="M4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19ZM14 9H19L12 16L5 9H10V3H14V9Z">
                                      </path>
                                    </svg></a></td>
                              </tr>

                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="my-24 text-center">
                    <span v-if="platform === Platform.MacOS">
                      Pengu for macOS is coming soon!
                    </span>
                    <span v-else>
                      No downloads available for this platform.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* `a[href]` outranks a plain utility class, so the download button has to opt
   out or it inherits the blue link colour instead of its own */
a[href]:not(.btn-download) {
  @apply font-medium text-blue-600 dark:text-blue-500 hover:underline;
}
</style>
