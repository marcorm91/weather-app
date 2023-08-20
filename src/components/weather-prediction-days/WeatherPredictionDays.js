import React from 'react'
import { WeatherPredictionDaysStyled } from './WeatherPredictionDaysStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { skyIconMap } from '../../utils/js/skyIcons'
import { windDirectionIconMap } from '../../utils/js/windDirectionIcons'
import { faCalendar, faClock, faCloudRain, faCloudSunRain, faSnowflake, faTemperatureQuarter, faWind } from '@fortawesome/free-solid-svg-icons'
import { getCurrentHour, getCurrentDate, getDayOfWeek, transformDate, formatDate } from '../../utils/js/helpers'
import { WeatherPredictionHoursSkeletonStyled, WeatherPredictionHoursStyled } from '../weather-prediction-hours/WeatherPredictionHoursStyled'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import WeatherAdWarningDays from '../weather-ad-warning/WeatherAdWarning'
import WeatherChartsPredictionDays from '../weather-charts-prediction-days/WeatherChartsPredictionDays'

const WeatherPredictionDays = ({ diaryPredictionData }) => {

  const currentHour = getCurrentHour()
  const currentDate = getCurrentDate()
  const predictionData = diaryPredictionData?.data[0]?.prediccion?.dia

  // Gets the current period and removes previous ones if the current time is later than the printed one
  const filterPeriods = (periods) => {
    const hour = parseInt(currentHour)
    return periods.filter(({ periodo }) => {
        const end = periodo.split('-').map(Number)[1]
        return hour < end
    })
  }

  // Maps over a subset of periods and renders each one using the provided renderer function
  const renderPeriods = (periods, renderer, limit = periods.length) => {
    return periods.slice(-limit).map((ele, j) => renderer(ele, j))
  }

  // Format period 00-12 to 00h - 12h for example.  If it's undefined show -
  const formatTimePeriod = (period) => {
    if(!period) return '-'
    const [start, end] = period.split('-')
    return `${start}h - ${end}h`
  }

  // Filter relevant periods by objects
  const filterRelevantPeriods = (data, relevantPeriods) => {
    return data.filter(item => relevantPeriods.some(periodObj => periodObj.periodo === item.periodo))
  }

  // If the data has not yet been loaded, a loading skeleton will be generated.
  if (!predictionData) {
    return (
      <WeatherPredictionHoursStyled>
        <WeatherPredictionHoursSkeletonStyled>
        {Array(7).fill().map((_, i) => (
            <li key={i}>
              {Array(7).fill().map((_, j) => (
                <div key={j} className='loading-skeleton'></div>
              ))}
            </li>
          ))}
        </WeatherPredictionHoursSkeletonStyled>
      </WeatherPredictionHoursStyled>
    )
  }

  // Get min and max temperatures by days
  let temperatures = predictionData.map(obj => {
    return { day: obj.fecha, maxTemperature: obj.temperatura.maxima, minTemperature: obj.temperatura.minima }
  })

  return (
    <WeatherPredictionDaysStyled>
        <ul className='prediction-days__wrapper'>
            <li>
                <div>
                  <FontAwesomeIcon 
                    icon={faCalendar} 
                    size='lg' 
                    color='var(--wa-deep-blue)' />
                </div>
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
            {predictionData.map((obj, i) => {
                
                if (obj.fecha < currentDate) {
                  return null
                }
                
                const isToday = obj.fecha === currentDate;
                const relevantPeriods = isToday ? filterPeriods(obj.estadoCielo.slice(-4)) : obj.estadoCielo
                const relevantWindPeriods = filterRelevantPeriods(obj.viento, relevantPeriods)
                const relevantPrecPeriods = filterRelevantPeriods(obj.probPrecipitacion, relevantPeriods)
                const relevantSnowPeriods = filterRelevantPeriods(obj.cotaNieveProv, relevantPeriods)                   
                return (
                  <li key={i}>
                      <WeatherAdWarningDays data={obj} index={i} type='day'/>
                      <div>
                          <time>
                            {getDayOfWeek(obj.fecha)} <br/>
                            {transformDate(formatDate(obj.fecha))}
                          </time>
                      </div>
                      <div>
                      {renderPeriods(relevantPeriods, (ele, j) => 
                        <time key={j}>{formatTimePeriod(ele.periodo)}</time>
                      )}
                      </div>
                      <div>
                      {renderPeriods(relevantPeriods, (ele, j) => 
                          <span data-tooltip-id={`tooltip-sky-${i}-${j}`} key={j}>
                            {skyIconMap[ele?.value]("36", "var(--wa-deep-blue)")}
                            <ReactTooltip
                              id={`tooltip-sky-${i}-${j}`}
                              place='bottom'
                              content={`${ele?.descripcion}`} />
                          </span>
                      )}
                      </div>
                      <div>
                      {renderPeriods(relevantWindPeriods, (ele, j) => 
                        <span data-tooltip-id={`tooltip-wind-${i}-${j}`} key={j}>
                          <div>
                            {ele?.direccion}
                            {windDirectionIconMap[ele?.direccion]("18", "var(--wa-deep-blue)")}
                          </div>
                          {ele?.velocidad} Km/h
                          <ReactTooltip
                            id={`tooltip-wind-${i}-${j}`}
                            place='bottom'
                            content={
                              `Viento de componente ${ele?.direccion} 
                              con rachas de ${ele?.velocidad} Km/h`} />
                        </span>
                      )}
                      </div>
                      <div>
                      {renderPeriods(relevantPrecPeriods, (ele, j) => 
                        <span data-tooltip-id={`tooltip-prec-${i}-${j}`} key={j}>
                          {ele?.value} %
                          <ReactTooltip
                            id={`tooltip-prec-${i}-${j}`}
                            place='bottom'
                            content={`Probabilidad de precipitación ${ele?.value}%`} />
                        </span>
                      )}
                      </div>
                      <div>
                      {renderPeriods(relevantSnowPeriods, (ele, j) => 
                        <span data-tooltip-id={`tooltip-snow-${i}-${j}`} key={j}>
                          {ele?.value ? `${ele.value} m.` : '-'}
                          {ele?.value &&
                            <ReactTooltip
                              id={`tooltip-snow-${i}-${j}`}
                              place='bottom'
                              content={`Cota de nieve a nivel de provincia ${ele?.value} m.`} />
                          }
                        </span>
                      )}
                      </div>
                      <div>
                          <span data-tooltip-id={`tooltip-temp-${i}`}>
                            {obj.temperatura.maxima}º / {obj.temperatura.minima}º 
                            <ReactTooltip
                              id={`tooltip-temp-${i}`}
                              place='bottom'
                              content={`Temperatura máxima: ${obj.temperatura.maxima}º Temperatura mínima: ${obj.temperatura.minima}º`} />
                          </span>
                      </div>
                  </li>
                )
            })}
        </ul>
        <WeatherChartsPredictionDays 
          chartTempData={temperatures} />
    </WeatherPredictionDaysStyled>
  )
}

export default WeatherPredictionDays