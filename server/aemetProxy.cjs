const { createWatchService } = require('./watchService.cjs')
const { createService } = require('./aemetService.cjs')

// One instance per server, shared by all browsers. Raw forwarding is deliberately unavailable.
module.exports = function createAemetProxy(options = {}) {
  const service = createService(options)
  const getWatch = createWatchService()
  return async function aemetProxy(req, res) {
    const send = (status, body) => {
      if (res.writableEnded || res.destroyed) return
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...(status === 429 || status === 503 ? { 'Retry-After': '60' } : {}) })
      res.end(JSON.stringify(body))
    }
    try {
      if (req.method !== 'GET') return send(405, { code: 'invalid' })
      const url = new URL(req.url, 'http://localhost')
      if (url.pathname === '/watch' && !url.search) return send(200, await getWatch())
      if (url.pathname === '/product' && [...url.searchParams.keys()].join(',') === 'path') return send(200, await service.product(url.searchParams.get('path'), req.headers.api_key))
      if (url.pathname === '/map' && [...url.searchParams.keys()].join(',') === 'codes') return send(200, await service.map(url.searchParams.get('codes').split(','), req.headers.api_key))
      send(400, { code: 'invalid' })
    } catch (error) { send(error.status || 502, { code: error.code || 'unavailable' }) }
  }
}
