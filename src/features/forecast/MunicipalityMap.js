import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslation } from 'react-i18next'
import { getMunicipalityByCPROCMUN } from '../../resources/services/APIs/geoService'
export default function MunicipalityMap({ town }) {
  const container = useRef(null)
  const [status, setStatus] = useState('loading')
  const [retry, setRetry] = useState(0)
  const { t } = useTranslation()
  const { CPRO, CMUN } = town
  useEffect(() => {
    const controller = new AbortController()
    const map = L.map(container.current).setView([40, -4], 5)
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 18 }).addTo(map)
    tiles.on('tileerror', () => setStatus('mapError'))
    setStatus('loading')
    const timeout = setTimeout(() => { controller.abort(); setStatus('mapError') }, 15000)
    getMunicipalityByCPROCMUN(CPRO, CMUN, controller.signal).then(feature => {
      if (controller.signal.aborted) return
      const layer = L.geoJSON(feature, { style: { color: '#164b67', weight: 2 } }).addTo(map)
      map.fitBounds(layer.getBounds(), { padding: [20, 20] })
      setStatus('ready')
    }).catch(() => { if (!controller.signal.aborted) setStatus('mapError') }).finally(() => clearTimeout(timeout))
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => map.invalidateSize()) : null
    observer?.observe(container.current)
    return () => { clearTimeout(timeout); controller.abort(); observer?.disconnect(); map.remove() }
  }, [CPRO, CMUN, retry])
  return <section className="weather-map-card"><h2>{t('FORECAST.map')}</h2><p>{town.NAME} · {t('FORECAST.mapNote')}</p>
    {status !== 'ready' && <p role="status">{t(`FORECAST.${status}`)} {status === 'mapError' && <button className="weather-button" onClick={() => setRetry(value => value + 1)}>{t('FORECAST.refresh')}</button>}</p>}
    <div className="weather-map" ref={container} aria-label={`${t('FORECAST.map')} ${town.NAME}`} />
  </section>
}
