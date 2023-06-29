import React from 'react'
import { WeatherCurrentPredictionStyled } from './WeatherCurrentPredictionStyled'
import { WiSunset, WiSunrise } from "weather-icons-react"

const WeatherCurrentPrediction = ({ hourlyData, diaryData }) => {
  
  // Getting current date and hour for making later comparisons
  const currentDate = new Date()
  const currentHour = currentDate.getHours().toString().padStart(2, '0') 

  /**
   * HOURLY DATA
   */

  const sunriseTime = hourlyData?.data[0]?.prediccion?.dia[0]?.orto || ''
  const sunsetTime = hourlyData?.data[0]?.prediccion?.dia[0]?.ocaso || ''
  const temperatureList1 = hourlyData?.data[0]?.prediccion?.dia[0]?.temperatura
  const temperatureList2 = hourlyData?.data[0]?.prediccion?.dia[1]?.temperatura
  let currentTemp

  // The data handling is performed to control 2 arrays within the hourlyData object
  const findTempValueByPeriod = (list, currentHour) => {
    const foundItem = list.find(item => item.periodo === currentHour);
    return foundItem ? foundItem.value : null;
  };
  currentTemp = findTempValueByPeriod(temperatureList1, currentHour)
  currentTemp = !currentTemp ? findTempValueByPeriod(temperatureList2, currentHour) : currentTemp;

  // Get the value closest to the current relative humidity from the lists
  const currentHumidityList1 = hourlyData?.data[0]?.prediccion?.dia[0].humedadRelativa
  const currentHumidityList2 = hourlyData?.data[0]?.prediccion?.dia[1].humedadRelativa
  let currentHumidity

  const findHumidityValueByPeriod = (list, currentHour) => {
    const foundItem = list.find(item => item.periodo === currentHour);
    return foundItem.value
  };
  currentHumidity = findHumidityValueByPeriod(currentHumidityList1, currentHour)
  currentHumidity = !currentHumidity ? findHumidityValueByPeriod(currentHumidityList2, currentHour) : currentHumidity;

  /**
   * DIARY DATA
   */

  // Get max and min temperature
  const temperatureMin = diaryData?.data[0]?.prediccion?.dia[0]?.temperatura.minima || ''
  const temperatureMax = diaryData?.data[0]?.prediccion?.dia[0]?.temperatura.maxima || ''

  return (
    <WeatherCurrentPredictionStyled>
      <div>
        <div>
          <WiSunrise size={28} color='var(--wa-deep-blue)' />
          <span>{sunriseTime}</span>
        </div>
        <span>{currentTemp}</span>
        <div>
          <WiSunset size={28} color='var(--wa-deep-blue)' />
          <span>{sunsetTime}</span>
        </div>
      </div>
      <div>
        <ul>
          <li className='temperature__wrapper'><span>{temperatureMax}</span>/<span>{temperatureMin}</span></li>
          <li className='humidity__wrapper'><span>{currentHumidity}</span></li>
          <li className='wind__wrapper'></li>
        </ul>
        
      </div>
      
    </WeatherCurrentPredictionStyled>
  );
}

export default WeatherCurrentPrediction
