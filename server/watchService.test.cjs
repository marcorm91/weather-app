const { test } = require('node:test')
const assert = require('node:assert/strict')
const { parseFeed, createWatchService } = require('./watchService.cjs')
const now = Date.parse('2026-11-09T12:00:00Z')
function entry({ id = 'one', zone = 'Campiña gaditana', event = 'Severe rain warning', status = 'Actual', type = 'Alert', start = '2026-11-09T11:00:00Z', end = '2026-11-09T14:00:00Z', extra = '' } = {}) {
  return `<entry><cap:identifier>${id}</cap:identifier><cap:areaDesc>${zone}</cap:areaDesc><cap:event>${event}</cap:event><cap:status>${status}</cap:status><cap:scope>Public</cap:scope><cap:message_type>${type}</cap:message_type><cap:severity>Severe</cap:severity><cap:onset>${start}</cap:onset><cap:expires>${end}</cap:expires><cap:sent>2026-11-09T11:00:00Z</cap:sent>${extra}</entry>`
}
const feed = entries => `<feed xmlns="http://www.w3.org/2005/Atom" xmlns:cap="urn:oasis:names:tc:emergency:cap:1.2"><id>tag:meteoalarm.org,2021-02-19:ES</id><updated>2026-11-09T12:00:00Z</updated>${entries}</feed>`
test('matches exact official zone names to municipalities, with no invented coastal mapping', () => {
  const result = parseFeed(feed(entry() + entry({ id: 'coast', zone: 'Costa - Litoral gaditano', event: 'Severe coastal event warning' })))
  assert(result.warnings[0].municipalityCodes.includes('11020'))
  assert.equal(result.warnings[0].zoneCode, '611102')
  assert.deepEqual(result.warnings[1].municipalityCodes, [])
  assert.equal(result.warnings[1].type, 'coast')
})
test('unknown zones stay visible but unassociated; malformed and test warnings cannot become active alerts', () => {
  const r = parseFeed(feed(entry({ zone: 'New zone' }) + entry({ id: 'exercise', status: 'Test' }) + entry({ id: 'bad', end: 'not-a-date' }) + entry({ id: 'wind', event: 'Severe wind warning' })))
  assert.equal(r.warnings.length, 1); assert.equal(r.warnings[0].zoneCode, null); assert.equal(r.invalid, 1)
})
test('cancellations withdraw referenced alerts and duplicate identifiers are deduplicated', () => {
  const r = parseFeed(feed(entry() + entry() + entry({ id: 'cancel', type: 'Cancel', extra: '<cap:references>sender,one,2026-11-09T11:00:00Z</cap:references>' })))
  assert.equal(r.warnings.length, 0)
})
test('malformed feeds, external entities and unexpected countries are rejected', () => {
  for (const xml of ['<html>error</html>', '<feed>', '<!DOCTYPE feed [<!ENTITY x SYSTEM "file:///etc/passwd">]>'+feed(''), feed('').replace(':ES', ':FR')]) assert.throws(() => parseFeed(xml))
})
test('100 clients share a single feed request, without using AEMET forecast quota', async () => {
  let calls = 0
  const watch = createWatchService({ now: () => now, fetchFeed: async () => { calls++; return feed(entry()) } })
  const replies = await Promise.all(Array.from({ length: 100 }, watch))
  assert.equal(calls, 1); assert.equal(replies[0].status, 'ok')
  assert.equal(replies[0].coverage.mappedMunicipalities, 8124)
  assert.equal(replies[0].coverage.unmappedMunicipalities.length, 7)
})
test('a refreshed empty snapshot removes previous warnings; no old entries accumulate', async () => {
  let time = now, value = feed(entry())
  const watch = createWatchService({ now: () => time, fetchFeed: async () => value })
  assert.equal((await watch()).warnings.length, 1)
  time += 180000; value = feed('')
  assert.equal((await watch()).warnings.length, 0)
})
test('failed refresh is marked stale, bounded by 30 minutes, with retry cooldown', async () => {
  let time = now, calls = 0, fails = false
  const watch = createWatchService({ now: () => time, fetchFeed: async () => { calls++; if (fails) throw new Error(); return feed(entry()) } })
  await watch(); fails = true; time += 180000
  assert.equal((await watch()).status, 'stale')
  await watch(); assert.equal(calls, 2)
  time += 30 * 60000
  const result = await watch(); assert.equal(result.status, 'unavailable'); assert.deepEqual(result.warnings, [])
})
test('expired alerts are filtered on every read and future alerts remain explicitly dated', async () => {
  let time = now
  const watch = createWatchService({ now: () => time, fetchFeed: async () => feed(entry({ end: '2026-11-09T12:01:00Z' }) + entry({ id: 'future', start: '2026-11-09T13:00:00Z' })) })
  assert.equal((await watch()).warnings.length, 2)
  time += 61000
  const r = await watch(); assert.equal(r.warnings.length, 1); assert(r.warnings[0].start > time)
})
