import React, { useEffect } from 'react'
import { WeatherSlidingPanelStyled } from './WeatherSlidingPanelStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import WeatherCurrentPrediction from '../weather-current-prediction/WeatherCurrentPrediction'
import WeatherCurrentSky from '../weather-current-sky/WeatherCurrentSky'
import WeatherTodayPrediction from '../weather-today-prediction/WeatherTodayPrediction'
import WeatherBackdrop from '../weather-backdrop/WeatherBackdrop'
import { AnimatePresence } from 'framer-motion'
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

  const slidingPanelVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '100%', opacity: 0 },
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
        <WeatherBackdrop 
          isOpen={isOpen} 
          onClick={onClose} />
        <WeatherSlidingPanelStyled 
          key="slidingPanel"
          initial="closed" 
          animate={isOpen ? "open" : "closed"} 
          exit="closed"
          variants={slidingPanelVariants} 
          transition={{ type: 'tween', stiffness: 20, damping: 20 }}>
          <header>
            <button onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} color='var(--wa-deep-blue)' />
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
      </>
      )}
      </AnimatePresence>
  )
}

export default WeatherSlidingPanel
