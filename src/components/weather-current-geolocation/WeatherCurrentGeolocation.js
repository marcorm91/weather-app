import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { WiHumidity, WiRaindrop } from 'weather-icons-react'
import { WeatherCurrentGeolocationStyled } from './WeatherCurrentGeolocationStyled'
import WeatherCurrentSky from '../weather-current-sky/WeatherCurrentSky'
import { windDirectionIconMap } from '../../utils/js/windDirectionIcons'
import codeTownsData from '../../resources/services/code_towns.json'
import { getNameFromCoordinates } from '../../resources/services/APIs/geoService'
import { fetchHourlyPrediction } from '../../resources/services/APIs/hourlyPrediction'
import RecentSearchesContext from '../../utils/js/RecentSearchesContext'
import { storeSearchItem } from '../../utils/js/localStorageUtils'
import { findPropertyValueByPeriod, getCurrentDate, getCurrentHour } from '../../utils/js/helpers'
import { useTranslation } from 'react-i18next'

const WeatherCurrentGeolocation = ( { location } ) => {

  const [weatherData, setWeatherData] = useState(null)
  const [codeData, setCodeData] = useState(undefined)
  const { setRecentSearches } = useContext(RecentSearchesContext)
  const { t } = useTranslation()
  const currentHour = getCurrentHour()
  const currentDate = getCurrentDate()

  // Search a city from province in a json towns file
  const searchCityAndProvince = (city, province) => {
    if (!city || !province) {
      return null
    }
    return codeTownsData.filter(item =>
      item.NAME.toLowerCase().includes(city.toLowerCase()) &&
      item.PROV.toLowerCase() === province.toLowerCase()
    )[0] || null
  }

  // Stores the current search (`nombre`) to the local storage. Max. 5 values, and reorder last search
  const storeRecentSearch = () => {
    const nombre = codeData ? codeData.NAME : ""
    const newItem = {
      nombre,
      state: codeData,
    }
    const newSearches = storeSearchItem(newItem)
    setRecentSearches(newSearches)
  }

  // It makes a fetch and retrieves the data according to the browser's geolocation
  useEffect(() => {
    getNameFromCoordinates(location.latitude, location.longitude)
      .then(name => {
        if (!name || !name.address || !name.address.city || !name.address.state_district) {
          // If there's an error in geolocation even if it's allowed, notify the parent to avoid rendering the block
          const foundCodeData = searchCityAndProvince(name.address.city, name.address.state_district)
          if (!foundCodeData) {
              const event = new CustomEvent('GeolocationError', { detail: true })
              window.dispatchEvent(event)
              return
          }
          setCodeData(null)
          return
        }
        const foundCodeData = searchCityAndProvince(name.address.city, name.address.state_district)
        setCodeData(foundCodeData || null) 
        if (foundCodeData) { 
          const code = `${foundCodeData.CPRO}${foundCodeData.CMUN}`
          return fetchHourlyPrediction(code)
        }
      })
      .then(weatherResponse => {
        if (weatherResponse) {
          setWeatherData(weatherResponse)
        }
      })
      .catch(error => {
        console.error("Error:", error)
      })
  }, [location, codeData])

  // Display a skeleton loading until the data load is success
  if (!weatherData || !weatherData.data || !weatherData.data[0]){
    return <div className='loading-skeleton' style={{width: '100%', minHeight: '16rem'}}></div>
  }

  const { 
    nombre: municipality, 
    provincia: province, 
    prediccion 
  } = weatherData.data[0]
  
  const currentDay = prediccion?.dia.find(day => day.fecha === currentDate)

  // Temperature
  const temperature = currentDay?.temperatura || []
  const currentTemp = findPropertyValueByPeriod(temperature, currentHour, ['value'])
  const temperatures = temperature.map(temp => temp.value)
  const maxTemp = Math.max(...temperatures)
  const minTemp = Math.min(...temperatures)

  // HR
  const hr = currentDay?.humedadRelativa || []
  const currentHumidity = findPropertyValueByPeriod(hr, currentHour, ['value'])

  // Precipitation
  const precipitation = currentDay?.precipitacion || []
  const currentPrecipitation = findPropertyValueByPeriod(precipitation, currentHour, ['value'])

  // Wind
  const wind = currentDay?.vientoAndRachaMax || []
  const currentWind = findPropertyValueByPeriod(wind, currentHour, ['velocidad', 'direccion'])
  const currentWindIcon = windDirectionIconMap[currentWind.direccion] || null

  return (
    <WeatherCurrentGeolocationStyled>
      {weatherData ? (
        <>
          <span>{t('GEOLOCATION.ZONE_WEATHER')} <b>{municipality}, {province}</b>.</span>
          <ul>
              <li className='current-sky__wrapper'>
                <WeatherCurrentSky hourlyData={weatherData} />
              </li>
              <li className='current-temp__wrapper'>
                <span className='main-text__wrapper'>{currentTemp.value}º</span>
                <span className='submain-text__wrapper'>({maxTemp}º / {minTemp}º)</span>
              </li>
              <li className='current-hr__wrapper'>
                {currentHumidity.value}% <WiHumidity size={22} color='var(--wa-deep-blue)' />
              </li>
              <li className='current-precipitation__wrapper'>
                {currentPrecipitation.value} mm. <WiRaindrop size={32} color='var(--wa-deep-blue)' />
              </li>
              <li className='current-wind__wrapper'>
                <span>{currentWind.velocidad} Km/h</span>
                <span>{currentWindIcon(22, 'var(--wa-deep-blue)')} {currentWind.direccion}</span>
              </li>
          </ul>
          <Link 
              onClick={() => storeRecentSearch(codeData)}
              className="btn btn-primary btn-small"
              to="/more-info"
              state={{ data: codeData }}>
          + INFO</Link>
        </>
      ): (
        <div className='loading-skeleton'></div>
      )}
        
    </WeatherCurrentGeolocationStyled>
  )
}

export default WeatherCurrentGeolocation
