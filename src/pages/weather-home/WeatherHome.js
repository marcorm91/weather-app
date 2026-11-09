import React, { useContext, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Forecast from '../../features/forecast/Forecast'
import TownPicker, { townCode } from '../../features/forecast/TownPicker'
import LocateTown from '../../features/forecast/LocateTown'
import MunicipalityMap from '../../features/forecast/MunicipalityMap'
import towns from '../../resources/services/code_towns.json'
import RecentSearchesContext from '../../utils/js/RecentSearchesContext'
import { storeSearchItem } from '../../utils/js/localStorageUtils'

export default function WeatherHome() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const { setRecentSearches, recentSearches } = useContext(RecentSearchesContext)
  const [showMap, setShowMap] = useState(false)
  const initialCode = params.get('municipio') || (recentSearches[0]?.state ? townCode(recentSearches[0].state) : null)
  const town = towns.find(item => townCode(item) === initialCode) || null
  const select = selected => {
    setParams({ municipio: townCode(selected) })
    setRecentSearches(storeSearchItem({ nombre: selected.NAME, state: selected }))
  }
  return <main className="weather-page" id="main-content">
    <h1>{t('FORECAST.title')}</h1><p>{t('FORECAST.subtitle')}</p><LocateTown onSelect={select} />
    <div className="weather-layout"><TownPicker selected={town} onSelect={select} />
      <div><Forecast town={town} compact />
        {town && <><div className="weather-toolbar"><Link className="weather-button" to={`/more-info?municipio=${townCode(town)}`}>{t('FORECAST.full')}</Link>
          <button className="weather-button" aria-expanded={showMap} onClick={() => setShowMap(value => !value)}>{t('FORECAST.map')}</button></div>
          {showMap && <MunicipalityMap town={town} />}</>}
      </div>
    </div>
  </main>
}
