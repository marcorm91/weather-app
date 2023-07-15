import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { WeatherHeaderStyled } from './WeatherHeaderStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes, faHome, faIdBadge, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import WeatherLangSelector from '../weather-lang-selector/WeatherLangSelector'
import WeatherNavbar from '../weather-navbar/WeatherNavbar'

const WeatherHeader = () => {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems = [
    { label: `${t('NAVBAR.HOME_PAGE')}`, path: '/', block: 1, icon: faHome },
    { label: `${t('NAVBAR.ALERTS')}`, path: '/', block: 1, icon: faTriangleExclamation },
    { label: `${t('NAVBAR.CONTACT')}`, path: '/contact', block: 2, icon: faIdBadge },
  ]

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <WeatherHeaderStyled>
      <div className="title__wrapper">
        <div className="wa-icon-logo-white"></div>
        <h1>{t('HEADER.TITLE')}</h1>
      </div>
      <div className="actions__wrapper">
        <WeatherLangSelector />
        <button onClick={toggleMenu}>
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>
      </div>
      {isMenuOpen && <WeatherNavbar items={navItems} onClose={handleMenuClose} />}
    </WeatherHeaderStyled>
  )
}

export default WeatherHeader
