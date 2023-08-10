import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { WeatherNavbarStyled } from './WeatherNavbarStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

const WeatherNavbar = ({ items, onClose }) => {
  const { t } = useTranslation()
  const location = useLocation()

  const handleMenuClose = () => {
    onClose()
  }

  const handleMenuItemClick = () => {
    onClose()
  }

  const block1Items = items.filter((item) => item.block === 1)
  const block2Items = items.filter((item) => item.block === 2)

  const isCurrentPage = (path) => {
    return location.pathname === path
  }

  return (
    <WeatherNavbarStyled>
      <div className="logo__wrapper">
        <div className="wa-icon-logo-blue"></div>
        <span>{t('HEADER.TITLE')}</span>
      </div>
      <button className="button-close" onClick={handleMenuClose}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <div className="content__wrapper">
        {block1Items.length > 0 && (
          <ul className="block-1__wrapper">
            {block1Items.map((item, index) => (
              <li key={index}
                  className={isCurrentPage(item.path) ? 'active' : ''}>
                <Link
                  to={item.path}
                  onClick={handleMenuItemClick}
                >
                  <FontAwesomeIcon icon={item.icon} /> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {block2Items.length > 0 && (
          <ul className="block-2__wrapper">
            {block2Items.map((item, index) => (
              <li key={index}
                  className={isCurrentPage(item.path) ? 'active' : ''} >
                <Link
                  to={item.path}
                  onClick={handleMenuItemClick}
                >
                  <FontAwesomeIcon icon={item.icon} /> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </WeatherNavbarStyled>
  )
}

export default WeatherNavbar