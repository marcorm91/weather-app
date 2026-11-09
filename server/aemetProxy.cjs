const https = require('node:https')

const apiPath = /^\/opendata\/api\/prediccion\/(?:especifica\/municipio\/(?:horaria|diaria)\/\d{5}|ccaa\/hoy\/(?:and|arn|ast|bal|coo|can|cle|clm|cat|val|ext|gal|mad|mur|nav|pva|rio))\/?$/
const dataPath = /^\/opendata\/sh\/[a-zA-Z0-9_-]+\/?$/
const MAX_BYTES = 10 * 1024 * 1024

// Mounted at /aemet. Only the application's AEMET routes are forwarded.
module.exports = function createAemetProxy(get = https.get) {
  return function aemetProxy(req, res) {
    const fail = (status, message) => {
      if (!res.writableEnded && !res.destroyed) {
        res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
        res.end(JSON.stringify({ estado: status, descripcion: message }))
      }
    }
    if (req.method !== 'GET') return fail(405, 'Method not allowed')
    const pathname = req.url
    const isApi = apiPath.test(pathname)
    if (!isApi && !dataPath.test(pathname)) return fail(400, 'Unsupported AEMET route')
    const apiKey = req.headers.api_key
    if (isApi && (typeof apiKey !== 'string' || !apiKey.trim())) return fail(401, 'Missing API key')
    let upstream
    const timer = setTimeout(() => {
      fail(504, 'AEMET request timed out')
      upstream?.destroy()
    }, 12000)
    res.once('close', () => { clearTimeout(timer); upstream?.destroy() })
    try {
      upstream = get(`https://opendata.aemet.es${pathname}`, {
        // Do not forward browser Origin, cookies, or keys to download URLs.
        headers: isApi ? { api_key: apiKey, Accept: 'application/json' } : {},
      }, response => {
        // Never follow redirects to arbitrary destinations.
        if (response.statusCode >= 300 && response.statusCode < 400) {
          response.resume()
          fail(502, 'Unexpected AEMET redirect')
          return
        }
        const chunks = []
        let bytes = 0
        response.on('data', chunk => {
          bytes += chunk.length
          if (bytes > MAX_BYTES) { fail(502, 'AEMET response too large'); upstream.destroy(); return }
          chunks.push(chunk)
        })
        response.on('error', () => fail(502, 'AEMET connection failed'))
        response.on('aborted', () => fail(502, 'AEMET response interrupted'))
        response.on('end', () => {
          clearTimeout(timer)
          if (res.writableEnded || res.destroyed) return
          res.writeHead(response.statusCode || 502, {
            'Content-Type': response.headers['content-type'] || 'application/json',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff',
          })
          res.end(Buffer.concat(chunks))
        })
      })
      upstream.on('error', () => fail(502, 'AEMET connection failed'))
    } catch { clearTimeout(timer); fail(502, 'AEMET connection failed') }
  }
}
