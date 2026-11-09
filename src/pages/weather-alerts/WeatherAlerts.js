import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchAdPrediction } from '../../resources/services/APIs/adPrediction'
import regions from '../../utils/js/regionCodes'
export default function WeatherAlerts() {
  const { t } = useTranslation()
  const [code, setCode] = useState('')
  const [revision, setRevision] = useState(0)
  const [state, setState] = useState({ text: '', loading: false, error: '' })
  useEffect(() => {
    if (!code) { setState({ text: '', loading: false, error: '' }); return }
    let active = true
    setState({ text: '', loading: true, error: '' })
    fetchAdPrediction(code).then(response => { if (active) setState({ text: response.data, loading: false, error: '' }) })
      .catch(error => { if (active) setState({ text: '', loading: false, error: error.code || 'unavailable' }) })
    return () => { active = false }
  }, [code, revision])
  return <main className="weather-page" id="main-content"><h1>{t('NAVBAR.ALERTS')}</h1>
    <section className="forecast-card"><h2>{t('FORECAST.officialAlerts')}</h2><p>{t('FORECAST.alertsNote')}</p><a className="weather-button" href="https://www.aemet.es/es/eltiempo/prediccion/avisos" target="_blank" rel="noreferrer">{t('FORECAST.officialAlerts')}</a></section>
    <section className="forecast-card"><h2>{t('FORECAST.regional')}</h2><p>{t('FORECAST.regionalNote')}</p>
      <label htmlFor="region">{t('HOME.TABLE.COMUNITY')} </label><select id="region" value={code} onChange={event => setCode(event.target.value)}><option value="">{t('HOME.TABLE.SELECT_COMMUNITY')}</option>{regions.map(region => <option key={region.code} value={region.code}>{region.community}</option>)}</select>
      {state.loading && <p role="status">{t('FORECAST.loading')}</p>}
      {state.error && <p role="alert">{t(`FORECAST.errors.${state.error}`)} <button className="weather-button" onClick={() => setRevision(value => value + 1)}>{t('FORECAST.refresh')}</button></p>}
      <p className="weather-region-text">{state.text}</p>
    </section>
  </main>
}
