import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import useForecast from '../../hooks/useForecast'
import { dailyPeriods, displayValue as value, forecastModel, timezoneFor } from './model'
import { skyIconMap } from '../../utils/js/skyIcons'
import './forecast.css'

export default function Forecast({ town, compact = false }) {
  const { t } = useTranslation()
  const code = town ? `${town.CPRO}${town.CMUN}` : null
  const { hourly, daily, loading, errors, refresh } = useForecast(code)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(timer) }, [])
  if (!town) return <section className="forecast-card"><h2>{t('FORECAST.choose')}</h2><p>{t('FORECAST.intro')}</p></section>
  const { current, rows, days, today } = forecastModel(hourly, daily, code, now)
  const icon = skyIconMap[current?.sky]
  return <section className="forecast-card" aria-label={`${t('FORECAST.forecast')} ${town.NAME}`} aria-busy={loading}>
    <div className="forecast-heading"><div><p className="eyebrow">AEMET · {t('FORECAST.forecast')}</p><h2>{town.NAME}</h2><p>{town.PROV} · {town.COMUNIDAD}</p></div>
      <button className="weather-button" onClick={refresh} disabled={loading}>{t('FORECAST.refresh')}</button></div>
    {loading && <p role="status">{t('FORECAST.loading')}</p>}
    {errors.length > 0 && <p role="alert">{t(`FORECAST.errors.${errors[0]}`)} {hourly || daily ? t('FORECAST.partial') : ''}</p>}
    {!loading && <>
      <p className="forecast-note">{t('FORECAST.note')} · {timezoneFor(code)}</p>
      {current ? <>
        <div className="forecast-current">
          <div><p>{t('FORECAST.valid')} <time>{current.date} · {current.hour}:00</time></p><strong className="forecast-temperature">{value(current.temperature, ' °C')}</strong><p>{current.description || t('FORECAST.noData')}</p></div>
          {icon && <span aria-hidden="true">{icon(80, '#164b67')}</span>}
        </div>
        <dl className="forecast-metrics">
          {[[t('FORECAST.range'), `${value(today?.temperatura?.maxima, '°')} / ${value(today?.temperatura?.minima, '°')}`],
            [t('FORECAST.feels'), value(current.feelsLike, ' °C')], [t('FORECAST.humidity'), value(current.humidity, ' %')],
            [t('FORECAST.wind'), `${value(current.wind, ' km/h')} ${current.direction || ''}`],
            [t('FORECAST.rain'), value(current.rain, ' mm')], [t('FORECAST.gust'), value(current.gust, ' km/h')],
            [t('FORECAST.sunrise'), value(current.sunrise)], [t('FORECAST.sunset'), value(current.sunset)]].map(([label, data]) =>
              <div key={label}><dt>{label}</dt><dd>{data}</dd></div>)}
        </dl>
      </> : <p>{t('FORECAST.noHours')}</p>}
      {rows.length > 0 && <>
        <h3>{t('FORECAST.hours')}</h3>
        {!compact && <div className="forecast-chart" aria-hidden="true"><ResponsiveContainer width="100%" height={220}>
          <LineChart data={rows}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="key" tickFormatter={key => `${key.slice(8, 10)} / ${key.slice(11)}h`} minTickGap={45} /><YAxis unit="°" /><Tooltip labelFormatter={key => key.replace('T', ' · ') + ':00'} />
            <Line dataKey="temperature" name={t('HOME.MAP.TEMPERATURE')} unit=" °C" stroke="#164b67" dot={false} connectNulls={false} />
          </LineChart></ResponsiveContainer></div>}
        <div className="forecast-scroll" tabIndex="0" role="region" aria-label={t('FORECAST.hours')}><table>
          <caption>{t('FORECAST.hourCaption')}</caption>
          <thead><tr>{['date', 'sky', 'temp', 'feels', 'humidity', 'rain', 'snow', 'wind', 'gust'].map(key => <th key={key} scope="col">{t(`FORECAST.${key}`)}</th>)}</tr></thead>
          <tbody>{rows.slice(0, compact ? 6 : rows.length).map(row => <tr key={row.key}>
            <th scope="row">{row.date.slice(5)} · {row.hour}:00</th><td>{row.description || '—'}</td><td>{value(row.temperature, ' °C')}</td><td>{value(row.feelsLike, ' °C')}</td><td>{value(row.humidity, ' %')}</td><td>{value(row.rain, ' mm')}</td><td>{value(row.snow, ' mm')}</td><td>{value(row.wind, ' km/h')} {row.direction}</td><td>{value(row.gust, ' km/h')}</td>
          </tr>)}</tbody>
        </table></div>
      </>}
      {days.length > 0 && <><h3>{t('FORECAST.days')}</h3><div className="forecast-days">{days.slice(0, compact ? 3 : 7).map(day => <article key={day.fecha}>
        <h4>{day.fecha.slice(0, 10)}</h4><p><b>{value(day.temperatura?.maxima, '°')} / {value(day.temperatura?.minima, '°')}</b></p>
        <p>{t('FORECAST.uv')}: {value(day.uvMax)}</p>
        <details><summary>{t('FORECAST.periods')}</summary>
          <p>{t('FORECAST.utc')}</p>
          {(day.estadoCielo || []).filter(sky => sky.descripcion).map(sky => <p key={sky.periodo}>{sky.periodo || '00-24'}: {sky.descripcion}</p>)}
          {dailyPeriods(day).map(period => <p key={period.periodo}>{t('FORECAST.probability')} {period.periodo || '00-24'}: {value(period.value, ' %')}</p>)}
        </details>
      </article>)}</div></>}
      {!days.length && <p>{t('FORECAST.noDays')}</p>}
      <div className="forecast-source">
        {hourly?.elaborado && <p>{t('FORECAST.issuedHours')}: {hourly.elaborado.replace('T', ' ')}</p>}
        {daily?.elaborado && <p>{t('FORECAST.issuedDays')}: {daily.elaborado.replace('T', ' ')}</p>}
        <a href={`https://www.aemet.es/es/eltiempo/prediccion/municipios/municipio-id${code}`} target="_blank" rel="noreferrer">{t('FORECAST.source')}</a>
      </div>
    </>}
  </section>
}
