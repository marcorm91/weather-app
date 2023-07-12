import React from 'react'
import { WeatherCurrentPredictionStyled } from './WeatherCurrentPredictionStyled'
import { WiSunset, WiSunrise, WiHumidity, WiRaindrop } from 'weather-icons-react'
import { windDirectionIconMap } from '../../utils/js/windDirectionIcons'
import { findPropertyValueByPeriod, getCurrentHour, getCurrentDate } from '../../utils/js/helpers'

const WeatherCurrentPrediction = ({ hourlyData, diaryData }) => {
  
  // Getting current date and hour for making later comparisons
  const currentHour = getCurrentHour()
  const currentDate = getCurrentDate()

  /**
   * HOURLY DATA
   */

  // Get current sunrise and sunset time
  const sunriseTime = hourlyData?.data[0]?.prediccion?.dia[0]?.orto || ''
  const sunsetTime = hourlyData?.data[0]?.prediccion?.dia[0]?.ocaso || ''

  // Get the value closest to the current temperature
  const temperatureList1 = hourlyData?.data[0]?.prediccion?.dia[0]?.temperatura || []
  const temperatureList2 = hourlyData?.data[0]?.prediccion?.dia[1]?.temperatura || []
  const currentTemp = findPropertyValueByPeriod(temperatureList1, currentHour, ['value']) 
                      || findPropertyValueByPeriod(temperatureList2, currentHour, ['value'])

  // Get the value closest to the current precipitation
  const precipitationList1 = hourlyData?.data[0]?.prediccion?.dia[0]?.precipitacion || []
  const precipitationList2 = hourlyData?.data[0]?.prediccion?.dia[1]?.precipitacion || []
  const currentPrecipitation = findPropertyValueByPeriod(precipitationList1, currentHour, ['value']) 
                      || findPropertyValueByPeriod(precipitationList2, currentHour, ['value'])

  // Get the value closest to the current relative humidity from the lists
  const currentHumidityList1 = hourlyData?.data[0]?.prediccion?.dia[0]?.humedadRelativa || []
  const currentHumidityList2 = hourlyData?.data[0]?.prediccion?.dia[1]?.humedadRelativa || []
  const currentHumidity = findPropertyValueByPeriod(currentHumidityList1, currentHour, ['value']) 
                          || findPropertyValueByPeriod(currentHumidityList2, currentHour, ['value'])

  // Get the value closest to the current wind from the lists
  const currentWindList1 = hourlyData?.data[0]?.prediccion?.dia[0]?.vientoAndRachaMax || []
  const currentWindList2 = hourlyData?.data[0]?.prediccion?.dia[1]?.vientoAndRachaMax || []
  const currentWind = findPropertyValueByPeriod(currentWindList1, currentHour, ['velocidad', 'direccion']) 
                      || findPropertyValueByPeriod(currentWindList2, currentHour, ['velocidad', 'direccion'])

  const { velocidad = '', direccion = '' } = currentWind || {}
  const currentIcon = windDirectionIconMap[direccion] || null

  /**
   * DIARY DATA
   */

  // Get max and min temperature
  const matchingDay = diaryData?.data[0]?.prediccion?.dia.find((day) => day.fecha === currentDate)
  const temperatureMin = matchingDay?.temperatura?.minima || ''
  const temperatureMax = matchingDay?.temperatura?.maxima || ''

  return (
    <WeatherCurrentPredictionStyled>
      <div>
        <div>
          <WiSunrise size={28} color='var(--wa-deep-blue)' />
          <span>{sunriseTime}</span>
        </div>
        <span>{currentTemp.value}</span>
        <div>
          <WiSunset size={28} color='var(--wa-deep-blue)' />
          <span>{sunsetTime}</span>
        </div>
      </div>
      <div>
        <ul>
          <li className='temperature__wrapper'><span>{temperatureMax}</span>/<span>{temperatureMin}</span></li>
          <li className='humidity__wrapper'><span>{currentHumidity.value}</span><WiHumidity size={28} color='var(--wa-deep-blue)' /></li>
          <li className='wind__wrapper'>
            <span>{velocidad} Km/h</span>
            <span>
              {currentIcon && (
                <>
                  {currentIcon(28, 'var(--wa-deep-blue)')}
                  {direccion}
                </>
              )}
              </span>
          </li>
          <li className='precipitation__wrapper'>
            <span>{currentPrecipitation.value} mm. <WiRaindrop size={28} color='var(--wa-deep-blue)' /></span>
          </li>
        </ul>
      </div>
    </WeatherCurrentPredictionStyled>
  )
}

export default WeatherCurrentPrediction
