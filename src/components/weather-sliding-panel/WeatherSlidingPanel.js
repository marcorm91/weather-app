import React, { useEffect } from 'react'
import { WeatherSlidingPanelStyled } from './WeatherSlidingPanelStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import WeatherCurrentSunsetTemp from '../weather-current-sunset-temp/WeatherCurrentSunsetTemp'
import WeatherCurrentSky from '../weather-current-sky/WeatherCurrentSky'

const WeatherSlidingPanel = ({ data, onClose, isOpen }) => {
  const { t } = useTranslation()
  const infoData = data?.data[0] || {}
  const { nombre = '', provincia = '' } = infoData

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  if (!isOpen) {
    return null
  }

  return (
    <WeatherSlidingPanelStyled isOpen={isOpen}>
      <header>
        <button onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>{`${nombre} (${provincia})`}</h2>
      </header>
      <div className="content__wrapper">
        <WeatherCurrentSunsetTemp data={data} />
        <WeatherCurrentSky data={data} />
      </div>
      <div className="footer__wrapper">
        <button className="btn btn-primary">{t('HOME.PANEL_INFO.MORE_INFO')}</button>
      </div>
    </WeatherSlidingPanelStyled>
  )
}

export default WeatherSlidingPanel
