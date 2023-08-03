import React from 'react'
import { WeatherPredictionHoursStyled, WeatherPredictionHoursSkeletonStyled } from './WeatherPredictionHoursStyled'
import { skyIconMap } from '../../utils/js/skyIcons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faCloudRain, faCloudSunRain, faSnowflake, faTemperatureQuarter, faWind } from '@fortawesome/free-solid-svg-icons'
import { getCurrentHour, getCurrentDate } from '../../utils/js/helpers'

const WeatherPredictionHours = ( { hourlyPredictionData } ) => {

  const currentHour = getCurrentHour()
  const currentDate = getCurrentDate()
  const numHours = 13
  const predictionData = hourlyPredictionData?.data[0]?.prediccion?.dia
  const dataTypes = ['temperatura', 'estadoCielo', 'nieve', 'precipitacion', 'vientoAndRachaMax']

  const getNextData = (currentDayData, dataType) => {
    const currentHourIndex = currentDayData[dataType].findIndex(data => data.periodo === currentHour)
    let nextData = []
    if (currentHourIndex !== -1) {
      let i = currentHourIndex
      let j = predictionData.indexOf(currentDayData)
      while (nextData.length < numHours) {
        if (i < predictionData[j][dataType].length) {
          const data = predictionData[j][dataType][i]
          if (dataType === 'vientoAndRachaMax' && (!data.hasOwnProperty('direccion') || !data.hasOwnProperty('velocidad'))) {
            i++
            continue
          }
          nextData.push(data)
          i++
        } else {
          j++
          i = 0
          if (j >= predictionData.length) {
            break
          }
        }
      }
    }
    return nextData
  }

  let weatherData = {}
  if (predictionData) {
    const currentDayData = predictionData.find(data => data.fecha === currentDate)
    if (currentDayData) {
      dataTypes.forEach(dataType => {
        weatherData[dataType] = getNextData(currentDayData, dataType)
      })
    }
  }

  if(!hourlyPredictionData){ 
    return (
      <WeatherPredictionHoursStyled>
        <WeatherPredictionHoursSkeletonStyled>
        {Array(numHours+1).fill().map((_, i) => (
            <li key={i}>
              {Array(6).fill().map((_, j) => (
                <div key={j} className='loading-skeleton'></div>
              ))}
            </li>
          ))}
        </WeatherPredictionHoursSkeletonStyled>
      </WeatherPredictionHoursStyled>
    )
  }

  return (
    <WeatherPredictionHoursStyled>
        <ul>
          <li>
            <div>
              <FontAwesomeIcon 
                icon={faClock} 
                size='lg' 
                color='var(--wa-deep-blue)' />
            </div>
            <div>
              <FontAwesomeIcon 
                icon={faCloudSunRain} 
                size='lg' 
                color='var(--wa-deep-blue)' />
            </div>
            <div>
              <FontAwesomeIcon 
                icon={faWind} 
                size='lg' 
                color='var(--wa-deep-blue)' />
            </div>
            <div>
              <FontAwesomeIcon 
                icon={faCloudRain} 
                size='lg' 
                color='var(--wa-deep-blue)' />
            </div>
            <div>
              <FontAwesomeIcon 
                icon={faSnowflake} 
                size='lg' 
                color='var(--wa-deep-blue)' />
            </div>
            <div>
              <FontAwesomeIcon 
                icon={faTemperatureQuarter} 
                size='lg' 
                color='var(--wa-deep-blue)' />
            </div>
          </li>
          {Array(numHours).fill().map((_, i) => {
            const nextHour = (parseInt(currentHour, 10) + i) % 24
            return ( 
              <li key={i}>
                <div>{`${nextHour < 10 ? '0' : ''}${nextHour}h`}</div>
                <div>{skyIconMap[weatherData.estadoCielo?.[i]?.value]("36", "var(--wa-deep-blue)")}</div>
                <div>                  
                  {weatherData.vientoAndRachaMax?.[i]?.direccion}<br/>
                  {weatherData.vientoAndRachaMax?.[i]?.velocidad} Km/h</div>
                <div>{weatherData.precipitacion?.[i]?.value} mm.</div>
                <div>{weatherData.nieve?.[i]?.value} cm.</div>
                <div>{weatherData.temperatura?.[i]?.value}º</div>
              </li>
            )
          })}
        </ul>
    </WeatherPredictionHoursStyled>
  )
}

export default WeatherPredictionHours
