import React, { useEffect } from 'react'
import { WeatherSlidingPanelStyled } from './WeatherSlidingPanelStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import WeatherCurrentPrediction from '../weather-current-prediction/WeatherCurrentPrediction'
import WeatherCurrentSky from '../weather-current-sky/WeatherCurrentSky'
import WeatherTodayPrediction from '../weather-today-prediction/WeatherTodayPrediction'
import { Link } from 'react-router-dom'

const WeatherSlidingPanel = ({ data, onClose, isOpen, municipalityObject }) => {
  const { t } = useTranslation()

  const hourlyPredictionData = data?.hourlyPredictionData
  const diaryPredictionData = data?.diaryPredictionData

  // Hourly data
  const hourlyData = hourlyPredictionData?.data[0] || {}
  const { nombre = '', provincia = '' } = hourlyData

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  if (!isOpen) {
    return null
  }

  return (
    <WeatherSlidingPanelStyled isOpen={isOpen}>
      <header>
        <button onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>{`${nombre} (${provincia})`}</h2>
      </header>
      <div className="content__wrapper">
        <WeatherCurrentPrediction hourlyData={hourlyPredictionData} diaryData={diaryPredictionData} />
        <WeatherCurrentSky hourlyData={hourlyPredictionData} />
        <WeatherTodayPrediction hourlyData={hourlyPredictionData} />
      </div>
      <div className="footer__wrapper">
        <Link
          className="btn btn-primary"
          to="/more-info"
          state={{data: municipalityObject}}
        >
          {t('HOME.PANEL_INFO.MORE_INFO')}
        </Link>
      </div>
    </WeatherSlidingPanelStyled>
  )
}

export default WeatherSlidingPanel
