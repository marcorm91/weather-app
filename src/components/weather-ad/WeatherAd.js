import React, { useState } from 'react'
import { WeatherAdStyled } from './WeatherAdStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const WeatherAd = () => {
  const [isOpen, setIsOpen] = useState(true)

  const onClose = () => {
    setIsOpen(false)
  }

  if (!isOpen) {
    return null
  }

  return (
    <WeatherAdStyled className="weather-ad__wrapper">
      <span>Lorem ipsum dolor aemet...</span>
      <button onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
      </button>
    </WeatherAdStyled>
  )
}

export default WeatherAd