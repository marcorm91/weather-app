import React from 'react'
import { WeatherCurrentSunsetTempStyled } from './WeatherCurrentSunsetTempStyled'
import { WiSunset, WiSunrise } from "weather-icons-react"

const WeatherCurrentSunsetTemp = ({ data }) => {
  const currentDate = new Date()
  const currentHour = currentDate.getHours().toString().padStart(2, '0')
  const currentInfo = data?.data[0]
  const sunriseTime = currentInfo?.prediccion?.dia[0]?.orto || ''
  const sunsetTime = currentInfo?.prediccion?.dia[0]?.ocaso || ''
  const temperatureList1 = currentInfo?.prediccion?.dia[0]?.temperatura
  const temperatureList2 = currentInfo?.prediccion?.dia[1]?.temperatura
  let currentTemp

  // Los datos se van manejando en 2 arrays.  Día actual y día posterior.
  function findValueByPeriodo(list, currentHour) {
    const foundItem = list.find(item => item.periodo === currentHour)
    return foundItem ? foundItem.value : null
  }
  
  currentTemp = findValueByPeriodo(temperatureList1, currentHour)
  
  if (!currentTemp) {
    currentTemp = findValueByPeriodo(temperatureList2, currentHour)
  }

  return (
    <WeatherCurrentSunsetTempStyled>
      <div>
        <WiSunrise size={28} color='var(--wa-deep-blue)' />
        <span>{sunriseTime}</span>
      </div>
      <span>{currentTemp}</span>
      <div>
        <WiSunset size={28} color='var(--wa-deep-blue)' />
        <span>{sunsetTime}</span>
      </div>
    </WeatherCurrentSunsetTempStyled>
  );
}

export default WeatherCurrentSunsetTemp
