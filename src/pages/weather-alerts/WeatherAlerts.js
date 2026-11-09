import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import WatchMap from '../../features/watch/WatchMap'
import { watchCopy } from '../../features/watch/copy'
import { visibleWarnings, associatedTowns } from '../../features/watch/model'
import { provinces, townByCode, normalize } from '../../features/weather-map/catalogue'
import '../../features/watch/watch.css'
const ranks = { 2: 'Moderate', 3: 'Severe', 4: 'Extreme' }
export default function WeatherAlerts() {
  const { i18n } = useTranslation(), copy = watchCopy(i18n.language)
  const [params, setParams] = useSearchParams()
  const [snapshot, setSnapshot] = useState(null), [loading, setLoading] = useState(true), [revision, setRevision] = useState(0)
  const [now, setNow] = useState(Date.now()), [query, setQuery] = useState(''), [province, setProvince] = useState(''), [period, setPeriod] = useState('any'), [tab, setTab] = useState('towns'), [page, setPage] = useState(0), [floodLayer, setFloodLayer] = useState(false)
  const selectedCode = params.get('municipio'), selectedTown = townByCode.get(selectedCode)
  useEffect(() => {
    let active = true, running = false
    const controller = new AbortController()
    const run = async () => {
      if (running) return
      running = true
      try {
        const response = await fetch('/aemet/watch', { signal: controller.signal })
        if (!response.ok) throw new Error()
        const result = await response.json()
        if (!['ok', 'stale', 'unavailable'].includes(result.status) || !Array.isArray(result.warnings)) throw new Error()
        if (active) { setSnapshot(result); setNow(Date.now()) }
      } catch { if (active) setSnapshot(previous => previous ? { ...previous, status: 'stale' } : { status: 'unavailable', warnings: [] }) }
      finally { running = false; if (active) setLoading(false) }
    }
    run()
    const timer = setInterval(run, 60000), clock = setInterval(() => setNow(Date.now()), 15000)
    return () => { active = false; controller.abort(); clearInterval(timer); clearInterval(clock) }
  }, [revision])
  useEffect(() => setPage(0), [query, province, period, tab, selectedCode])
  const effectiveSnapshot = useMemo(() => snapshot && snapshot.checkedAt && now - snapshot.checkedAt >= 30 * 60000 ? { ...snapshot, status: 'unavailable' } : snapshot, [snapshot, now])
  const warnings = useMemo(() => visibleWarnings(effectiveSnapshot, now, period), [effectiveSnapshot, now, period])
  const towns = useMemo(() => associatedTowns(warnings, query, province), [warnings, query, province])
  const selectedWarnings = warnings.filter(w => w.municipalityCodes.includes(selectedCode))
  const selectedZones = useMemo(() => [...new Set(warnings.filter(w => w.municipalityCodes.includes(selectedCode)).map(w => w.zoneCode).filter(Boolean))], [warnings, selectedCode])
  const zoneRows = warnings.filter(w => (!query || normalize(w.area).includes(normalize(query))) && (!province || w.municipalityCodes.some(code => code.slice(0, 2) === province)))
  const rows = selectedTown ? selectedWarnings : tab === 'towns' ? towns : zoneRows
  const currentPage = Math.min(page, Math.max(0, Math.ceil(rows.length / 24) - 1))
  const date = value => value ? new Date(value).toLocaleString(i18n.language) : '—'
  const card = warning => <article className={`watch-warning level-${warning.level}`} key={warning.id}>
    <div><span className={`watch-badge level-${warning.level}`}>{copy[warning.severity]}</span> <strong>{copy[warning.type]}</strong></div>
    <h3>{warning.area}</h3><p>{warning.event}</p>
    <p><b>{warning.start > now ? copy.future : copy.active}</b> · {copy.from}: {date(warning.start)}<br />{copy.until}: {date(warning.end)}</p>
    <p>{copy.certainty}: {copy[warning.certainty] || warning.certainty}</p><small>{copy.issued}: {date(warning.sent)}</small><a href={warning.sourceUrl} target="_blank" rel="noreferrer">{copy.source} ↗</a>
  </article>
  return <main className="weather-page watch-page" id="main-content">
    <header className="watch-header"><div><p className="watch-eyebrow">{copy.scope}</p><h1>{copy.title}</h1><p>{copy.intro}</p></div><button className="weather-button" onClick={() => setRevision(v => v + 1)}>{copy.retry}</button></header>
    {loading && <p role="status">{copy.loading}</p>}
    {effectiveSnapshot?.status !== 'ok' && !loading && <p className="watch-status" role="alert">{effectiveSnapshot?.status === 'unavailable' ? copy.unavailable : copy.stale} <a href="https://www.aemet.es/es/eltiempo/prediccion/avisos" target="_blank" rel="noreferrer">{copy.official}</a></p>}
    <p className="watch-context">{copy.hydro}</p>
    <div className="watch-stats"><article><strong>{effectiveSnapshot?.status === 'unavailable' || loading ? '—' : warnings.length}</strong>{copy.warningCount}</article><article><strong>{effectiveSnapshot?.status === 'unavailable' || loading ? '—' : associatedTowns(warnings).length}</strong>{copy.townCount}</article><article><strong>{effectiveSnapshot?.status === 'unavailable' || loading ? '—' : warnings.filter(w => !w.zoneCode).length}</strong>{copy.unknown}</article></div>
    <p className="watch-timestamps">{copy.checked}: {date(snapshot?.checkedAt)} · {copy.updated}: {date(snapshot?.sourceUpdatedAt)}<br />{copy.local}</p>
    <div className="watch-filters"><label>{copy.search}<input type="search" value={query} onChange={e => { setQuery(e.target.value); setParams({}) }} /></label><label>{copy.province}<select value={province} onChange={e => { setProvince(e.target.value); setParams({}) }}><option value="">{copy.all}</option>{provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}</select></label><label>{copy.period}<select value={period} onChange={e => setPeriod(e.target.value)}>{['any', 'active', 'future'].map(value => <option key={value} value={value}>{copy[value]}</option>)}</select></label></div>
    {selectedTown && snapshot?.coverage?.unmappedMunicipalities?.includes(selectedCode) && <p className="watch-status" role="status">{copy.unknownTown}</p>}
    {selectedTown && <div className="watch-selected"><h2>{copy.selected} {selectedTown.NAME}</h2><button className="weather-button" onClick={() => setParams({})}>{copy.back}</button></div>}
    <WatchMap warnings={warnings} selectedZones={selectedZones} floodLayer={floodLayer} copy={copy} />
    <section className="watch-layer"><label><input type="checkbox" checked={floodLayer} onChange={e => setFloodLayer(e.target.checked)} /> {copy.floodLayer}</label><p>{copy.floodNote}</p></section>
    <p className="watch-context">{copy.mapping}</p>
    {!selectedTown && <div className="watch-tabs">{['towns', 'zones'].map(value => <button key={value} aria-pressed={tab === value} onClick={() => setTab(value)}>{copy[value]}</button>)}</div>}
    {!rows.length && !loading && effectiveSnapshot?.status !== 'unavailable' && <p className="watch-status">{copy.empty}</p>}
    {selectedTown || tab === 'zones' ? <div className="watch-warning-grid">{rows.slice(currentPage * 24, (currentPage + 1) * 24).map(card)}</div> : <ul className="watch-town-list">{rows.slice(currentPage * 24, (currentPage + 1) * 24).map(row => <li key={row.code}><button onClick={() => setParams({ municipio: row.code })}><span><strong>{row.town.NAME}</strong><small>{row.town.PROV}</small></span><span className={`watch-badge level-${row.level}`}>{copy[ranks[row.level]]}</span><span aria-hidden="true">→</span></button></li>)}</ul>}
    {rows.length > 24 && <nav className="watch-pagination" aria-label={copy.towns}><button className="weather-button" disabled={!currentPage} onClick={() => setPage(currentPage - 1)}>{copy.previous}</button><span>{currentPage + 1} / {Math.ceil(rows.length / 24)}</span><button className="weather-button" disabled={(currentPage + 1) * 24 >= rows.length} onClick={() => setPage(currentPage + 1)}>{copy.next}</button></nav>}
    <p className="watch-context">{copy.unknownZones}</p>
    <section className="watch-coverage"><h2>{copy.coverage}</h2><p>{copy.unverified}: {(snapshot?.coverage?.unmappedMunicipalities || []).map(code => townByCode.get(code)?.NAME || code).join(', ') || '—'}</p><p>{copy.hydro}</p><p><a href="https://www.miteco.gob.es/es/agua/temas/evaluacion-de-los-recursos-hidricos/saih.html" target="_blank" rel="noreferrer">{copy.hydroLink} ↗</a></p><p>{copy.noNotifications}</p><p>Fuente: AEMET / Meteoalarm (EUMETNET) · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a> · <a href="https://www.aemet.es/documentos/es/eltiempo/prediccion/avisos/plan_meteoalerta/detalle_municipios_zonas_meteorologicas.pdf" target="_blank" rel="noreferrer">AEMET · 2017</a> · <a href="https://sig.miteco.gob.es/snczi/" target="_blank" rel="noreferrer">SNCZI</a></p><Link to="/">← {i18n.language.startsWith('es') ? 'Volver al mapa del tiempo' : 'Back to the weather map'}</Link></section>
  </main>
}
