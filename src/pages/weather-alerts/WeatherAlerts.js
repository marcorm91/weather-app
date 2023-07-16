import React from 'react'
import { WeatherAlertsStyled } from './WeatherAlertsStyled'
import WeatherAccordion from '../../components/weather-accordion/WeatherAccordion'

const WeatherAlerts = () => {
  return (
    <WeatherAlertsStyled>
      <WeatherAccordion />
    </WeatherAlertsStyled>
  )
}

export default WeatherAlerts
