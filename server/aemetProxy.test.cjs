const { test } = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const createProxy = require('./aemetProxy.cjs')
test('HTTP batch endpoint shares calls across browsers, forwards no cookies and closes raw bypass', async () => {
  const calls = []
  const server = http.createServer(createProxy({ apiKey: 'private-key', interval: 0, request: async (url, headers) => {
    calls.push({ url, headers })
    return { status: 200, body: JSON.stringify(url.includes('/api/') ? { estado: 200, datos: 'https://opendata.aemet.es/opendata/sh/example' } : [{ prediccion: { dia: [{ fecha: '2026-11-09' }] } }]) }
  } }))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  try {
    const responses = await Promise.all(Array.from({ length: 20 }, () => fetch(base + '/map?codes=28079,44001', { headers: { Cookie: 'private', Origin: 'https://example.com' } }).then(r => r.json())))
    assert(responses.every(r => r.products['28079'].data))
    assert.equal(calls.length, 4)
    assert.deepEqual(calls[0].headers, { api_key: 'private-key', Accept: 'application/json' })
    const detail = await fetch(base + '/product?path=prediccion/especifica/municipio/diaria/28079')
    assert.equal(detail.status, 200); assert.equal(calls.length, 4)
    for (const route of ['/opendata/sh/id', '/opendata/api/prediccion/especifica/municipio/diaria/28079', '/map?codes=bad', '/map?codes=28079&url=https://example.com', '/product?path=../bad']) assert.equal((await fetch(base + route)).status, 400)
    assert.equal((await fetch(base + '/map?codes=28079', { method: 'POST' })).status, 405)
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)) }
})
