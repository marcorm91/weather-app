import React, { useState, useEffect } from 'react'
import { WeatherAdStyled } from './WeatherAdStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { fetchAdPrediction } from '../../resources/services/APIs/adPrediction'
import WeatherLoader from '../weather-loader/WeatherLoader'
import { useTranslation } from 'react-i18next'

const WeatherAd = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(true)
  const [weatherData, setWeatherData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const code = 'and' // TODO
        const response = await fetchAdPrediction(code)
        setWeatherData(response.data)
      } catch (error) {
        console.error('Error retrieving weather data: ', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const onClose = () => {
    setIsOpen(false)
  }

  if (!isOpen) {
    return null
  }

  return (
    <WeatherAdStyled className="weather-ad__wrapper">
      {isLoading ? (
        <WeatherLoader />
      ) : (
        <>
          <span className="ad-text-title">{t('HOME.AD_PREDICTION')}</span>
          <div className="ad-text__wrapper">
            <span>{weatherData}</span>
          </div>
        </>
      )}
      <button onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </WeatherAdStyled>
  )
}

export default WeatherAd
