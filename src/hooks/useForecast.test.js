import { renderHook, waitFor, act } from '@testing-library/react'
import useForecast from './useForecast'
import { fetchHourlyPrediction } from '../resources/services/APIs/hourlyPrediction'
import { fetchDiaryPrediction } from '../resources/services/APIs/diaryPrediction'
jest.mock('../resources/services/APIs/hourlyPrediction', () => ({ fetchHourlyPrediction: jest.fn() }))
jest.mock('../resources/services/APIs/diaryPrediction', () => ({ fetchDiaryPrediction: jest.fn() }))
jest.mock('../resources/services/APIs/aemetClient', () => ({ clearWeatherCache: jest.fn() }))
beforeEach(() => jest.resetAllMocks())
test('keeps daily data when hourly data fails', async () => {
  fetchHourlyPrediction.mockRejectedValue({ code: 'unavailable' })
  fetchDiaryPrediction.mockResolvedValue({ data: [{ nombre: 'Madrid' }] })
  const { result } = renderHook(() => useForecast('28079'))
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.daily.nombre).toBe('Madrid')
  expect(result.current.errors).toEqual(['unavailable'])
})
test('ignores late responses after changing municipality', async () => {
  let resolveOld
  fetchHourlyPrediction.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve })).mockResolvedValue({ data: [{ nombre: 'New' }] })
  fetchDiaryPrediction.mockResolvedValue({ data: [{ nombre: 'Daily' }] })
  const { result, rerender } = renderHook(({ code }) => useForecast(code), { initialProps: { code: '28079' } })
  rerender({ code: '41091' })
  await waitFor(() => expect(result.current.hourly?.nombre).toBe('New'))
  await act(async () => resolveOld({ data: [{ nombre: 'Old' }] }))
  expect(result.current.hourly.nombre).toBe('New')
})
