import React from 'react'
import { WeatherCurrentSkyStyled } from './WeatherCurrentSkyStyled'
import { skyIconMap } from '../../utils/js/skyIcons';

const WeatherCurrentSky = ({ data }) => {
  const currentDate = new Date()
  const currentHour = currentDate.getHours().toString().padStart(2, '0')
  const currentInfo = data?.data[0]
  const skyList1 = currentInfo.prediccion?.dia[0]?.estadoCielo
  const skyList2 = currentInfo.prediccion?.dia[1]?.estadoCielo
  let currentSky
  
  // Los datos se van manejando en 2 arrays.  Día actual y día posterior.
  function findValueByPeriodo(list, currentHour) {
    const foundItem = list.find(item => item.periodo === currentHour)
    return foundItem ? { value: foundItem.value, descripcion: foundItem.descripcion } : null
  }
  
  currentSky = findValueByPeriodo(skyList1, currentHour)
  
  if (!currentSky) {
    currentSky = findValueByPeriodo(skyList2, currentHour)
  }
  
  const { value, descripcion } = currentSky || {}
  const currentIcon = skyIconMap[value] || null
    
  return (
    <WeatherCurrentSkyStyled>
      {currentIcon(128, "var(--wa-deep-blue)")}
      <span>{descripcion}</span>
    </WeatherCurrentSkyStyled>
  );
}

export default WeatherCurrentSky
