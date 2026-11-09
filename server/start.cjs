const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const createProxy = require('./aemetProxy.cjs')
const api = createProxy()
const root = path.resolve(__dirname, '../build')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.geojson': 'application/geo+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain' }
if (!fs.existsSync(path.join(root, 'index.html'))) throw new Error('Run npm run build before npm run serve')
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  if (url.pathname.startsWith('/aemet/')) { req.url = req.url.slice('/aemet'.length); return api(req, res) }
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end() }
  let pathname
  try { pathname = decodeURIComponent(url.pathname) } catch { res.writeHead(400); return res.end() }
  let file = path.resolve(root, '.' + pathname)
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); return res.end() }
  // Only application routes fall back to index.html; missing assets are actual 404s.
  if (['/', '/more-info', '/alerts', '/contact'].includes(pathname)) file = path.join(root, 'index.html')
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) { res.writeHead(404); return res.end() }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-cache' })
    if (req.method === 'HEAD') return res.end()
    fs.createReadStream(file).on('error', () => res.destroy()).pipe(res)
  })
}).listen(process.env.PORT || 3000, process.env.HOST || '127.0.0.1', () => console.log('Weather server ready'))
