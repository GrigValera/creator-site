import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname } from 'node:path'
import handleInquiry from '../api/inquiries.js'

const dist = new URL('../dist/', import.meta.url)
const entry = await readFile(new URL('index.html', dist))
const host = process.env.HOST || '127.0.0.1'
const port = Number(process.env.PORT || 4173)
const types = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
  ['.jpg', 'image/jpeg'],
  ['.woff2', 'font/woff2'],
])

function reply(req, res, status, type, body, cache = 'no-store') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': cache })
  res.end(req.method === 'HEAD' ? undefined : body)
}

const server = createServer(async (req, res) => {
  const path = req.url?.split('?')[0]
  if (path === '/api/inquiries') return handleInquiry(req, res)
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return reply(req, res, 405, 'text/plain', 'Method Not Allowed')
  }
  if (path === '/' || path === '/index.html') {
    return reply(req, res, 200, 'text/html; charset=utf-8', entry, 'no-cache')
  }
  const type = path && types.get(extname(path))
  if (type && /^\/assets\/[\w.-]+$/.test(path)) {
    try {
      const content = await readFile(new URL(path.slice(1), dist))
      return reply(req, res, 200, type, content, 'public, max-age=86400')
    } catch (error) {
      if (error.code !== 'ENOENT') return reply(req, res, 500, 'text/plain', 'Internal Server Error')
    }
  }
  return reply(req, res, 404, 'text/plain', 'Not Found')
})

server.listen(port, host, () => console.log(`CREATOR listening on ${host}:${port}`))
