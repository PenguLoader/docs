import { archLabel, getAssetArch, Platform, type MacArch } from './utils'

// NOTE: this module runs in the browser, so it must never carry a token --
// anything passed here ends up verbatim in the published JS bundle.
// Unauthenticated GitHub API calls are rate limited per visitor IP (60/hour),
// which is plenty for a single "latest release" lookup.
const LATEST_RELEASE_URL =
  'https://api.github.com/repos/PenguLoader/PenguLoader/releases/latest'

type RawAsset = {
  name: string
  size: number
  browser_download_url: string
}

type RawRelease = {
  tag_name: string
  name: string | null
  published_at: string | null
  assets: RawAsset[]
}

export type AssetInfo = {
  name: string
  url: string
  fileName: string
  fileSize: string
  arch?: MacArch
}

export type Release = {
  version: string
  name: string
  publishedAt: string
  downloads: Partial<Record<Platform, AssetInfo[]>>
}

const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
})

const getReadableName = (rawName: string, arch?: MacArch): string => {
  // asset names are mixed case on the releases page, match case-insensitively
  const name = rawName.toLowerCase()
  if (name.endsWith('.exe')) {
    return 'Installer'
  }
  if (name.endsWith('.msi')) {
    return 'MSI installer'
  }
  if (name.endsWith('.dmg')) {
    return 'Installer'
  }
  if (arch) {
    return archLabel(arch)
  }
  if (name.includes('portable') || /\.(7z|zip)$/.test(name)) {
    return 'Portable'
  }

  return ''
}

const getPlatformTypByAssetName = (rawName: string): Platform => {
  const name = rawName.toLowerCase()
  // macOS first -- 'exe' is a loose substring that can appear anywhere
  if (name.includes('macos') || name.includes('darwin') || name.endsWith('.dmg')) {
    return Platform.MacOS
  }
  if (name.includes('windows') || name.includes('exe')) {
    return Platform.Windows
  }

  return Platform.Windows
}

function getAssetInfo(asset: RawAsset): AssetInfo {
  const fileSize = asset.size / 1024 / 1024
  const arch = getAssetArch(asset.name)
  return {
    url: asset.browser_download_url,
    fileName: asset.name,
    name: getReadableName(asset.name, arch),
    fileSize: `${fileSize.toFixed(2)} MB`,
    arch,
  }
}

export async function getRelease(): Promise<Release | null> {
  try {
    const response = await fetch(LATEST_RELEASE_URL, {
      headers: {
        accept: 'application/vnd.github+json',
        'x-github-api-version': '2022-11-28',
      },
    })

    if (!response.ok) {
      // a 403/429 with no quota left means this visitor's IP hit the
      // unauthenticated limit, not that the release is missing
      if (response.headers.get('x-ratelimit-remaining') === '0') {
        console.error('GitHub API rate limit reached for this IP')
      } else {
        console.error(`Failed to fetch release data: ${response.status}`)
      }
      return null
    }

    const data: RawRelease = await response.json()

    if (!Array.isArray(data.assets) || data.published_at === null) {
      console.error('Failed to fetch release data')
      return null
    }

    const downloads: Partial<Record<Platform, AssetInfo[]>> = {}
    for (const asset of data.assets) {
      const platform = getPlatformTypByAssetName(asset.name)
      const list = downloads[platform] ?? (downloads[platform] = [])
      list.push(getAssetInfo(asset))
    }

    return {
      version: data.tag_name,
      name: data.name || data.tag_name,
      publishedAt: dateFormat.format(new Date(data.published_at)),
      downloads,
    }
  } catch (e) {
    console.error('Failed to fetch release data', e)
    return null
  }
}
