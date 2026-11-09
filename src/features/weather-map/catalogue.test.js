import { communities, provinces, referenceCities, townByCode, resolveScope, scopeParams, searchTowns } from './catalogue'
import { mapForecast } from './useMapWeather'
jest.mock('../../resources/services/APIs/diaryPrediction', () => ({ fetchDiaryPrediction: jest.fn() }))
test('all reference cities and administrative levels resolve through INE codes', () => {
  expect(communities).toHaveLength(19); expect(provinces).toHaveLength(52); expect(referenceCities).toHaveLength(52)
  for (const province of provinces) expect(communities.some(c => c.code === province.community)).toBe(true)
})
test('drills through community, province and municipality and restores scope from URLs', () => {
  const aragon = communities.find(c => c.code === '02'), teruel = provinces.find(p => p.code === '44'), town = townByCode.get('44001')
  expect(resolveScope(new URLSearchParams(scopeParams(aragon, 'community'))).level).toBe('community')
  expect(resolveScope(new URLSearchParams(scopeParams(teruel, 'province'))).community.code).toBe('02')
  expect(resolveScope(new URLSearchParams(scopeParams(town, 'town')))).toMatchObject({ level: 'town', town: { NAME: 'Ababuj' }, province: { code: '44' } })
  expect(resolveScope(new URLSearchParams('municipio=bad&provincia=bad')).level).toBe('country')
  expect(scopeParams(null, 'country')).toEqual({})
})
test('search matches accents and ranks exact municipality names first', () => {
  expect(searchTowns('malaga')[0].NAME).toBe('Málaga')
  expect(searchTowns('a')).toEqual([])
})
test('map forecasts use daily extrema and correct day, preserving zero and missing skies', () => {
  const product = { elaborado: '2026-11-09T12:00:00', prediccion: { dia: [
    { fecha: '2026-11-09', temperatura: { maxima: 0, minima: -5 }, estadoCielo: [{ periodo: '00-12', value: '11', descripcion: 'Despejado' }, { periodo: '12-24', value: '14', descripcion: 'Nuboso' }] },
    { fecha: '2026-11-10', temperatura: { maxima: 10, minima: 2 }, estadoCielo: [] },
  ] } }
  const today = mapForecast(product, '44001', 0, new Date('2026-11-09T15:00:00Z'))
  expect(today).toMatchObject({ max: 0, min: -5, sky: '14', period: '12-24' })
  expect(mapForecast(product, '44001', 1, new Date('2026-11-09T15:00:00Z'))).toMatchObject({ date: '2026-11-10', max: 10, sky: undefined })
  expect(mapForecast(product, '44001', 2, new Date('2026-11-09T15:00:00Z'))).toBeNull()
})
