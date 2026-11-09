import React from 'react'
import { render, screen } from '@testing-library/react'
import Forecast from './Forecast'
import useForecast from '../../hooks/useForecast'
import '../../resources/i18n/i18n'
jest.mock('../../hooks/useForecast', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('recharts', () => ({ ...jest.requireActual('recharts'), ResponsiveContainer: () => null }))
jest.mock('../../utils/js/skyIcons', () => ({ skyIconMap: {} }))
const town = { CPRO: '28', CMUN: '079', NAME: 'Madrid', PROV: 'Madrid', COMUNIDAD: 'Madrid' }
beforeEach(() => { useForecast.mockReturnValue({ hourly: null, daily: null, loading: false, errors: [], refresh: jest.fn() }) })
test('offers a municipality search rather than invented weather before selecting a town', () => {
  render(<Forecast />)
  expect(screen.getByText('Elige un municipio')).toBeTruthy()
  expect(screen.queryByText(/22°/)).toBeNull()
})
test('renders API failures and a retry without an endless loading state', () => {
  useForecast.mockReturnValue({ hourly: null, daily: null, loading: false, errors: ['limit'], refresh: jest.fn() })
  render(<Forecast town={town} />)
  expect(screen.getByRole('alert').textContent).toContain('límite')
  expect(screen.getByRole('button', { name: 'Actualizar' })).toBeTruthy()
})
test('renders zeros, missing humidity and real daily extrema with period-labelled probabilities', () => {
  const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid' }).format(new Date())
  const hour = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', hour: '2-digit', hourCycle: 'h23' }).format(new Date())
  useForecast.mockReturnValue({ loading: false, errors: [], refresh: jest.fn(),
    hourly: { prediccion: { dia: [{ fecha: date, temperatura: [{ periodo: hour, value: '0' }] }] } },
    daily: { prediccion: { dia: [{ fecha: date, temperatura: { maxima: 10, minima: -3 }, probPrecipitacion: [{ periodo: '12-24', value: 0 }] }] } },
  })
  const { rerender } = render(<Forecast town={town} compact />)
  expect(screen.getAllByText('0 °C').length).toBeGreaterThan(0)
  expect(screen.getAllByText('10° / -3°').length).toBeGreaterThan(0)
  rerender(<Forecast town={town} />)
  expect(screen.getByText('Probabilidad de precipitación 12-24: 0 %')).toBeTruthy()
})
