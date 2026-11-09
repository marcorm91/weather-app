import axios from 'axios'
import { clearWeatherCache, requestProduct, municipalityCode } from './aemetClient'
jest.mock('axios', () => ({ get: jest.fn() }))
const product = [{ prediccion: { dia: [{ fecha: '2026-11-09' }] } }]
const metadata = { data: { estado: 200, datos: 'https://opendata.aemet.es/opendata/sh/forecast' } }
beforeEach(() => { clearWeatherCache(); jest.resetAllMocks(); process.env.REACT_APP_AEMET_API_KEY = 'test-key' })
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
test.each(['http://opendata.aemet.es/data', 'https://example.com/data', 'broken'])('rejects untrusted datos URL %s', async url => {
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
