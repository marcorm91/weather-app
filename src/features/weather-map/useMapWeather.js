import { useEffect, useState } from 'react'
import { requestMap } from '../../resources/services/APIs/aemetClient'
import { localClock, numberOrNull } from '../forecast/model'

export function mapForecast(product, code, offset, now = new Date()) {
  const localDate = localClock(code, now).date
  const date = new Date(Date.parse(`${localDate}T12:00:00Z`) + offset * 86400000).toISOString().slice(0, 10)
  const day = product?.prediccion?.dia?.find(item => item.fecha.slice(0, 10) === date)
  if (!day) return null
  const currentUtcHour = now.getUTCHours()
  const skies = (day.estadoCielo || []).filter(item => item.value && item.descripcion).filter(item => {
    if (offset !== 0 || !item.periodo) return true
    const [start, end] = item.periodo.split('-').map(Number)
    return start <= currentUtcHour && end > currentUtcHour
  }).sort((a, b) => {
    const width = item => { const [start, end] = (item.periodo || '00-24').split('-').map(Number); return end - start }
    return width(b) - width(a)
  })
  return { date, max: numberOrNull(day.temperatura?.maxima), min: numberOrNull(day.temperatura?.minima), sky: skies[0]?.value, description: skies[0]?.descripcion, period: skies[0]?.periodo || '00-24', issued: product.elaborado }
}
export default function useMapWeather(samples) {
  const [data, setData] = useState({})
  const [status, setStatus] = useState('')
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    let active = true
    setData({}); setStatus(samples.length ? 'loadingWeather' : '')
    let running = false
    const run = async () => {
      if (!samples.length || running) return
      running = true
      try {
        const products = await requestMap(samples.map(sample => sample.code))
        if (!active) return
        setData(Object.fromEntries(samples.map(sample => [sample.code, products[sample.code]?.data?.[0] || null])))
        setStatus(Object.values(products).some(product => product.stale) ? 'stale' :
          Object.values(products).some(product => product.error === 'configuration') ? 'configuration' :
          Object.values(products).some(product => product.error === 'limit') ? 'limit' : Object.values(products).some(product => product.error) ? 'unavailable' : '')
      } catch (error) { if (active) setStatus(error.code === 'configuration' || error.code === 'limit' ? error.code : 'unavailable') }
      finally { running = false }
    }
    run()
    const timer = setInterval(run, 60000)
    return () => { active = false; clearInterval(timer) }
  }, [samples, revision])
  return { data, status, retry: () => setRevision(value => value + 1) }
}
