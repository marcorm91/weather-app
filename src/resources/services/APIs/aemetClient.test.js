import axios from 'axios'
import config from '../keys/config'
import { clearWeatherCache, requestProduct, municipalityCode } from './aemetClient'
jest.mock('../keys/config', () => ({ __esModule: true, default: { apiKey: '' } }))
jest.mock('axios', () => ({ get: jest.fn() }))
const product = [{ prediccion: { dia: [{ fecha: '2026-11-09' }] } }]
const metadata = { data: { estado: 200, datos: 'https://opendata.aemet.es/opendata/sh/forecast' } }
beforeEach(() => { clearWeatherCache(); jest.resetAllMocks(); config.apiKey = ''; process.env.REACT_APP_AEMET_API_KEY = 'test-key' })
test('shares concurrent requests, follows datos once, then reuses cached product', async () => {
  axios.get.mockResolvedValueOnce(metadata).mockResolvedValueOnce({ data: product })
  const [a, b] = await Promise.all([requestProduct('test'), requestProduct('test')])
  expect(a).toBe(b); await requestProduct('test'); expect(axios.get).toHaveBeenCalledTimes(2)
})
test('does not cache 429 and allows explicit retry', async () => {
  axios.get.mockResolvedValueOnce({ data: { estado: 429 } })
  await expect(requestProduct('test')).rejects.toMatchObject({ code: 'limit' })
  axios.get.mockResolvedValueOnce(metadata).mockResolvedValueOnce({ data: product })
  await expect(requestProduct('test')).resolves.toEqual({ data: product })
})
test('missing configuration fails without network requests', async () => {
  delete process.env.REACT_APP_AEMET_API_KEY
  await expect(requestProduct('test')).rejects.toMatchObject({ code: 'configuration' })
  expect(axios.get).not.toHaveBeenCalled()
})
test.each(['http://opendata.aemet.es/data', 'https://example.com/data', 'https://opendata.aemet.es/other/path', 'https://opendata.aemet.es:8443/opendata/sh/id', 'https://user:pass@opendata.aemet.es/opendata/sh/id', 'https://opendata.aemet.es/opendata/sh/id?key=test', 'broken'])('rejects untrusted datos URL %s', async url => {
  axios.get.mockResolvedValueOnce({ data: { estado: 200, datos: url } })
  await expect(requestProduct('test')).rejects.toMatchObject({ code: 'invalid' })
  expect(axios.get).toHaveBeenCalledTimes(1)
})
test('rejects malformed products and invalid municipality codes', async () => {
  axios.get.mockResolvedValueOnce(metadata).mockResolvedValueOnce({ data: {} })
  await expect(requestProduct('test')).rejects.toMatchObject({ code: 'invalid' })
  expect(() => municipalityCode('undefinedundefined')).toThrow()
})
test('expires cached products after ten minutes', async () => {
  const clock = jest.spyOn(Date, 'now').mockReturnValue(0)
  axios.get.mockResolvedValueOnce(metadata).mockResolvedValueOnce({ data: product })
  await requestProduct('test')
  clock.mockReturnValue(600001)
  axios.get.mockResolvedValueOnce(metadata).mockResolvedValueOnce({ data: product })
  await requestProduct('test'); expect(axios.get).toHaveBeenCalledTimes(4)
  clock.mockRestore()
})

test('uses the existing config.js key and the Swagger api_key header only on the first request', async () => {
  config.apiKey = ' local-config-key '
  axios.get.mockResolvedValueOnce(metadata).mockResolvedValueOnce({ data: product })
  await requestProduct('prediccion/especifica/municipio/horaria/28079')
  expect(axios.get).toHaveBeenNthCalledWith(1,
    '/aemet/opendata/api/prediccion/especifica/municipio/horaria/28079',
    { headers: { api_key: 'local-config-key' }, timeout: 15000 })
  expect(axios.get).toHaveBeenNthCalledWith(2, '/aemet/opendata/sh/forecast',
    { timeout: 15000, responseType: 'json' })
})
test('uses the environment key when config.js is empty', async () => {
  axios.get.mockResolvedValueOnce(metadata).mockResolvedValueOnce({ data: product })
  await requestProduct('test')
  expect(axios.get.mock.calls[0][1].headers.api_key).toBe('test-key')
})
test.each([401, 403])('classifies AEMET envelope status %i as a configuration error', async status => {
  axios.get.mockResolvedValueOnce({ data: { estado: status } })
  await expect(requestProduct('test')).rejects.toMatchObject({ code: 'configuration' })
  expect(axios.get).toHaveBeenCalledTimes(1)
})
