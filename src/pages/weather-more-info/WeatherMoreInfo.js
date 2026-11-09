import React from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Forecast from '../../features/forecast/Forecast'
import MunicipalityMap from '../../features/forecast/MunicipalityMap'
import towns from '../../resources/services/code_towns.json'
import { townCode } from '../../features/forecast/TownPicker'
export default function WeatherMoreInfo() {
  const { t } = useTranslation()
  const { state } = useLocation()
  const [params] = useSearchParams()
  const code = params.get('municipio') || (state?.data ? townCode(state.data) : null)
  const town = towns.find(item => townCode(item) === code)
  return <main className="weather-page" id="main-content">
    <Link className="weather-button" to={town ? `/?municipio=${townCode(town)}` : '/'}>{t('NAVBAR.HOME_PAGE')}</Link>
    <h1>{town ? `${t('FORECAST.forecast')} · ${town.NAME}` : t('FORECAST.choose')}</h1>
    <Forecast town={town} />{town && <details><summary>{t('FORECAST.map')}</summary><DetailMap town={town} /></details>}
  </main>
}
// The map is only requested when its disclosure is opened.
function DetailMap({ town }) {
  const [visible, setVisible] = React.useState(false)
  const ref = React.useRef(null)
  React.useEffect(() => {
    const details = ref.current.parentElement
    const update = () => setVisible(details.open)
    details.addEventListener('toggle', update)
    return () => details.removeEventListener('toggle', update)
  }, [])
  return <div ref={ref}>{visible && <MunicipalityMap town={town} />}</div>
}
