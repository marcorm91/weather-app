import React, { useEffect } from 'react'
import { WeatherDetailChartStyled } from './WeatherDetailChartStyled'
import WeatherChart from '../weather-chart/WeatherChart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

const WeatherDetailChart = ( { chartProps, closeModal } ) => {

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeModal])

  return (
    <WeatherDetailChartStyled>
        <button onClick={closeModal}>
            <FontAwesomeIcon icon={faClose} color='var(--wa-deep-blue)' size='2x' />
        </button>
        <WeatherChart {...chartProps} />
    </WeatherDetailChartStyled>
  )
}

export default WeatherDetailChart
