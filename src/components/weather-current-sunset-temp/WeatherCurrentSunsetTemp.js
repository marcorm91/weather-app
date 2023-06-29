import React from 'react'
import { WeatherCurrentSunsetTempStyled } from './WeatherCurrentSunsetTempStyled'
import { WiSunset, WiSunrise } from "weather-icons-react"

const WeatherCurrentSunsetTemp = ({ hourlyData, diaryData }) => {
  
  // Getting current date and hour for making later comparisons
  const currentDate = new Date()
  const currentHour = currentDate.getHours().toString().padStart(2, '0') 

  // Hourly data
  const sunriseTime = hourlyData?.data[0]?.prediccion?.dia[0]?.orto || ''
  const sunsetTime = hourlyData?.data[0]?.prediccion?.dia[0]?.ocaso || ''
  const temperatureList1 = hourlyData?.data[0]?.prediccion?.dia[0]?.temperatura
  const temperatureList2 = hourlyData?.data[0]?.prediccion?.dia[1]?.temperatura
  let currentTemp

  // Diary data

  // The data handling is performed to control 2 arrays within the hourlyData object
  const findValueByPeriodo = (list, currentHour) => {
    const foundItem = list.find(item => item.periodo === currentHour);
    return foundItem ? foundItem.value : null;
  };
  currentTemp = findValueByPeriodo(temperatureList1, currentHour)
  currentTemp = !currentTemp ? findValueByPeriodo(temperatureList2, currentHour) : currentTemp;

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
