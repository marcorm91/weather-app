import axios from 'axios'
import config from '../keys/config'

const cache = new Map()
const pending = new Map()
const TTL = 10 * 60 * 1000
const BASE = '/aemet'

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
    try {
      const result = await axios.get(`${BASE}/product`, {
        params: { path }, headers: apiKey ? { api_key: apiKey } : {}, timeout: 240000,
      })
      const response = { data: result.data.data, stale: result.data.stale, fetchedAt: result.data.fetchedAt }
      const days = response.data?.[0]?.prediccion?.dia
      const validDays = Array.isArray(days) && days.length > 0 && days.every(day =>
        typeof day.fecha === 'string' && /^\d{4}-\d{2}-\d{2}/.test(day.fecha) &&
        ['estadoCielo', 'precipitacion', 'nieve', 'vientoAndRachaMax', 'probPrecipitacion'].every(key => day[key] == null || Array.isArray(day[key])))
      if (text ? typeof response.data !== 'string' || !response.data.trim() : !Array.isArray(response.data) || !validDays) {
        throw new WeatherError('invalid')
      }
      if (cache.size >= 100) cache.delete(cache.keys().next().value)
      cache.set(path, { response, expires: Date.now() + (response.stale ? 30000 : TTL) })
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

export const requestMap = async codes => {
  const apiKey = config?.apiKey?.trim() || process.env.REACT_APP_AEMET_API_KEY?.trim()
  try {
    const response = await axios.get(`${BASE}/map`, {
      params: { codes: [...new Set(codes)].sort().join(',') },
      headers: apiKey ? { api_key: apiKey } : {}, timeout: 240000,
    })
    if (!response.data?.products) throw new WeatherError('invalid')
    return response.data.products
  } catch (error) {
    if (error instanceof WeatherError) throw error
    throw new WeatherError(error.response?.data?.code || 'unavailable')
  }
}
