import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import towns from '../../resources/services/code_towns.json'
import { normalizeName } from './TownPicker'
import { getNameFromCoordinates } from '../../resources/services/APIs/geoService'

export const matchTown = address => {
  if (address?.country_code !== 'es') return null
  const names = [address.city, address.town, address.village, address.municipality].filter(Boolean).map(normalizeName)
  const provinces = [address.province, address.state_district].filter(Boolean).map(normalizeName)
  const candidates = towns.filter(town => town.NAME.split('/').some(name => names.includes(normalizeName(name))))
  const regional = candidates.filter(town => town.PROV.split('/').some(province => provinces.includes(normalizeName(province))))
  return regional.length === 1 ? regional[0] : candidates.length === 1 ? candidates[0] : null
}
export default function LocateTown({ onSelect }) {
  const { t } = useTranslation()
  const [status, setStatus] = useState('')
  const request = useRef(null)
  useEffect(() => () => request.current?.abort(), [])
  const locate = () => {
    if (!navigator.geolocation) { setStatus('geoError'); return }
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setStatus('locating')
    navigator.geolocation.getCurrentPosition(async position => {
      if (controller.signal.aborted) return
      const timeout = setTimeout(() => { controller.abort(); setStatus('geoError') }, 15000)
      try {
        const data = await getNameFromCoordinates(position.coords.latitude, position.coords.longitude, controller.signal)
        const town = matchTown(data.address)
        if (!town) throw new Error('geolocation')
        if (!controller.signal.aborted) { onSelect(town); setStatus('') }
      } catch { if (!controller.signal.aborted) setStatus('geoError') }
      finally { clearTimeout(timeout) }
    }, () => { if (!controller.signal.aborted) setStatus('geoError') }, { timeout: 10000, maximumAge: 300000 })
  }
  return <div className="weather-toolbar"><button className="weather-button" disabled={status === 'locating'} onClick={locate}>{t('FORECAST.locate')}</button>{status && <span role="status">{t(`FORECAST.${status}`)}</span>}</div>
}
