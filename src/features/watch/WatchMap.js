import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
const colors = { 2: '#ffd451', 3: '#ed932c', 4: '#cf3449' }
export default function WatchMap({ warnings, selectedZones, floodLayer, copy }) {
  const lastView = useRef(null), viewBounds = useRef(null)
  const host = useRef(null), map = useRef(null), shapes = useRef(null), flood = useRef(null)
  const [geometry, setGeometry] = useState(null), [error, setError] = useState(false), [layerError, setLayerError] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    fetch(`${process.env.PUBLIC_URL || ''}/maps/warning-zones.geojson`, { signal: controller.signal }).then(r => { if (!r.ok) throw new Error(); return r.json() }).then(setGeometry).catch(() => { if (!controller.signal.aborted) setError(true) })
    const instance = L.map(host.current, { scrollWheelZoom: false, zoomSnap: .1 }).fitBounds([[27, -18.5], [44.1, 4.5]])
    map.current = instance; shapes.current = L.layerGroup().addTo(instance)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap contributors' }).addTo(instance)
    flood.current = L.tileLayer.wms('https://servicios.idee.es/wms-inspire/riesgos-naturales/inundaciones', { layers: 'NZ.Flood.FluvialT100', format: 'image/png', transparent: true, version: '1.1.1', minZoom: 8, opacity: .65, attribution: 'SNCZI · MITECO / IGN' })
    flood.current.on('tileerror', () => setLayerError(true))
    instance.attributionControl.addAttribution('Zonas: AEMET / IGN (2018)')
    const observer = new ResizeObserver(() => {
      instance.invalidateSize()
      if (viewBounds.current) instance.fitBounds(viewBounds.current, { padding: [15, 15], maxZoom: 10, animate: false })
    }); observer.observe(host.current)
    return () => { controller.abort(); observer.disconnect(); instance.remove(); map.current = null }
  }, [])
  useEffect(() => {
    if (!map.current || !geometry) return
    shapes.current.clearLayers()
    const levels = new Map()
    for (const warning of warnings) if (warning.zoneCode) levels.set(warning.zoneCode, Math.max(levels.get(warning.zoneCode) || 0, warning.level))
    const layer = L.geoJSON(geometry, {
      style: feature => ({ color: '#405e70', weight: 1, fillColor: colors[levels.get(feature.properties.code)] || '#9daeb5', fillOpacity: levels.has(feature.properties.code) ? .5 : .12 }),
      onEachFeature: (feature, polygon) => { const text = document.createElement('span'); text.textContent = feature.properties.name; polygon.bindTooltip(text) },
    }).addTo(shapes.current)
    const viewKey = selectedZones.join(',')
    if (lastView.current === viewKey) return
    lastView.current = viewKey
    if (selectedZones.length) {
      const selected = L.geoJSON({ type: 'FeatureCollection', features: geometry.features.filter(f => selectedZones.includes(f.properties.code)) })
      if (selected.getBounds().isValid()) {
        viewBounds.current = selected.getBounds()
        map.current.fitBounds(viewBounds.current, { padding: [30, 30], maxZoom: 10, animate: false })
      }
    } else if (layer.getBounds().isValid()) {
      viewBounds.current = layer.getBounds()
      map.current.fitBounds(viewBounds.current, { padding: [15, 15], animate: false })
    }
  }, [geometry, warnings, selectedZones])
  useEffect(() => {
    if (!map.current) return
    setLayerError(false)
    if (floodLayer) flood.current.addTo(map.current)
    else flood.current.remove()
  }, [floodLayer])
  return <section className="watch-map"><div ref={host} className="watch-map-canvas" aria-label={copy.mapLabel} />{error && <p role="alert">{copy.mapError}</p>}{layerError && floodLayer && <p role="alert">{copy.layerError}</p>}<p>{copy.mapLegend}</p></section>
}
