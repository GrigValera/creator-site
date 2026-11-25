import { cp, mkdir, mkdtemp } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const releases = resolve(root, 'release')
const runtimeFiles = [
  'package.json',
  'api/inquiries.js',
  'server/delivery.mjs',
  'server/inquiries.mjs',
  'server/start.mjs',
  'dist/index.html',
  'dist/assets',
]

await mkdir(releases, { recursive: true })
const target = await mkdtemp(resolve(releases, 'alwaysdata-'))

for (const path of runtimeFiles) {
  await cp(resolve(root, path), resolve(target, path), { recursive: true })
}

console.log('Package ready: ' + target)
