import { renderHook, act, waitFor } from '@testing-library/react'
import useMapWeather from './useMapWeather'
import { requestMap } from '../../resources/services/APIs/aemetClient'
jest.mock('../../resources/services/APIs/aemetClient', () => ({ requestMap: jest.fn() }))
beforeEach(() => jest.resetAllMocks())
test('requests a batch once and exposes stale fallback products', async () => {
  const samples = [{ code: '28079' }, { code: '44001' }]
  const product = { elaborado: '2026-11-09T10:00:00' }
  requestMap.mockResolvedValue({ '28079': { data: [product], stale: true }, '44001': { error: 'unavailable' } })
  const { result } = renderHook(() => useMapWeather(samples))
  await waitFor(() => expect(result.current.status).toBe('stale'))
  expect(result.current.data).toEqual({ '28079': product, '44001': null })
  expect(requestMap).toHaveBeenCalledTimes(1)
})
test('a late response from an old scope cannot overwrite the current map', async () => {
  let finish
  requestMap.mockImplementationOnce(() => new Promise(resolve => { finish = resolve })).mockResolvedValueOnce({ '44001': { data: [{ nombre: 'Ababuj' }] } })
  const { result, rerender } = renderHook(({ samples }) => useMapWeather(samples), { initialProps: { samples: [{ code: '28079' }] } })
  rerender({ samples: [{ code: '44001' }] })
  await waitFor(() => expect(result.current.data['44001']).toEqual({ nombre: 'Ababuj' }))
  await act(async () => finish({ '28079': { data: [{ nombre: 'Madrid' }] } }))
  expect(result.current.data['28079']).toBeUndefined()
})
