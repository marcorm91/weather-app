import { useEffect, useState, useCallback } from 'react'
import { fetchHourlyPrediction } from '../resources/services/APIs/hourlyPrediction'
import { fetchDiaryPrediction } from '../resources/services/APIs/diaryPrediction'
import { clearWeatherCache } from '../resources/services/APIs/aemetClient'

export default function useForecast(code) {
  const [state, setState] = useState({ code: null, loading: false, hourly: null, daily: null, errors: [] })
  const [revision, setRevision] = useState(0)
  const refresh = useCallback(() => { clearWeatherCache(); setRevision(value => value + 1) }, [])
  useEffect(() => {
    if (!code) return
    let active = true
    setState({ code, loading: true, hourly: null, daily: null, errors: [] })
    Promise.allSettled([fetchHourlyPrediction(code), fetchDiaryPrediction(code)]).then(results => {
      if (!active) return
      setState({ code, loading: false,
        hourly: results[0].status === 'fulfilled' ? results[0].value.data[0] : null,
        daily: results[1].status === 'fulfilled' ? results[1].value.data[0] : null,
        stale: results.some(result => result.status === 'fulfilled' && result.value.stale),
        fetchedAt: Math.min(...results.filter(result => result.status === 'fulfilled').map(result => result.value.fetchedAt).filter(Number.isFinite)),
        errors: results.filter(result => result.status === 'rejected').map(result => result.reason.code || 'unavailable'),
      })
    })
    const timer = setInterval(() => setRevision(value => value + 1), 10 * 60 * 1000)
    return () => { active = false; clearInterval(timer) }
  }, [code, revision])
  return { ...(state.code === code ? state : { loading: !!code, hourly: null, daily: null, errors: [] }), refresh }
}
