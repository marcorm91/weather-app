import { localClock, numberOrNull, hourlyRows, forecastModel, dailyPeriods } from './model'
const product = { prediccion: { dia: [{ fecha: '2026-11-09T00:00:00',
  temperatura: [{ periodo: '16', value: '0' }, { periodo: '17', value: '12' }],
  humedadRelativa: [{ periodo: '17', value: '60' }],
  precipitacion: [{ periodo: '16', value: 'Ip' }],
  vientoAndRachaMax: [{ periodo: '16', velocidad: ['0'], direccion: ['C'] }, { periodo: '16', value: '4' }],
}] } }
test('uses municipality time including Canary daylight saving and date boundaries', () => {
  expect(localClock('28079', new Date('2026-07-01T22:30:00Z'))).toEqual({ date: '2026-07-02', hour: '00' })
  expect(localClock('35016', new Date('2026-07-01T22:30:00Z'))).toEqual({ date: '2026-07-01', hour: '23' })
  expect(localClock('38038', new Date('2026-11-09T16:30:00Z')).hour).toBe('16')
})
test('joins values by period, handles interleaved gusts, preserves zero and trace rain', () => {
  const [row] = hourlyRows(product)
  expect(row).toMatchObject({ temperature: 0, humidity: null, rain: 'Ip', wind: 0, direction: 'C', gust: 4 })
})
test('does not label past hours as current and supports partial daily-only products', () => {
  const now = new Date('2026-11-09T16:30:00Z')
  expect(forecastModel(product, null, '28079', now).current.hour).toBe('17')
  expect(forecastModel(product, null, '28079', new Date('2026-11-10T00:00:00Z')).current).toBeNull()
  expect(forecastModel(null, { prediccion: { dia: [{ fecha: '2026-11-09T00:00:00' }] } }, '28079', now).days).toHaveLength(1)
})
test('normalizes hour 24 at month boundary', () => {
  const [row] = hourlyRows({ prediccion: { dia: [{ fecha: '2026-12-31', temperatura: [{ periodo: '24', value: '3' }] }] } })
  expect(row).toMatchObject({ key: '2027-01-01T00', temperature: 3 })
})
test('missing numbers remain missing, overlapping daily intervals remain separate', () => {
  expect(numberOrNull('')).toBeNull(); expect(numberOrNull(null)).toBeNull(); expect(numberOrNull('bad')).toBeNull(); expect(numberOrNull('0')).toBe(0)
  expect(dailyPeriods({ probPrecipitacion: [{ periodo: '00-24', value: '' }, { periodo: '00-12', value: 0 }, { periodo: '12-24', value: 60 }] })).toHaveLength(2)
})

test('does not duplicate midnight supplied on two days', () => {
  const rows = hourlyRows({ prediccion: { dia: [
    { fecha: '2026-11-09', temperatura: [{ periodo: '24', value: '3' }] },
    { fecha: '2026-11-10', temperatura: [{ periodo: '00', value: '4' }] },
  ] } })
  expect(rows).toHaveLength(1)
  expect(rows[0].temperature).toBe(4)
})
