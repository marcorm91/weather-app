import React from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { WeatherPredictionHoursStyled, WeatherPredictionHoursSkeletonStyled } from './WeatherPredictionHoursStyled'
import { skyIconMap } from '../../utils/js/skyIcons'
import { windDirectionIconMap } from '../../utils/js/windDirectionIcons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faCloudRain, faCloudSunRain, faSnowflake, faTemperatureQuarter, faWind } from '@fortawesome/free-solid-svg-icons'
import { getCurrentHour, getCurrentDate } from '../../utils/js/helpers'
import WeatherChartsPredictionHours from '../weather-charts-prediction-hours/WeatherChartsPredictionHours'
import WeatherAdWarningDays from '../weather-ad-warning/WeatherAdWarning'

const WeatherPredictionHours = ( { hourlyPredictionData } ) => {

  const currentHour = getCurrentHour()
  const currentDate = getCurrentDate()
  const numHours = 25
  const predictionData = hourlyPredictionData?.data[0]?.prediccion?.dia

  const dataTypes = ['temperatura', 'estadoCielo', 'nieve', 'precipitacion', 'vientoAndRachaMax']

  // Return the values following the current one, set by the constant numHours, to store them in an array for later processing.
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

  const getWeatherData = () => {
    if (predictionData) {
      const currentDayData = predictionData.find(data => data.fecha === currentDate)
      if (currentDayData) {
        return dataTypes.reduce((weatherData, dataType) => {
          weatherData[dataType] = getNextData(currentDayData, dataType)
          return weatherData
        }, {})
      }
    }
    return {}
  }

  // Converts the previously generated array into an object for easier data handling
  const getChartData = (weatherData) => {
    const chartDataTypes = ['temperatura', 'vientoAndRachaMax', 'precipitacion', 'nieve']
    return chartDataTypes.reduce((chartData, dataType) => {
      if (weatherData[dataType]) {
        chartData[dataType] = weatherData[dataType].map((data) => {
          let newData = {}
          if (dataType === 'vientoAndRachaMax') {
            newData['Viento'] = data.velocidad[0]
          } else {
            newData[dataType.charAt(0).toUpperCase() + dataType.slice(1)] = data.value
          }
          return newData
        })
      }
      return chartData
    }, {})
  }

  const weatherData = getWeatherData()
  const chartData = getChartData(weatherData)

  // If the data has not yet been loaded, a loading skeleton will be generated.
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

  const renderWeatherData = () => {
    return (
      <WeatherPredictionHoursStyled>
        <ul className='prediction-hours__wrapper'>
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
              <li key={i} className={nextHour === 0 ? 'limit-day' : undefined}>
                <WeatherAdWarningDays data={weatherData} index={i} type="hour" />
                <div>
                  <time>{`${nextHour < 10 ? '0' : ''}${nextHour}h`}</time>
                </div>
                <div>
                  <span data-tooltip-id={`tooltip-sky-${i}`}>{skyIconMap[weatherData.estadoCielo?.[i]?.value]("36", "var(--wa-deep-blue)")}</span>
                  <ReactTooltip
                    id={`tooltip-sky-${i}`}
                    place='bottom'
                    content={`${weatherData.estadoCielo?.[i]?.descripcion}`} />
                </div>
                <div>
                  <span data-tooltip-id={`tooltip-wind-${i}`}>
                    <div>
                      {weatherData.vientoAndRachaMax?.[i]?.direccion} 
                      {windDirectionIconMap[weatherData.vientoAndRachaMax?.[i]?.direccion]("18", "var(--wa-deep-blue)")}
                    </div>
                    {weatherData.vientoAndRachaMax?.[i]?.velocidad} Km/h
                    <ReactTooltip
                      id={`tooltip-wind-${i}`}
                      place='bottom'
                      content={
                        `Viento de componente ${weatherData.vientoAndRachaMax?.[i]?.direccion} 
                        con rachas de ${weatherData.vientoAndRachaMax?.[i]?.velocidad} Km/h`} />
                  </span>                  
                </div>
                <div>
                  <span data-tooltip-id={`tooltip-rain-${i}`}>{weatherData.precipitacion?.[i]?.value} mm.</span>
                  <ReactTooltip
                    id={`tooltip-rain-${i}`}
                    place='bottom'
                    content={`Lluvia acumulada de ${weatherData.precipitacion?.[i]?.value} mm.`} />
                </div>
                <div>
                  <span data-tooltip-id={`tooltip-snow-${i}`}>{weatherData.nieve?.[i]?.value} cm.</span>
                  <ReactTooltip
                    id={`tooltip-snow-${i}`}
                    place='bottom'
                    content={`Grosor nieve de ${weatherData.nieve?.[i]?.value} cm.`} />
                </div>
                <div>
                  <span data-tooltip-id={`tooltip-temp-${i}`}>{weatherData.temperatura?.[i]?.value}º</span>
                  <ReactTooltip
                    id={`tooltip-temp-${i}`}
                    place='bottom'
                    content={`Temperatura de ${weatherData.temperatura?.[i]?.value}º`} />
                </div>
              </li>
            )
          })}
        </ul>
        <WeatherChartsPredictionHours 
          chartTempData={chartData.temperatura} 
          chartWindData={chartData.vientoAndRachaMax}
          chartRainData={chartData.precipitacion}
          chartSnowData={chartData.nieve} />
      </WeatherPredictionHoursStyled>
    )
  }

  return renderWeatherData()

}

export default WeatherPredictionHours
