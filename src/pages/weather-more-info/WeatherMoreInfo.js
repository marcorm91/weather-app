import React from 'react'
import { useLocation } from 'react-router-dom'
import { WeatherMoreInfoStyled } from './WeatherMoreInfoStyled'
import WeatherMap from '../../components/weather-map/WeatherMap'

const WeatherMoreInfo = () => {
  const location = useLocation()
  const { data } = location.state || {}
  return (
    <WeatherMoreInfoStyled>
      <WeatherMap municipalityObject={data} />
    </WeatherMoreInfoStyled>
  )
}

export default WeatherMoreInfo
