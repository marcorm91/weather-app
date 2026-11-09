import axios from 'axios'
import config from '../keys/config'
import { clearWeatherCache, requestProduct, requestMap, municipalityCode } from './aemetClient'
jest.mock('../keys/config', () => ({ __esModule: true, default: { apiKey: '' } }))
jest.mock('axios', () => ({ get: jest.fn() }))
const product = [{ prediccion: { dia: [{ fecha: '2026-11-09' }] } }]
const result = { data: { data: product, stale: false, fetchedAt: 1234 } }
beforeEach(() => { clearWeatherCache(); jest.resetAllMocks(); config.apiKey = ''; delete process.env.REACT_APP_AEMET_API_KEY })
test('shares concurrent product requests and receives data in one backend call', async () => {
  axios.get.mockResolvedValue(result)
  const [a, b] = await Promise.all([requestProduct('test'), requestProduct('test')])
  expect(a).toBe(b); await requestProduct('test'); expect(axios.get).toHaveBeenCalledTimes(1)
  expect(a.data).toEqual(product)
})
test('server-side keys work without any browser configuration', async () => {
  axios.get.mockResolvedValue(result)
  await requestProduct('test')
  expect(axios.get.mock.calls[0][1].headers).toEqual({})
})
test('legacy config.js takes priority over the browser environment fallback', async () => {
  config.apiKey = ' local-key '; process.env.REACT_APP_AEMET_API_KEY = 'other-key'
  axios.get.mockResolvedValue(result)
  await requestProduct('test')
  expect(axios.get.mock.calls[0][1].headers).toEqual({ api_key: 'local-key' })
})
test.each([[401, 'configuration'], [403, 'configuration'], [429, 'limit'], [503, 'unavailable']])('classifies server status %i without caching failures', async (status, code) => {
  axios.get.mockRejectedValueOnce({ response: { status } }).mockResolvedValueOnce(result)
  await expect(requestProduct('test')).rejects.toMatchObject({ code })
  await expect(requestProduct('test')).resolves.toMatchObject({ data: product })
})
test('validates products and codes', async () => {
  axios.get.mockResolvedValueOnce({ data: { data: {} } })
  await expect(requestProduct('test')).rejects.toMatchObject({ code: 'invalid' })
  expect(() => municipalityCode('undefinedundefined')).toThrow()
})
test('retains stale age and retries it after 30 seconds instead of ten minutes', async () => {
  const clock = jest.spyOn(Date, 'now').mockReturnValue(0)
  axios.get.mockResolvedValue({ data: { ...result.data, stale: true } })
  expect(await requestProduct('test')).toMatchObject({ stale: true, fetchedAt: 1234 })
  clock.mockReturnValue(30001); await requestProduct('test')
  expect(axios.get).toHaveBeenCalledTimes(2); clock.mockRestore()
})
test('expires fresh browser data after ten minutes', async () => {
  const clock = jest.spyOn(Date, 'now').mockReturnValue(0)
  axios.get.mockResolvedValue(result)
  await requestProduct('test'); clock.mockReturnValue(600001); await requestProduct('test')
  expect(axios.get).toHaveBeenCalledTimes(2); clock.mockRestore()
})
test('loads the entire map with one request and preserves partial errors', async () => {
  const products = { '28079': result.data, '44001': { error: 'unavailable' } }
  axios.get.mockResolvedValue({ data: { products } })
  expect(await requestMap(['44001', '28079', '44001'])).toEqual(products)
  expect(axios.get).toHaveBeenCalledTimes(1)
  expect(axios.get.mock.calls[0][1].params.codes).toBe('28079,44001')
})
