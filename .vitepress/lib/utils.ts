
export enum Platform {
  Windows = 'Windows 10/11',
  MacOS = 'macOS 12+',
}

export type MacArch = 'arm64' | 'x64'

export function getPlatform(ua: string): Platform {
  ua = ua.toLowerCase()
  // check mac first: some UA strings carry both tokens
  if (ua.indexOf('mac') !== -1) {
    return Platform.MacOS
  }
  if (ua.indexOf('windows') !== -1) {
    return Platform.Windows
  }

  return Platform.Windows
}

export const archLabel = (arch: MacArch) =>
  arch === 'arm64' ? 'Apple Silicon' : 'Intel'

/**
 * Which macOS build to hand the visitor.
 *
 * Best effort by necessity: Safari and Firefox still report `Intel Mac OS X`
 * on Apple Silicon, so the UA string alone can never answer this. We try the
 * two signals that do differ, then guess.
 */
export async function detectMacArch(): Promise<MacArch> {
  // 1. Chromium exposes the real architecture through UA Client Hints.
  const uaData = (navigator as any).userAgentData
  if (uaData?.getHighEntropyValues) {
    try {
      const { architecture } = await uaData.getHighEntropyValues(['architecture'])
      if (architecture === 'arm') return 'arm64'
      if (architecture === 'x86') return 'x64'
    } catch {
      // permission denied or hint unsupported, fall through
    }
  }

  // 2. The GPU renderer string still differs between the two.
  try {
    const gl = document.createElement('canvas').getContext('webgl')
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info')
      const renderer = String(
        ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
      )
      if (/apple\s*(m\d|gpu|silicon)/i.test(renderer)) return 'arm64'
      if (/intel|radeon|amd|nvidia|geforce/i.test(renderer)) return 'x64'
    }
  } catch {
    // canvas/webgl unavailable
  }

  // 3. Apple stopped selling Intel Macs in 2023, so arm64 is the better bet.
  //    Both builds stay listed in the table either way.
  return 'arm64'
}

export function getAssetArch(fileName: string): MacArch | undefined {
  const name = fileName.toLowerCase()
  if (/arm64|aarch64|apple-?silicon/.test(name)) return 'arm64'
  if (/x64|x86[-_]?64|amd64|intel/.test(name)) return 'x64'
  return undefined
}
