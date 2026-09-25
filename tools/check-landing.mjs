// Run with: node tools/check-landing.mjs
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const require = createRequire(import.meta.url)
const viteRequire = createRequire(require.resolve('vitepress/package.json'))
const { createServer } = await import(pathToFileURL(join(dirname(viteRequire.resolve('vite/package.json')), 'dist/node/index.js')).href)
const server = await createServer({ configFile: false, server: { middlewareMode: true } })
try {
  const { useClientDemo } = await server.ssrLoadModule('/.vitepress/components/landing-prototype/useClientDemo.ts')
  let demo
  await renderToString(createSSRApp({ setup() { demo = useClientDemo(); return () => null } }))
  let reloads = 0
  let style
  demo.frame.value = {
    contentDocument: {
      querySelector: () => ({}),
      getElementById: () => style,
      createElement: () => ({}),
      body: { append: value => { style = value } },
    },
    contentWindow: { Function, location: { reload() { reloads++ } } },
  }
  await demo.onFrameLoad()
  assert.equal(demo.ready.value, true)
  demo.update('body { color: red }')
  assert.equal(style.textContent, 'body { color: red }')
  demo.reset()
  assert.match(demo.files.value[0].code, /hue-rotate/)
  demo.select('acrylic')
  await demo.onFrameLoad()
  assert.equal(demo.effect.value.name, 'acrylic')
  demo.fileIndex.value = 1
  const before = reloads
  demo.update('body { background: transparent }')
  assert.equal(reloads, before, 'CSS in a mixed plugin must not reload its JS')
  assert.match(style.textContent, /transparent/)
  demo.files.value[0].code = 'export async function load() { throw Error("test failure") }'
  await demo.onFrameLoad()
  assert.equal(demo.status.value.ok, false)
  assert.match(demo.status.value.text, /test failure/)
  demo.files.value[0].code = 'export async function load() { await new Promise(r => setTimeout(r, 10)); throw Error("stale") }'
  const pending = demo.onFrameLoad()
  demo.select('restyle')
  await demo.onFrameLoad()
  await pending
  assert.equal(demo.status.value.ok, true, 'An old async error must not overwrite the current example')
  demo.select('invalid')
  assert.equal(demo.activeId.value, 'restyle')
  demo.select('acrylic')
  demo.fileIndex.value = 0
  demo.update('export function load() {}')
  demo.select('recolor')
  const after = reloads
  await new Promise(resolve => setTimeout(resolve, 650))
  assert.equal(reloads, after, 'Preset changes cancel pending updates')
  console.log('Landing runtime checks passed')
} finally {
  await server.close()
}
