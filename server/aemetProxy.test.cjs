const { test } = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const { EventEmitter } = require('node:events')
const { Readable } = require('node:stream')
const createProxy = require('./aemetProxy.cjs')

async function withProxy(get, run) {
  const server = http.createServer(createProxy(get))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  try { await run(`http://127.0.0.1:${server.address().port}`) }
  finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)) }
}
function upstreamFixture(body, status = 200, contentType = 'application/json') {
  const calls = []
  const get = (url, options, callback) => {
    calls.push({ url, options })
    const request = new EventEmitter()
    request.destroy = () => {}
    process.nextTick(() => {
      const response = Readable.from([Buffer.from(body)])
      response.statusCode = status
      response.headers = { 'content-type': contentType }
      callback(response)
    })
    return request
  }
  return { calls, get }
}
test('forwards authenticated metadata through the same-origin endpoint without browser Origin/cookies', async () => {
  const fixture = upstreamFixture(JSON.stringify({ estado: 200, datos: 'https://opendata.aemet.es/opendata/sh/example' }))
  await withProxy(fixture.get, async base => {
    const res = await fetch(`${base}/opendata/api/prediccion/especifica/municipio/horaria/44001`, {
      headers: { api_key: 'test-key', Origin: 'http://localhost:3000', Cookie: 'session=private' },
    })
    assert.equal(res.status, 200)
    assert.equal((await res.json()).estado, 200)
    assert.deepEqual(fixture.calls[0], {
      url: 'https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/44001',
      options: { headers: { api_key: 'test-key', Accept: 'application/json' } },
    })
  })
})
test('downloads data without forwarding the key, preserving text encoding', async () => {
  const fixture = upstreamFixture('Predicción regional', 200, 'text/plain; charset=utf-8')
  await withProxy(fixture.get, async base => {
    const res = await fetch(`${base}/opendata/sh/example`, { headers: { api_key: 'do-not-forward' } })
    assert.equal(await res.text(), 'Predicción regional')
    assert.equal(res.headers.get('content-type'), 'text/plain; charset=utf-8')
    assert.deepEqual(fixture.calls[0].options.headers, {})
  })
})
test('rejects arbitrary destinations, unsupported endpoints, query strings and writes', async () => {
  const fixture = upstreamFixture('{}')
  await withProxy(fixture.get, async base => {
    for (const path of ['/https://example.com', '//example.com', '/opendata/api/other', '/opendata/sh/id?url=https://example.com']) {
      assert.equal((await fetch(base + path)).status, 400)
    }
    assert.equal((await fetch(`${base}/opendata/sh/id`, { method: 'POST' })).status, 405)
    assert.equal((await fetch(`${base}/opendata/api/prediccion/especifica/municipio/diaria/44001`)).status, 401)
    assert.equal(fixture.calls.length, 0)
  })
})
test('preserves upstream error statuses for the UI', async () => {
  for (const status of [401, 403, 429]) {
    const fixture = upstreamFixture(JSON.stringify({ estado: status }), status)
    await withProxy(fixture.get, async base => {
      const res = await fetch(`${base}/opendata/sh/example`)
      assert.equal(res.status, status)
      assert.equal((await res.json()).estado, status)
    })
  }
})
test('does not follow redirects', async () => {
  const fixture = upstreamFixture('', 302)
  await withProxy(fixture.get, async base => {
    assert.equal((await fetch(`${base}/opendata/sh/example`)).status, 502)
    assert.equal(fixture.calls.length, 1)
  })
})
test('returns a controlled failure on an upstream network error', async () => {
  await withProxy(() => {
    const req = new EventEmitter()
    req.destroy = () => {}
    process.nextTick(() => req.emit('error', new Error('private upstream details')))
    return req
  }, async base => {
    const res = await fetch(`${base}/opendata/sh/example`)
    assert.equal(res.status, 502)
    assert.equal((await res.json()).descripcion, 'AEMET connection failed')
  })
})
