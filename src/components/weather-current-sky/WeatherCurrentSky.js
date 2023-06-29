import React from 'react'
import { WeatherCurrentSkyStyled } from './WeatherCurrentSkyStyled'
import { skyIconMap } from '../../utils/js/skyIcons';

const WeatherCurrentSky = ({ hourlyData }) => {

  // Getting current date and hour for making later comparisons
  const currentDate = new Date()
  const currentHour = currentDate.getHours().toString().padStart(2, '0')

  /**
   * HOURLY DATA
   */

  const skyList1 = hourlyData?.data[0].prediccion?.dia[0]?.estadoCielo
  const skyList2 = hourlyData?.data[0].prediccion?.dia[1]?.estadoCielo
  let currentSky
  
   // The data handling is performed to control 2 arrays within the hourlyData object
   const findSkyValueByPeriod = (list, currentHour) => {
    const foundItem = list.find(item => item.periodo === currentHour);
    return foundItem ? { value: foundItem.value, descripcion: foundItem.descripcion } : null;
  };
  currentSky = findSkyValueByPeriod(skyList1, currentHour)
  currentSky = !currentSky ? findSkyValueByPeriod(skyList2, currentHour) : currentSky;

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
