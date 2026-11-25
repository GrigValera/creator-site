import { cp, mkdir, mkdtemp, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const releases = resolve(root, 'release')
const manifest = JSON.parse(await readFile(resolve(root, 'dist/.vite/manifest.json'), 'utf8'))
const assets = new Set(Object.values(manifest).flatMap(({ file, css = [], assets = [] }) => [file, ...css, ...assets]))
if (!assets.size || [...assets].some(path => !/^assets\/[\w.-]+$/.test(path))) {
  throw new Error('Unexpected files in Vite client manifest')
}

const runtimeFiles = [
  'package.json',
  'api/inquiries.js',
  'server/delivery.mjs',
  'server/inquiries.mjs',
  'server/start.mjs',
  'dist/index.html',
  ...[...assets].map(path => 'dist/' + path),
]

await mkdir(releases, { recursive: true })
const target = await mkdtemp(resolve(releases, 'alwaysdata-'))

for (const path of runtimeFiles) {
  await cp(resolve(root, path), resolve(target, path))
}

console.log('Package ready: ' + target)
