import axios from 'axios'
import config from '../keys/config'
import { scheduleProduct } from './requestScheduler'

const cache = new Map()
const pending = new Map()
const TTL = 10 * 60 * 1000
const BASE = '/aemet/opendata/api'

export class WeatherError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

// Only successful products are cached. Concurrent consumers share the same request.
export const clearWeatherCache = () => cache.clear()
export const requestProduct = (path, { text = false } = {}) => {
  const cached = cache.get(path)
  if (cached && cached.expires > Date.now()) return Promise.resolve(cached.response)
  if (pending.has(path)) return pending.get(path)
  const request = (async () => {
    const apiKey = config?.apiKey?.trim() || process.env.REACT_APP_AEMET_API_KEY?.trim()
    if (!apiKey) throw new WeatherError('configuration')
    try {
      await scheduleProduct()
      const metadata = await axios.get(`${BASE}/${path}`, {
        headers: { api_key: apiKey }, timeout: 15000,
      })
      const status = Number(metadata.data?.estado)
      if (status !== 200) throw new WeatherError(status === 429 ? 'limit' : status === 401 || status === 403 ? 'configuration' : 'unavailable')
      let url
      try { url = new URL(metadata.data.datos) } catch { throw new WeatherError('invalid') }
      if (url.protocol !== 'https:' || url.hostname !== 'opendata.aemet.es' || url.port || url.username || url.password || url.search || url.hash || !/^\/opendata\/sh\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname)) throw new WeatherError('invalid')
      const response = await axios.get(`/aemet${url.pathname}`, { timeout: 15000, responseType: text ? 'text' : 'json' })
      const days = response.data?.[0]?.prediccion?.dia
      const validDays = Array.isArray(days) && days.length > 0 && days.every(day =>
        typeof day.fecha === 'string' && /^\d{4}-\d{2}-\d{2}/.test(day.fecha) &&
        ['estadoCielo', 'precipitacion', 'nieve', 'vientoAndRachaMax', 'probPrecipitacion'].every(key => day[key] == null || Array.isArray(day[key])))
      if (text ? typeof response.data !== 'string' || !response.data.trim() : !Array.isArray(response.data) || !validDays) {
        throw new WeatherError('invalid')
      }
      if (cache.size >= 100) cache.delete(cache.keys().next().value)
      cache.set(path, { response, expires: Date.now() + TTL })
      return response
    } catch (error) {
      if (error instanceof WeatherError) throw error
      const status = error.response?.status
      throw new WeatherError(status === 429 ? 'limit' : status === 401 || status === 403 ? 'configuration' : 'unavailable')
    }
  })()
  pending.set(path, request)
  request.finally(() => pending.delete(path)).catch(() => {})
  return request
}

export const municipalityCode = code => {
  if (!/^\d{5}$/.test(String(code))) throw new WeatherError('invalid')
  return String(code)
}
