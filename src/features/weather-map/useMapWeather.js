import { useEffect, useState } from 'react'
import { fetchDiaryPrediction } from '../../resources/services/APIs/diaryPrediction'
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
    const run = async () => {
      for (const sample of samples) {
        if (!active) return
        try {
          const response = await fetchDiaryPrediction(sample.code)
          if (!active) return
          setData(previous => ({ ...previous, [sample.code]: response.data[0] }))
        } catch (error) {
          if (!active) return
          setData(previous => ({ ...previous, [sample.code]: null }))
          if (error.code === 'configuration' || error.code === 'limit') { setStatus(error.code); return }
        }
      }
      if (active) setStatus('')
    }
    run()
    return () => { active = false }
  }, [samples, revision])
  return { data, status, retry: () => setRevision(value => value + 1) }
}
