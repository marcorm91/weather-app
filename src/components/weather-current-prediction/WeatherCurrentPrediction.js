import React from 'react'
import { WeatherCurrentPredictionStyled } from './WeatherCurrentPredictionStyled'
import { WiSunset, WiSunrise, WiHumidity, WiRaindrop } from 'weather-icons-react'
import { windDirectionIconMap } from '../../utils/js/windDirectionIcons'
import { findPropertyValueByPeriod, getCurrentHour, getCurrentDate } from '../../utils/js/helpers'

const WeatherCurrentPrediction = ({ hourlyData, diaryData }) => {
  
  const currentHour = getCurrentHour()
  const currentDate = getCurrentDate()

  const currentDay = hourlyData?.data[0]?.prediccion?.dia.find(day => day.fecha === currentDate)
  const { 
    orto: sunriseTime = '', 
    ocaso: sunsetTime = '', 
    temperatura = [], 
    precipitacion = [], 
    humedadRelativa = [], 
    vientoAndRachaMax = [] } = currentDay || {}

  const currentTemp = findPropertyValueByPeriod(temperatura, currentHour, ['value'])
  const currentPrecipitation = findPropertyValueByPeriod(precipitacion, currentHour, ['value'])
  const currentHumidity = findPropertyValueByPeriod(humedadRelativa, currentHour, ['value'])
  const currentWind = findPropertyValueByPeriod(vientoAndRachaMax, currentHour, ['velocidad', 'direccion'])

  const velocidad = currentWind?.velocidad || ''
  const direccion = currentWind?.direccion || ''
  const currentIcon = windDirectionIconMap[direccion] || null

  const matchingDay = diaryData?.data[0]?.prediccion?.dia.find((day) => day.fecha === currentDate)
  const { temperatura: { minima: temperatureMin = '', maxima: temperatureMax = '' } = {} } = matchingDay || {}

  return (
    <WeatherCurrentPredictionStyled>
      <div>
        <div>
          <WiSunrise size={28} color='var(--wa-deep-blue)' />
          <span>{sunriseTime}</span>
        </div>
        <span>{currentTemp?.value}</span>
        <div>
          <WiSunset size={28} color='var(--wa-deep-blue)' />
          <span>{sunsetTime}</span>
        </div>
      </div>
      <div>
        <ul>
          <li className='temperature__wrapper'><span>{temperatureMax}</span>/<span>{temperatureMin}</span></li>
          <li className='humidity__wrapper'><span>{currentHumidity?.value}</span><WiHumidity size={28} color='var(--wa-deep-blue)' /></li>
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
            <span>{currentPrecipitation?.value} mm. <WiRaindrop size={28} color='var(--wa-deep-blue)' /></span>
          </li>
        </ul>
      </div>
    </WeatherCurrentPredictionStyled>
  )
}

export default WeatherCurrentPrediction
