import React, { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { renderToStaticMarkup } from 'react-dom/server'
import { useTranslation } from 'react-i18next'
import { skyIconMap } from '../../utils/js/skyIcons'
import { displayValue } from '../forecast/model'
import { communities, provinces, referenceCities, overviewCities, townByCode } from './catalogue'
import { loadGeography, featureCentre } from './geography'
import useMapWeather, { mapForecast } from './useMapWeather'

const NATIONAL_BOUNDS = [[35.1, -9.6], [44.2, 4.5]]
export default function WeatherExplorer({ scope, onNavigate, offset, onOffset }) {
  const { t } = useTranslation()
  const container = useRef(null), inset = useRef(null), mainMap = useRef(null), islandMap = useRef(null)
  const shapes = useRef(null), markers = useRef(null), islandShapes = useRef(null), islandMarkers = useRef(null)
  const navigate = useRef(onNavigate)
  navigate.current = onNavigate
  const [geo, setGeo] = useState(null), [error, setError] = useState(false), [loading, setLoading] = useState(true), [retry, setRetry] = useState(0)
  const [sizeRevision, setSizeRevision] = useState(0)
  const [layoutRevision, setLayoutRevision] = useState(0)
  const [now, setNow] = useState(() => new Date())
  const communityCode = scope.community?.code, provinceCode = scope.province?.code, townCode = scope.town ? `${scope.town.CPRO}${scope.town.CMUN}` : null
  const { level } = scope
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(timer) }, [])
  useEffect(() => {
    const map = L.map(container.current, { zoomControl: false, scrollWheelZoom: false, minZoom: 4, maxZoom: 15, zoomSnap: 0.1, attributionControl: true })
    map.attributionControl.setPrefix(false)
    map.attributionControl.addAttribution('<a href="https://github.com/codeforgermany/click_that_hood">CartoDB / Click That Hood</a> · Municipios IGN / ArcGIS · AEMET')
    L.control.zoom({ position: 'topright' }).addTo(map)
    shapes.current = L.layerGroup().addTo(map); markers.current = L.layerGroup().addTo(map)
    mainMap.current = map
    map.on('moveend', () => setLayoutRevision(value => value + 1))
    const canaries = L.map(inset.current, { zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false, touchZoom: false, keyboard: false })
    canaries.fitBounds([[27.4, -18.4], [29.6, -13.3]])
    islandShapes.current = L.layerGroup().addTo(canaries); islandMarkers.current = L.layerGroup().addTo(canaries); islandMap.current = canaries
    map.fitBounds(NATIONAL_BOUNDS, { padding: [24, 24] })
    const observer = new ResizeObserver(() => { map.invalidateSize(); canaries.invalidateSize(); setSizeRevision(value => value + 1) })
    observer.observe(container.current)
    return () => { observer.disconnect(); map.remove(); canaries.remove(); mainMap.current = null }
  }, [])
  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => { controller.abort(); setLoading(false); setError(true) }, 15000)
    setLoading(true); setError(false); setGeo(null)
    shapes.current?.clearLayers(); markers.current?.clearLayers(); islandShapes.current?.clearLayers(); islandMarkers.current?.clearLayers()
    loadGeography(level, provinceCode, controller.signal).then(collection => {
      if (!controller.signal.aborted) setGeo(collection)
    }).catch(() => { if (!controller.signal.aborted) setError(true) }).finally(() => { clearTimeout(timer); if (!controller.signal.aborted) setLoading(false) })
    return () => { clearTimeout(timer); controller.abort() }
  }, [level, provinceCode, communityCode, retry])
  useEffect(() => {
    if (!geo || !mainMap.current) return
    shapes.current.clearLayers(); islandShapes.current.clearLayers()
    const features = geo.features.filter(feature => level === 'country' || (level === 'community' ? feature.properties.community === communityCode : level === 'town' ? feature.properties.code === townCode : true))
    const activate = feature => {
      const code = feature.properties.code
      const item = level === 'country' ? communities.find(item => item.code === code) : level === 'community' ? provinces.find(item => item.code === code) : townByCode.get(code)
      if (item) navigate.current(item, level === 'country' ? 'community' : level === 'community' ? 'province' : 'town')
    }
    const build = (list, group, interactive = true) => L.geoJSON({ type: 'FeatureCollection', features: list }, {
      style: { color: '#edf5e4', weight: level === 'province' ? 1 : 1.5, fillColor: '#8ebca8', fillOpacity: .96 },
      onEachFeature: (feature, layer) => {
        const label = document.createElement('span'); label.textContent = feature.properties.name
        layer.bindTooltip(label, { sticky: true, className: 'map-area-tooltip' })
        if (interactive) {
          layer.on('click', () => activate(feature))
          layer.on('mouseover', () => layer.setStyle({ fillColor: '#c0d8a5' }))
          layer.on('mouseout', () => layer.setStyle({ fillColor: '#8ebca8' }))
          layer.on('add', () => {
            const element = layer.getElement()
            if (!element) return
            element.setAttribute('tabindex', '0'); element.setAttribute('role', 'button'); element.setAttribute('aria-label', feature.properties.name)
            element.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(feature) } })
          })
        }
      },
    }).addTo(group)
    const mainland = level === 'country' ? features.filter(f => f.properties.code !== '05') : features
    const layer = build(mainland, shapes.current)
    if (level === 'country') {
      mainMap.current.fitBounds(NATIONAL_BOUNDS, { paddingTopLeft: [24, 60], paddingBottomRight: [24, container.current.clientWidth < 480 ? 155 : 24], animate: false })
      build(features.filter(f => f.properties.code === '05'), islandShapes.current)
      islandMap.current.invalidateSize(); islandMap.current.fitBounds([[27.4, -18.4], [29.6, -13.3]], { padding: [10, 10] })
    } else if (layer.getBounds().isValid()) {
      mainMap.current.fitBounds(layer.getBounds(), { padding: [60, 70], maxZoom: level === 'town' ? 12 : 9, animate: false })
    } else setError(true)
  }, [geo, level, communityCode, townCode, sizeRevision])
  const samples = useMemo(() => {
    if (level === 'country') return overviewCities
    if (level === 'community') return referenceCities.filter(city => city.town.CODAUTO === communityCode)
    if (!geo) return []
    const features = geo.features.filter(feature => townByCode.has(feature.properties.code) && (level !== 'town' || feature.properties.code === townCode))
    // A bounded sample of municipal products. Every municipality remains clickable.
    const chosen = level === 'town' ? features : features.filter((_, index) => index % Math.max(1, Math.ceil(features.length / 8)) === 0).slice(0, 8)
    return chosen.map(feature => ({ code: feature.properties.code, town: townByCode.get(feature.properties.code), ...featureCentre(feature) }))
  }, [level, communityCode, townCode, geo])
  const weather = useMapWeather(samples)
  useEffect(() => {
    if (!mainMap.current) return
    markers.current.clearLayers(); islandMarkers.current.clearLayers()
    const occupied = { main: [], islands: [] }
    samples.forEach(sample => {
      const isIsland = level === 'country' && sample.town.CODAUTO === '05'
      const targetMap = isIsland ? islandMap.current : mainMap.current
      const point = targetMap.latLngToContainerPoint([sample.lat, sample.lon])
      const positions = occupied[isIsland ? 'islands' : 'main']
      if (positions.some(other => Math.abs(other.x - point.x) < 100 && Math.abs(other.y - point.y) < 58)) return
      positions.push(point)
      const forecast = mapForecast(weather.data[sample.code], sample.code, offset, now)
      const icon = skyIconMap[forecast?.sky]
      const html = renderToStaticMarkup(<div className="tv-weather-pin"><div className="pin-reading"><span className="pin-sky">{icon ? icon(32, '#ffd875') : <span className="pin-unavailable">{weather.data[sample.code] === undefined ? '···' : '—'}</span>}</span><strong>{displayValue(forecast?.max, '°')}</strong><span className="pin-min">{displayValue(forecast?.min, '°')}</span></div><span className="pin-city">{sample.town.NAME}</span></div>)
      const islands = level === 'country' && sample.town.CODAUTO === '05'
      const layer = islands ? islandMarkers.current : markers.current
      const title = `${sample.town.NAME}: ${forecast ? `${forecast.date}, ${displayValue(forecast.max, '°')} / ${displayValue(forecast.min, '°')}` : t('MAP.noForecast')}`
      const marker = L.marker([sample.lat, sample.lon], { icon: L.divIcon({ html, className: 'weather-map-marker', iconSize: [112, 66], iconAnchor: [56, 33] }), title, keyboard: true, alt: title }).addTo(layer)
      const label = document.createElement('span')
      label.textContent = `${title}${forecast?.description ? ` · ${forecast.description} (${forecast.period} UTC)` : ''}${forecast?.issued ? ` · ${t('MAP.issued')} ${forecast.issued.replace('T', ' ')}` : ''}`
      marker.bindTooltip(label, { direction: 'top', className: 'map-weather-tooltip' })
      marker.on('click', () => {
        if (level === 'country') navigate.current(communities.find(item => item.code === sample.town.CODAUTO), 'community')
        else if (level === 'community') navigate.current(provinces.find(item => item.code === sample.town.CPRO), 'province')
        else navigate.current(sample.town, 'town')
      })
    })
  }, [samples, weather.data, offset, now, level, t, layoutRevision])
  return <section className="tv-map-card" aria-label={t('MAP.mapLabel')}>
    <div className="map-topbar"><div><span className="map-live-dot" /> AEMET <span className="map-top-separator">/</span> {t('MAP.dailyForecast')}</div><div className="map-day-switch" aria-label={t('MAP.day')}>{[0, 1, 2].map(day => <button key={day} aria-pressed={offset === day} onClick={() => onOffset(day)}>{t(`MAP.day${day}`)}</button>)}</div></div>
    <div className="map-stage">
      <div ref={container} className="tv-map-canvas" aria-label={t('MAP.mapLabel')} />
      <div className="canary-inset" hidden={level !== 'country'}><span>{t('MAP.canaries')}</span><div ref={inset} /><button onClick={() => onNavigate(communities.find(c => c.code === '05'), 'community')}>{t('MAP.exploreCanaries')} ↗</button></div>
      <div className="map-level-badge">{t(`MAP.${level}`)}<strong>{scope.town?.NAME || scope.province?.name || scope.community?.name || t('MAP.spain')}</strong></div>
      {loading && <div className="map-message" role="status">{t('MAP.loadingMap')}</div>}
      {error && <div className="map-message" role="alert">{t('FORECAST.mapError')} <button onClick={() => setRetry(v => v + 1)}>{t('FORECAST.refresh')}</button></div>}
    </div>
    <div className="map-bottom"><span><b className="legend-high">●</b> {t('MAP.high')} <b className="legend-low">●</b> {t('MAP.low')}</span><span role="status">{weather.status === 'loadingWeather' ? t('MAP.loadingWeather') : t('MAP.clickHint')}</span></div>
    {(['configuration', 'limit', 'unavailable'].includes(weather.status)) && <p className="map-error" role="alert">{t(`FORECAST.errors.${weather.status}`)} <button onClick={weather.retry}>{t('FORECAST.refresh')}</button></p>}
    {weather.status === 'stale' && <p className="map-error" role="status">{t('FORECAST.stale')}</p>}
    <p className="map-disclaimer">{t('MAP.representative')} {t('MAP.noDataLegend')}</p>
  </section>
}
