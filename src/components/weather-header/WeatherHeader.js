import React, { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { WeatherHeaderStyled } from './WeatherHeaderStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes, faHome, faIdBadge, faTriangleExclamation, faClockRotateLeft} from '@fortawesome/free-solid-svg-icons'
import WeatherLangSelector from '../weather-lang-selector/WeatherLangSelector'
import WeatherNavbar from '../weather-navbar/WeatherNavbar'
import RecentSearchesContext from '../../utils/js/RecentSearchesContext'
import { Link } from 'react-router-dom'

const WeatherHeader = () => {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { recentSearches } = useContext(RecentSearchesContext)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems = [
    { label: `${t('NAVBAR.HOME_PAGE')}`, path: '/', block: 1, icon: faHome },
    {
      label: `${t('NAVBAR.LAST_SEARCH')}`,
      block: 1,
      path: '/more-info',
      className: 'last-searches',
      hideIfNoSubItems: true,
      icon: faClockRotateLeft,
      subItems: recentSearches.map((search) => ({
        label: search.nombre,
        to: '/more-info',
        state: search.state,
      })),
    },
    {
      label: `${t('NAVBAR.ALERTS')}`,
      path: '/alerts',
      block: 1,
      icon: faTriangleExclamation,
    },
    {
      label: `${t('NAVBAR.CONTACT')}`,
      path: '/contact',
      block: 2,
      icon: faIdBadge,
    },
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
      <Link to="/" className="title__wrapper">
        <div className="wa-icon-logo-white"></div>
        <h1>{t('HEADER.TITLE')}</h1>
      </Link>
      <div className="actions__wrapper">
        <WeatherLangSelector />
        <button onClick={toggleMenu}>
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>
      </div>
      {isMenuOpen && (
        <WeatherNavbar items={navItems} onClose={handleMenuClose} isOpen={isMenuOpen} />
      )}
    </WeatherHeaderStyled>
  )
}

export default WeatherHeader
