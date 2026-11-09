import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TownPicker from './TownPicker'
import '../../resources/i18n/i18n'
beforeEach(() => localStorage.clear())
test('searches without accents, selects a municipality and updates favourites immediately', () => {
  const onSelect = jest.fn()
  render(<TownPicker onSelect={onSelect} />)
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'malaga' } })
  const select = screen.getAllByRole('button').find(button => button.textContent === 'MálagaMálaga')
  expect(select).toBeTruthy()
  fireEvent.click(select); expect(onSelect.mock.calls[0][0].NAME).toBe('Málaga')
  fireEvent.click(screen.getByRole('button', { name: 'Favorito: Málaga' }))
  fireEvent.click(screen.getByRole('button', { name: 'Favoritos (1)' }))
  expect(screen.getByRole('status').textContent).toContain('1 municipios')
  fireEvent.click(screen.getByRole('button', { name: 'Favorito: Málaga' }))
  expect(screen.getByText('No se encontraron resultados.')).toBeTruthy()
})
