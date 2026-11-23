import { readFile, writeFile } from 'node:fs/promises'
import { render } from './.ssr/entry-server.js'

const page = new URL('./dist/index.html', import.meta.url)
const html = await readFile(page, 'utf8')
const marker = '<!--app-html-->'

if (!html.includes(marker)) throw new Error('Missing pre-render marker')
await writeFile(page, html.replace(marker, () => render()))
