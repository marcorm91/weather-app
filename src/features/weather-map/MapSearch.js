import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { searchTowns, townByCode } from './catalogue'
import useFavorites from '../../hooks/useFavorites'

export default function MapSearch({ onSelect }) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const favorites = useFavorites()
  const results = searchTowns(query)
  const favoriteTowns = favorites.map(id => { const parts = id.split('-'); return townByCode.get(`${parts[1]}${parts[2]}`) }).filter(Boolean)
  const choose = town => { setQuery(''); setOpen(false); onSelect(town) }
  return <div className="map-search-wrap" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
    <label className="map-search-label" htmlFor="map-search"><span aria-hidden="true">⌕</span><input id="map-search" type="search" autoComplete="off" placeholder={t('MAP.searchPlaceholder')} aria-label={t('FORECAST.search')} aria-controls="map-search-results" value={query} onFocus={() => setOpen(true)} onChange={event => { setQuery(event.target.value); setOpen(true) }} onKeyDown={event => { if (event.key === 'Escape') setOpen(false); if (event.key === 'ArrowDown') { event.preventDefault(); document.querySelector('#map-search-results button')?.focus() } }} /><kbd>⌕</kbd></label>
    {open && <div id="map-search-results" className="map-search-results"><p>{query.length < 2 ? t('HOME.TABS.FAV') : t('MAP.results')}</p>
      <ul>{(query.length < 2 ? favoriteTowns.slice(0, 8) : results).map(town => <li key={`${town.CPRO}${town.CMUN}`}><button onClick={() => choose(town)}>{town.NAME}<small>{town.PROV} <span>↗</span></small></button></li>)}</ul>
      {(query.length < 2 ? !favoriteTowns.length : !results.length) && <span>{query.length < 2 ? t('MAP.searchHint') : t('HOME.TABLE.NO_RESULTS')}</span>}
    </div>}
  </div>
}
