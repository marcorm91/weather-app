import { getFavorites, addFavorite, removeFavorite, getRecentSearchesFromLocalStorage, storeSearchItem } from './localStorageUtils'
beforeEach(() => localStorage.clear())
test('handles corrupt storage and prevents duplicate favourites', () => {
  localStorage.setItem('favorites', '{broken')
  expect(getFavorites()).toEqual([])
  addFavorite('a'); addFavorite('a'); expect(getFavorites()).toEqual(['a'])
  removeFavorite('a'); expect(getFavorites()).toEqual([])
})
test('keeps same-named municipalities in different provinces distinct', () => {
  storeSearchItem({ nombre: 'Test', state: { CPRO: '01', CMUN: '001' } })
  storeSearchItem({ nombre: 'Test', state: { CPRO: '02', CMUN: '001' } })
  expect(getRecentSearchesFromLocalStorage()).toHaveLength(2)
})
