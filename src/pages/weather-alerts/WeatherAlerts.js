import React, {useState, useEffect} from 'react'
import { WeatherAlertsStyled } from './WeatherAlertsStyled'
import WeatherAccordion from '../../components/weather-accordion/WeatherAccordion'
import { fetchAdPrediction } from '../../resources/services/APIs/adPrediction'
import WeatherLoaderFull from '../../components/weather-loader-full/WeatherLoaderFull'
import regionCodes from '../../utils/js/regionCodes'
import { useTranslation } from 'react-i18next'

const WeatherAlerts = () => {
  const { t } = useTranslation()
  const [weatherData, setWeatherData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const promises = regionCodes.map(async region => {
          const response = await fetchAdPrediction(region.code)
          const data = {
            code: region.code,
            community: region.community,
            weather: response.data
          }
          return data
        })
        const results = await Promise.all(promises)
        setWeatherData(results)
      } catch (error) {
        console.error('Error retrieving weather data: ', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <WeatherAlertsStyled>
      {isLoading ? <WeatherLoaderFull /> : 
        <>
          <span>{t('ALERTS.INFO')}</span>
          <WeatherAccordion weatherData={weatherData} />
        </>
      }
    </WeatherAlertsStyled>
  )
}

export default WeatherAlerts
