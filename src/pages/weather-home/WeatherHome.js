import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Forecast from '../../features/forecast/Forecast'
import LocateTown from '../../features/forecast/LocateTown'
import WeatherExplorer from '../../features/weather-map/WeatherExplorer'
import MapSearch from '../../features/weather-map/MapSearch'
import { communities, provinces, townsInProvince, resolveScope, scopeParams, normalize } from '../../features/weather-map/catalogue'
import RecentSearchesContext from '../../utils/js/RecentSearchesContext'
import { storeSearchItem, addFavorite, removeFavorite } from '../../utils/js/localStorageUtils'
import useFavorites from '../../hooks/useFavorites'
import '../../features/weather-map/weather-map.css'

export default function WeatherHome() {
  const { t, i18n } = useTranslation()
  const [params, setParams] = useSearchParams()
  const { setRecentSearches } = useContext(RecentSearchesContext)
  const [offset, setOffset] = useState(0), [filter, setFilter] = useState(''), [page, setPage] = useState(0)
  const favorites = useFavorites()
  const scope = resolveScope(params)
  const { town, province, community, level } = scope
  useEffect(() => { setFilter(''); setPage(0) }, [level, province?.code, community?.code])
  const navigate = (item, type) => {
    if (!item && type !== 'country') return
    setParams(scopeParams(item, type)); setFilter(''); setPage(0)
    if (type === 'town') { setOffset(0); setRecentSearches(storeSearchItem({ nombre: item.NAME, state: item })) }
  }
  const choices = useMemo(() => level === 'country' ? communities : level === 'community' ? provinces.filter(p => p.community === community?.code) : townsInProvince(province?.code).map(town => ({ code: `${town.CPRO}${town.CMUN}`, name: town.NAME, town })), [level, community?.code, province?.code])
  const filtered = choices.filter(item => normalize(item.name).includes(normalize(filter)))
  const childType = level === 'country' ? 'community' : level === 'community' ? 'province' : 'town'
  const id = town && `${town.CODAUTO}-${town.CPRO}-${town.CMUN}-${town.DC}`
  const isFavorite = favorites.includes(id)
  const today = new Intl.DateTimeFormat(i18n.language, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Madrid' }).format(new Date())
  return <main className="weather-page map-home" id="main-content">
    <header className="map-hero"><div><p className="map-eyebrow">{t('MAP.heroEyebrow')} <span>· {today}</span></p><h1>{t('MAP.heroTitle')}</h1><p className="map-hero-copy">{t('MAP.heroCopy')}</p></div><div className="map-hero-actions"><MapSearch onSelect={town => navigate(town, 'town')} /><LocateTown onSelect={town => navigate(town, 'town')} /></div></header>
    <nav className="map-breadcrumbs" aria-label={t('MAP.breadcrumb')}><button onClick={() => navigate(null, 'country')} aria-current={level === 'country' ? 'location' : undefined}>{t('MAP.spain')}</button>{community && <><span aria-hidden="true">›</span><button onClick={() => navigate(community, 'community')} aria-current={level === 'community' ? 'location' : undefined}>{community.name}</button></>}{province && <><span aria-hidden="true">›</span><button onClick={() => navigate(province, 'province')} aria-current={level === 'province' ? 'location' : undefined}>{province.name}</button></>}{town && <><span aria-hidden="true">›</span><span aria-current="location">{town.NAME}</span></>}</nav>
    <div className={`map-workspace ${town ? 'has-town' : ''}`}>
      <WeatherExplorer scope={scope} onNavigate={navigate} offset={offset} onOffset={setOffset} />
      <aside className="map-sidebar" aria-label={t('MAP.explore')}>
        {town ? <><div className="town-actions"><span className="map-eyebrow">{t('MAP.yourForecast')}</span><button className="weather-button" aria-pressed={isFavorite} onClick={() => isFavorite ? removeFavorite(id) : addFavorite(id)}>{isFavorite ? '★' : '☆'} {t('HOME.TABS.FAV')}</button></div><Forecast town={town} compact /><Link className="map-detail-link" to={`/more-info?municipio=${town.CPRO}${town.CMUN}`}>{t('FORECAST.full')} <span>↗</span></Link></> : <section className="explore-panel">
          <div className="explore-heading"><span className="explore-compass" aria-hidden="true">◎</span><p className="map-eyebrow">{t('MAP.explore')}</p><h2>{community ? province?.name || community.name : t('MAP.where')}</h2><p>{t(`MAP.choose_${childType}`)}</p></div>
          <div className="explore-count"><span>{t(`MAP.plural_${childType}`)}</span><b>{choices.length}</b></div>
          {choices.length > 12 && <input type="search" className="explore-filter" aria-label={t('MAP.filter')} placeholder={t('MAP.filter')} value={filter} onChange={event => { setFilter(event.target.value); setPage(0) }} />}
          <ul className="explore-list">{filtered.slice(page * 12, (page + 1) * 12).map(item => <li key={item.code}><button onClick={() => navigate(item.town || item, childType)}>{item.name}<span aria-hidden="true">↗</span></button></li>)}</ul>
          {!filtered.length && <p role="status">{t('HOME.TABLE.NO_RESULTS')}</p>}
          {filtered.length > 12 && <div className="explore-pagination"><button disabled={!page} onClick={() => setPage(p => p - 1)} aria-label={t('FORECAST.previous')}>←</button><span>{page + 1} / {Math.ceil(filtered.length / 12)}</span><button disabled={(page + 1) * 12 >= filtered.length} onClick={() => setPage(p => p + 1)} aria-label={t('FORECAST.next')}>→</button></div>}
          <p className="explore-tip">{t('MAP.exploreTip')}</p>
        </section>}
      </aside>
    </div>
    <div className="map-footer-note"><span>↳ {t('MAP.pathHint')}</span><Link to="/alerts">{t('MAP.alertsLink')} →</Link></div>
  </main>
}
