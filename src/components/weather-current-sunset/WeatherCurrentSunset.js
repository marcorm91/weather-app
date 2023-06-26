import React, { useEffect, useState } from 'react'
import { WeatherCurrentSunsetStyled } from './WeatherCurrentSunsetStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpLong, faDownLong, faSun } from '@fortawesome/free-solid-svg-icons'

const WeatherCurrentSunset = ({ data }) => {
  const [currentHour, setCurrentHour] = useState('')
  const [currentMinute, setCurrentMinute] = useState('')
  const currentInfo = data?.data[0]

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date()
      const hour = now.getHours().toString().padStart(2, '0')
      const minute = now.getMinutes().toString().padStart(2, '0')
      setCurrentHour(hour)
      setCurrentMinute(minute)
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const sunriseTime = currentInfo?.prediccion?.dia[0]?.orto || ''
  const sunsetTime = currentInfo?.prediccion?.dia[0]?.ocaso || ''

  return (
    <WeatherCurrentSunsetStyled>
      <div className="sunset__wrapper">
        <div>
          <FontAwesomeIcon icon={faSun} color="var(--wa-deep-blue)" />
          <FontAwesomeIcon icon={faUpLong} color="var(--wa-deep-blue)" size="2xs" />
        </div>
        <span>{sunriseTime}</span>
      </div>
      <time>
        <span>{currentHour}</span>
        <span>{currentMinute}</span>
      </time>
      <div className="sunset__wrapper">
        <span>{sunsetTime}</span>
        <div>
          <FontAwesomeIcon icon={faSun} color="var(--wa-deep-blue)" />
          <FontAwesomeIcon icon={faDownLong} color="var(--wa-deep-blue)" size="2xs" />
        </div>
      </div>
    </WeatherCurrentSunsetStyled>
  )
}

export default WeatherCurrentSunset
