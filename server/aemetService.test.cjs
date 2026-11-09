const { test } = require('node:test')
const assert = require('node:assert/strict')
const { createService, dataURL } = require('./aemetService.cjs')
const path = 'prediccion/especifica/municipio/diaria/28079'
const daily = [{ prediccion: { dia: [{ fecha: '2026-11-09', temperatura: { maxima: 18, minima: 3 } }] } }]
function fixture(options = {}) {
  let time = 0, status = 200
  const calls = []
  const service = createService({ apiKey: 'server-secret', now: () => time, sleep: async ms => { time += ms },
    request: async (url, headers) => {
      calls.push({ url, headers, time })
      return { status, headers: { 'retry-after': '120' }, body: JSON.stringify(status === 200 ? url.includes('/api/') ? { estado: 200, datos: 'https://opendata.aemet.es/opendata/sh/example' } : daily : { estado: status }) }
    }, ...options })
  return { service, calls, advance: ms => { time += ms }, status: value => { status = value } }
}
test('100 simultaneous visitors share one two-stage product and one server cache', async () => {
  const f = fixture()
  const results = await Promise.all(Array.from({ length: 100 }, () => f.service.product(path)))
  assert.equal(f.calls.length, 2)
  assert.equal(f.calls[1].time - f.calls[0].time, 1600)
  assert.deepEqual(f.calls[1].headers, {})
  assert.equal(f.calls[0].headers.api_key, 'server-secret')
  assert.deepEqual(results[99].data, daily)
  await f.service.product(path, 'different-browser-key')
  assert.equal(f.calls.length, 2)
})
test('simultaneous map batches share products; every upstream call is globally spaced', async () => {
  const f = fixture()
  const results = await Promise.all(Array.from({ length: 100 }, () => f.service.map(['28079', '44001'], 'ignored')))
  assert.equal(f.calls.length, 4)
  for (let i = 1; i < f.calls.length; i++) assert(f.calls[i].time - f.calls[i - 1].time >= 1600)
  assert.deepEqual(results[0].products['44001'].data, daily)
})
test('expired data returns immediately, refresh is shared and failures preserve original age', async () => {
  const f = fixture()
  const first = await f.service.product(path)
  f.advance(20 * 60000); f.status(500)
  const results = await Promise.all(Array.from({ length: 100 }, () => f.service.product(path)))
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(f.calls.length, 3)
  assert.equal(results[0].stale, true)
  assert.equal(results[0].fetchedAt, first.fetchedAt)
  await f.service.product(path)
  assert.equal(f.calls.length, 3)
  f.advance(24 * 3600000)
  await assert.rejects(f.service.product(path), { code: 'unavailable' })
})
test('429 stops queued requests and respects Retry-After across different municipalities', async () => {
  const f = fixture(); f.status(429)
  await f.service.map(['28079', '44001', '41091'])
  assert.equal(f.calls.length, 1)
  f.advance(61000)
  await assert.rejects(f.service.product('prediccion/especifica/municipio/diaria/35016'), { code: 'limit' })
  assert.equal(f.calls.length, 1)
  f.advance(60000); f.status(200)
  await f.service.product(path)
  assert.equal(f.calls.length, 3)
})
test('application-level 429 in HTTP 200 also pauses the queue', async () => {
  let count = 0
  const f = fixture({ request: async () => { count++; return { status: 200, body: '{"estado":429}' } } })
  await f.service.map(['28079', '44001'])
  assert.equal(count, 1)
})
test('queue and batch size are bounded, raw endpoints and malformed codes are rejected', async () => {
  const f = fixture({ maxPending: 1 })
  const batch = await f.service.map(['28079', '44001'])
  assert.equal(batch.products['44001'].error, 'busy')
  await assert.rejects(f.service.product('../other'), { code: 'invalid' })
  await assert.rejects(f.service.map(Array.from({ length: 21 }, (_, i) => String(10000 + i))), { code: 'invalid' })
  await assert.rejects(f.service.map(['bad']), { code: 'invalid' })
})
test('failed responses are not cached as products or retried by every visitor', async () => {
  const f = fixture(); f.status(401)
  await assert.rejects(f.service.product(path), { code: 'configuration' })
  await assert.rejects(f.service.product(path), { code: 'configuration' })
  assert.equal(f.calls.length, 1)
  f.advance(61000); f.status(200)
  assert.deepEqual((await f.service.product(path)).data, daily)
})
test('validates downloads against SSRF and does not cache malformed forecasts', async () => {
  for (const url of ['http://opendata.aemet.es/opendata/sh/a', 'https://example.com/a', 'https://opendata.aemet.es:8443/opendata/sh/a', 'https://x:y@opendata.aemet.es/opendata/sh/a', 'https://opendata.aemet.es/opendata/sh/a?key=x', 'broken']) assert.throws(() => dataURL(url))
  const f = fixture({ request: async url => ({ status: 200, body: JSON.stringify(url.includes('/api/') ? { estado: 200, datos: 'https://opendata.aemet.es/opendata/sh/a' } : [{}]) }) })
  await assert.rejects(f.service.product(path), { code: 'invalid' })
})
test('retains regional text and isolates malformed or missing configuration', async () => {
  const f = fixture({ request: async url => ({ status: 200, body: url.includes('/api/') ? JSON.stringify({ estado: 200, datos: 'https://opendata.aemet.es/opendata/sh/a' }) : 'Predicción regional' }) })
  assert.equal((await f.service.product('prediccion/ccaa/hoy/mad')).data, 'Predicción regional')
  await assert.rejects(createService({ apiKey: '' }).product(path), { code: 'configuration' })
})
test('successful background refresh replaces stale data, and cache eviction stays bounded', async () => {
  const f = fixture({ maxCache: 1 })
  const first = await f.service.product(path)
  f.advance(20 * 60000)
  assert.equal((await f.service.product(path)).stale, true)
  await new Promise(resolve => setImmediate(resolve))
  const refreshed = await f.service.product(path)
  assert.equal(refreshed.stale, false)
  assert(refreshed.fetchedAt > first.fetchedAt)
  assert.equal(f.calls.length, 4)
  await f.service.product('prediccion/especifica/municipio/diaria/44001')
  await f.service.product(path)
  assert.equal(f.calls.length, 8)
})
