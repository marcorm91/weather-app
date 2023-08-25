import React, { useEffect, useContext } from 'react'
import { WeatherSlidingPanelStyled } from './WeatherSlidingPanelStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import WeatherCurrentPrediction from '../weather-current-prediction/WeatherCurrentPrediction'
import WeatherCurrentSky from '../weather-current-sky/WeatherCurrentSky'
import WeatherTodayPrediction from '../weather-today-prediction/WeatherTodayPrediction'
import WeatherBackdrop from '../weather-backdrop/WeatherBackdrop'
import RecentSearchesContext from '../../utils/js/RecentSearchesContext'
import { AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { storeSearchItem } from '../../utils/js/localStorageUtils';

const WeatherSlidingPanel = ({ data, onClose, isOpen, municipalityObject }) => {
  const { t } = useTranslation()
  const hourlyPredictionData = data?.hourlyPredictionData
  const diaryPredictionData = data?.diaryPredictionData
  const { setRecentSearches } = useContext(RecentSearchesContext)

  // Hourly data
  const hourlyData = hourlyPredictionData?.data[0] || {}
  const { nombre = '', provincia = '' } = hourlyData

  // Stores the current search (`nombre`) to the local storage. Max. 5 values, and reorder last search
  const storeRecentSearch = () => {
    const newItem = {
      nombre,
      state: municipalityObject,
    }
    const newSearches = storeSearchItem(newItem)
    setRecentSearches(newSearches)
  }
  
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
              onClick={() => storeRecentSearch(municipalityObject)}
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
