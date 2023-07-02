import React from 'react'
import { WeatherCurrentSkyStyled } from './WeatherCurrentSkyStyled'
import { skyIconMap } from '../../utils/js/skyIcons'
import { findPropertyValueByPeriod, getCurrentHour } from '../../utils/js/helpers'

const WeatherCurrentSky = ({ hourlyData }) => {

  // Getting current date and hour for making later comparisons
  const currentHour = getCurrentHour()

  /**
   * HOURLY DATA
   */

  const skyList1 = hourlyData?.data[0].prediccion?.dia[0]?.estadoCielo
  const skyList2 = hourlyData?.data[0].prediccion?.dia[1]?.estadoCielo
  const currentSky = findPropertyValueByPeriod(skyList1, currentHour, ['value', 'descripcion']) 
                    || findPropertyValueByPeriod(skyList2, currentHour, ['value', 'descripcion'])

  const { value = '', descripcion = '' } = currentSky || {}
  const currentIcon = skyIconMap[value] || null
    
  return (
    <WeatherCurrentSkyStyled>
      {currentIcon(128, "var(--wa-deep-blue)")}
      <span>{descripcion}</span>
    </WeatherCurrentSkyStyled>
  )
}

export default WeatherCurrentSky
