import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import towns from '../../resources/services/code_towns.json'
import useFavorites from '../../hooks/useFavorites'
import { addFavorite, removeFavorite } from '../../utils/js/localStorageUtils'
export const townCode = town => `${town.CPRO}${town.CMUN}`
export const favoriteId = town => `${town.CODAUTO}-${town.CPRO}-${town.CMUN}-${town.DC}`
export const normalizeName = name => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
const provinces = [...new Set(towns.map(town => town.PROV))].sort()
export default function TownPicker({ selected, onSelect }) {
  const { t } = useTranslation()
  const favorites = useFavorites()
  const [query, setQuery] = useState('')
  const [province, setProvince] = useState('')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [page, setPage] = useState(0)
  const results = useMemo(() => towns.filter(town => (!province || town.PROV === province) &&
    (!onlyFavorites || favorites.includes(favoriteId(town))) && normalizeName(`${town.NAME} ${town.PROV}`).includes(normalizeName(query))).sort((a, b) => {
      const needle = normalizeName(query)
      const rank = town => !needle ? 0 : normalizeName(town.NAME) === needle ? 0 : normalizeName(town.NAME).startsWith(needle) ? 1 : 2
      return rank(a) - rank(b) || a.NAME.localeCompare(b.NAME, 'es')
    }), [province, onlyFavorites, favorites, query])
  const lastPage = Math.max(0, Math.ceil(results.length / 10) - 1)
  const currentPage = Math.min(page, lastPage)
  return <section className="town-picker" aria-label={t('FORECAST.choose')}>
    <div className="weather-toolbar"><button className="weather-button" aria-pressed={!onlyFavorites} onClick={() => { setOnlyFavorites(false); setPage(0) }}>{t('HOME.TABS.ALL')}</button><button className="weather-button" aria-pressed={onlyFavorites} onClick={() => { setOnlyFavorites(true); setPage(0) }}>{t('HOME.TABS.FAV')} ({favorites.length})</button></div>
    <label htmlFor="town-query">{t('FORECAST.search')}</label><input id="town-query" type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(0) }} />
    <label htmlFor="town-province">{t('HOME.TABLE.PROVINCE')}</label><select id="town-province" value={province} onChange={event => { setProvince(event.target.value); setPage(0) }}><option value="">{t('HOME.TABS.ALL')}</option>{provinces.map(name => <option key={name}>{name}</option>)}</select>
    <p role="status">{results.length} {t('FORECAST.results')}</p>
    <ul>{results.slice(currentPage * 10, currentPage * 10 + 10).map(town => {
      const id = favoriteId(town), favorite = favorites.includes(id)
      return <li key={townCode(town)}><button className="town-select" aria-pressed={selected && townCode(selected) === townCode(town)} onClick={() => onSelect(town)}>{town.NAME}<small>{town.PROV}</small></button>
        <button className="town-star" aria-label={`${t('FORECAST.favorite')} ${town.NAME}`} aria-pressed={favorite} onClick={() => favorite ? removeFavorite(id) : addFavorite(id)}>{favorite ? '★' : '☆'}</button></li>
    })}</ul>
    {!results.length && <p>{t('HOME.TABLE.NO_RESULTS')}</p>}
    <div className="weather-toolbar"><button className="weather-button" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>{t('FORECAST.previous')}</button><span>{currentPage + 1} / {lastPage + 1}</span><button className="weather-button" disabled={currentPage >= lastPage} onClick={() => setPage(currentPage + 1)}>{t('FORECAST.next')}</button></div>
  </section>
}
