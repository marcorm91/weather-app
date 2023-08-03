import React from 'react'
import { WeatherCurrentSkyStyled } from './WeatherCurrentSkyStyled'
import { skyIconMap } from '../../utils/js/skyIcons'
import { findPropertyValueByPeriod, getCurrentHour, getCurrentDate } from '../../utils/js/helpers'

const WeatherCurrentSky = ({ hourlyData }) => {

  const currentHour = getCurrentHour()
  const currentDate = getCurrentDate()

  // Use .find() to search for the current day in the array
  const currentDay = hourlyData?.data[0]?.prediccion?.dia.find(day => day.fecha === currentDate)

  // Then, if currentDay exists, we extract the sky information for that day
  const skyList = currentDay?.estadoCielo
  const currentSky = findPropertyValueByPeriod(skyList, currentHour, ['value', 'descripcion'])

  const { value = '', descripcion = '' } = currentSky || {}
  const currentIcon = skyIconMap[value] || null
    
  return (
    <WeatherCurrentSkyStyled>
      {currentIcon && currentIcon(128, "var(--wa-deep-blue)")}
      <span>{descripcion}</span>
    </WeatherCurrentSkyStyled>
  )
}

export default WeatherCurrentSky
