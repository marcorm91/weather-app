const https = require('node:https')
const { TextDecoder } = require('node:util')
const PRODUCT = /^prediccion\/(?:especifica\/municipio\/(?:horaria|diaria)\/\d{5}|ccaa\/hoy\/(?:and|arn|ast|bal|coo|can|cle|clm|cat|val|ext|gal|mad|mur|nav|pva|rio))$/
const MAX_BYTES = 10 * 1024 * 1024
const failure = (status, code) => Object.assign(new Error(code), { status, code })
function transport(url, headers) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { headers }, response => {
      const chunks = []; let bytes = 0
      response.on('data', chunk => {
        bytes += chunk.length
        if (bytes > MAX_BYTES) { reject(failure(502, 'invalid')); request.destroy(); return }
        chunks.push(chunk)
      })
      response.on('error', () => reject(failure(502, 'unavailable')))
      response.on('aborted', () => reject(failure(502, 'unavailable')))
      response.on('end', () => {
        clearTimeout(timer)
        const charset = /charset=([^;\s]+)/i.exec(response.headers['content-type'] || '')?.[1] || 'utf-8'
        try { resolve({ status: response.statusCode, headers: response.headers, body: new TextDecoder(charset).decode(Buffer.concat(chunks)) }) }
        catch { reject(failure(502, 'invalid')) }
      })
    })
    const timer = setTimeout(() => { reject(failure(504, 'unavailable')); request.destroy() }, 12000)
    request.on('error', () => { clearTimeout(timer); reject(failure(502, 'unavailable')) })
    request.on('close', () => clearTimeout(timer))
  })
}
function validProduct(data, text) {
  if (text) return typeof data === 'string' && !!data.trim()
  const days = data?.[0]?.prediccion?.dia
  return Array.isArray(data) && Array.isArray(days) && days.length > 0 && days.every(day =>
    typeof day.fecha === 'string' && /^\d{4}-\d{2}-\d{2}/.test(day.fecha) &&
    ['estadoCielo', 'precipitacion', 'nieve', 'vientoAndRachaMax', 'probPrecipitacion'].every(key => day[key] == null || Array.isArray(day[key])))
}
function dataURL(value) {
  let url
  try { url = new URL(value) } catch { throw failure(502, 'invalid') }
  if (url.protocol !== 'https:' || url.hostname !== 'opendata.aemet.es' || url.port || url.username || url.password || url.search || url.hash || !/^\/opendata\/sh\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname)) throw failure(502, 'invalid')
  return url.href
}
function createService({ request = transport, now = Date.now, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), interval = 1600, ttl = 20 * 60 * 1000, staleTTL = 24 * 60 * 60 * 1000, maxPending = 64, maxCache = 256, apiKey = process.env.AEMET_API_KEY?.trim() } = {}) {
  const cache = new Map(), pending = new Map(), failures = new Map()
  let tail = Promise.resolve(), nextRequest = 0, blockedUntil = 0
  // One queue for ALL upstream HTTP calls, including the temporary data downloads.
  function call(url, headers) {
    const operation = tail.then(async () => {
      if (now() < blockedUntil) throw failure(429, 'limit')
      await sleep(Math.max(0, nextRequest - now()))
      if (now() < blockedUntil) throw failure(429, 'limit')
      nextRequest = now() + interval
      const response = await request(url, headers)
      const body = response.body
      let envelope
      try { envelope = JSON.parse(body) } catch { /* Text bulletin or invalid JSON, validated below. */ }
      const status = response.status === 200 && envelope?.estado != null ? Number(envelope.estado) : response.status
      if (status === 429) {
        const retry = response.headers?.['retry-after']
        const seconds = Number(retry)
        const wait = retry && Number.isFinite(seconds) ? seconds * 1000 : Date.parse(retry) - now()
        blockedUntil = now() + Math.max(60000, Number.isFinite(wait) ? wait : 60000)
        throw failure(429, 'limit')
      }
      if (status !== 200) throw failure(status === 401 || status === 403 ? 401 : 502, status === 401 || status === 403 ? 'configuration' : 'unavailable')
      return body
    })
    tail = operation.catch(() => {})
    return operation
  }
  function refresh(path, key) {
    if (pending.has(path)) return pending.get(path)
    if (now() < blockedUntil) return Promise.reject(failure(429, 'limit'))
    const lastFailure = failures.get(path)
    if (lastFailure && lastFailure.until > now()) return Promise.reject(lastFailure.error)
    if (pending.size >= maxPending) return Promise.reject(failure(503, 'busy'))
    const operation = (async () => {
      try {
        const metadata = JSON.parse(await call(`https://opendata.aemet.es/opendata/api/${path}`, { api_key: key, Accept: 'application/json' }))
        if (Number(metadata.estado) !== 200) throw failure(502, 'invalid')
        const body = await call(dataURL(metadata.datos), {})
        const text = path.startsWith('prediccion/ccaa/')
        const data = text ? body : JSON.parse(body)
        if (!validProduct(data, text)) throw failure(502, 'invalid')
        const item = { data, fetchedAt: now() }
        cache.delete(path)
        if (cache.size >= maxCache) cache.delete(cache.keys().next().value)
        cache.set(path, item); failures.delete(path)
        return { ...item, stale: false }
      } catch (error) {
        const safeError = error.code && error.status ? error : failure(502, 'unavailable')
        if (failures.size >= maxCache) failures.delete(failures.keys().next().value)
        failures.set(path, { until: now() + 60000, error: safeError })
        throw safeError
      } finally { pending.delete(path) }
    })()
    pending.set(path, operation)
    return operation
  }
  async function product(path, suppliedKey) {
    if (!PRODUCT.test(path)) throw failure(400, 'invalid')
    const key = apiKey || (typeof suppliedKey === 'string' ? suppliedKey.trim() : '')
    if (!key) throw failure(401, 'configuration')
    const item = cache.get(path)
    if (item && now() - item.fetchedAt < ttl) return { ...item, stale: false }
    if (item && now() - item.fetchedAt < staleTTL) {
      // Stale-while-revalidate: visitors never wait for a refresh; failed refreshes retain the last valid data.
      refresh(path, key).catch(() => {})
      return { ...item, stale: true }
    }
    return refresh(path, key)
  }
  async function map(codes, key) {
    const unique = [...new Set(codes)]
    if (!unique.length || unique.length > 20 || unique.some(code => !/^\d{5}$/.test(code))) throw failure(400, 'invalid')
    const entries = await Promise.all(unique.map(async code => {
      try { return [code, await product(`prediccion/especifica/municipio/diaria/${code}`, key)] }
      catch (error) { return [code, { error: error.code || 'unavailable' }] }
    }))
    return { products: Object.fromEntries(entries) }
  }
  return { product, map }
}
module.exports = { createService, dataURL, validProduct }
