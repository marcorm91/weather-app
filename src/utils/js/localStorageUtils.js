const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
const write = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* Storage can be disabled. */ }
  window.dispatchEvent(new Event('weather-storage'))
}
const array = key => { const value = read(key, []); return Array.isArray(value) ? value : [] }
export const getSavedLanguage = () => {
  try { return localStorage.getItem('language') === 'en' ? 'en' : 'es' } catch { return 'es' }
}
export const storeSelectedLanguage = value => { try { localStorage.setItem('language', value) } catch {} }
export const getRecentSearchesFromLocalStorage = () => array('recentSearches').filter(item => item?.state?.CPRO && item?.state?.CMUN && item?.nombre)
export const storeRecentSearchesToLocalStorage = searches => write('recentSearches', searches)
export const storeSearchItem = item => {
  const code = `${item.state.CPRO}${item.state.CMUN}`
  const searches = [item, ...getRecentSearchesFromLocalStorage().filter(search => `${search.state.CPRO}${search.state.CMUN}` !== code)].slice(0, 5)
  storeRecentSearchesToLocalStorage(searches)
  return searches
}
export const getFavorites = () => array('favorites').filter(item => typeof item === 'string')
export const addFavorite = item => write('favorites', [...new Set([...getFavorites(), item])])
export const removeFavorite = item => write('favorites', getFavorites().filter(value => value !== item))
export const removeAllFavorites = () => write('favorites', [])
