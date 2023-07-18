import React from 'react'
import { useLocation } from 'react-router-dom'
import { WeatherMoreInfoStyled } from './WeatherMoreInfoStyled'

const WeatherMoreInfo = () => {
  const location = useLocation()
  const { data } = location.state || {}

  console.log(data)

  return (
    <WeatherMoreInfoStyled>
      More info page
    </WeatherMoreInfoStyled>
  )
}

export default WeatherMoreInfo
