const https = require('node:https')
const { XMLParser, XMLValidator } = require('fast-xml-parser')
const catalogue = require('./data/warning-municipalities.json')
const towns = require('../src/resources/services/code_towns.json')
const mappedCodes = new Set(Object.values(catalogue.zones).flatMap(zone => zone.codes))
const unmappedMunicipalities = towns.map(town => `${String(town.CPRO).padStart(2, '0')}${String(town.CMUN).padStart(3, '0')}`).filter(code => !mappedCodes.has(code))
const FEED = 'https://feeds.meteoalarm.org/feeds/meteoalarm-legacy-atom-spain'
const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim()
const zoneByName = new Map(Object.entries(catalogue.zones).map(([code, zone]) => [normalize(zone.name), { code, ...zone }]))
const list = value => value == null ? [] : Array.isArray(value) ? value : [value]
const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true, parseTagValue: false, processEntities: true })
const rank = { Moderate: 2, Severe: 3, Extreme: 4 }
function hazard(event) {
  const text = String(event).toLowerCase()
  if (/flood|inundaci/.test(text)) return 'flood'
  if (/thunder|tormenta/.test(text)) return 'storm'
  if (/rain|lluvia/.test(text)) return 'rain'
  if (/coastal|costero|coastalevent/.test(text)) return 'coast'
  return null
}
function parseFeed(xml) {
  if (typeof xml !== 'string' || /<!DOCTYPE|<!ENTITY/i.test(xml) || XMLValidator.validate(xml) !== true) throw new Error('invalid-feed')
  const feed = parser.parse(xml).feed
  if (!feed || !String(feed.id).endsWith(':ES') || !Number.isFinite(Date.parse(feed.updated))) throw new Error('invalid-feed')
  const entries = list(feed.entry)
  if (entries.length > 5000) throw new Error('invalid-feed')
  const warnings = new Map(); let invalid = 0
  const cancelled = new Set(entries.filter(entry => entry.status === 'Actual').flatMap(entry => {
    if (!['Update', 'Cancel'].includes(entry.message_type)) return []
    return String(entry.references || '').split(/\s+/).map(ref => ref.split(',')[1]).filter(Boolean)
  }))
  for (const entry of entries) {
    if (entry.status !== 'Actual' || entry.scope !== 'Public' || !['Alert', 'Update'].includes(entry.message_type) || cancelled.has(entry.identifier)) continue
    const type = hazard(entry.event)
    if (!type) continue
    const start = Date.parse(entry.onset || entry.effective), end = Date.parse(entry.expires), sent = Date.parse(entry.sent)
    if (!entry.identifier || !entry.areaDesc || !rank[entry.severity] || ![start, end, sent].every(Number.isFinite) || start >= end) { invalid++; continue }
    // Exact, unique normalized names only. Do not infer a municipal mapping for marine or unknown zones.
    const zone = type === 'coast' ? null : zoneByName.get(normalize(entry.areaDesc))
    const geocode = list(entry.geocode).find(item => item.valueName === 'EMMA_ID')?.value
    const link = /^ES\d+$/.test(geocode || '') ? `https://meteoalarm.org?geocode=EMMA_ID:${geocode}` : 'https://www.aemet.es/es/eltiempo/prediccion/avisos'
    const item = { id: `${entry.identifier}:${entry.areaDesc}:${type}`, identifier: entry.identifier, area: entry.areaDesc, event: entry.event, type, severity: entry.severity, level: rank[entry.severity], start, end, sent, certainty: entry.certainty || 'Unknown', zoneCode: zone?.code || null, municipalityCodes: zone?.codes || [], sourceUrl: link }
    warnings.set(item.id, item)
  }
  return { sourceUpdatedAt: Date.parse(feed.updated), warnings: [...warnings.values()], invalid }
}
function download() {
  return new Promise((resolve, reject) => {
    const req = https.get(FEED, { headers: { Accept: 'application/atom+xml', 'User-Agent': 'WeatherApp/1.0 (national-weather-watch)' } }, res => {
      if (res.statusCode !== 200) { res.resume(); reject(new Error('source-unavailable')); return }
      let size = 0; const chunks = []
      res.on('data', chunk => { size += chunk.length; if (size > 15 * 1024 * 1024) { reject(new Error('feed-too-large')); req.destroy() } else chunks.push(chunk) })
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      res.on('error', reject); res.on('aborted', () => reject(new Error('source-unavailable')))
    })
    const timer = setTimeout(() => { reject(new Error('source-timeout')); req.destroy() }, 12000)
    req.on('close', () => clearTimeout(timer)); req.on('error', reject)
  })
}
function createWatchService({ fetchFeed = download, now = Date.now } = {}) {
  let snapshot = null, pending = null, retryAt = 0
  async function refresh() {
    if (pending) return pending
    if (now() < retryAt) return
    pending = (async () => {
      try { const parsed = parseFeed(await fetchFeed()); snapshot = { ...parsed, checkedAt: now() }; retryAt = 0 }
      catch { retryAt = now() + 60000 }
      finally { pending = null }
    })()
    return pending
  }
  return async function getWatch() {
    if (!snapshot || now() - snapshot.checkedAt >= 180000) await refresh()
    const usable = snapshot && now() - snapshot.checkedAt < 30 * 60000
    const stale = !usable || now() - snapshot.checkedAt >= 180000 || now() - snapshot.sourceUpdatedAt >= 30 * 60000 || snapshot.invalid > 0
    // Every reply is a complete snapshot. Withdrawn/expired warnings never accumulate in cache.
    const warnings = usable ? snapshot.warnings.filter(w => w.end > now()).sort((a, b) => b.level - a.level || a.start - b.start || a.area.localeCompare(b.area)) : []
    return { status: usable ? stale ? 'stale' : 'ok' : 'unavailable', checkedAt: snapshot?.checkedAt || null, sourceUpdatedAt: snapshot?.sourceUpdatedAt || null, warnings,
      coverage: { scope: 'ES', municipalityCatalogueDate: catalogue.sourceDate, mappedMunicipalities: mappedCodes.size, unmappedMunicipalities, hydrology: 'not-integrated', source: catalogue.source },
      source: FEED, attribution: 'Fuente: AEMET / Meteoalarm (EUMETNET)', license: 'https://creativecommons.org/licenses/by/4.0/' }
  }
}
module.exports = { createWatchService, parseFeed, hazard }
