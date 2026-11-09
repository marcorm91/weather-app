import { useEffect, useState } from 'react'
import { getFavorites } from '../utils/js/localStorageUtils'
export default function useFavorites() {
  const [favorites, setFavorites] = useState(getFavorites)
  useEffect(() => {
    const update = () => setFavorites(getFavorites())
    window.addEventListener('weather-storage', update)
    window.addEventListener('storage', update)
    return () => { window.removeEventListener('weather-storage', update); window.removeEventListener('storage', update) }
  }, [])
  return favorites
}
