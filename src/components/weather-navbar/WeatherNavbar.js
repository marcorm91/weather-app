import React from 'react'
import { Link } from 'react-router-dom'
import { WeatherNavbarStyled } from './WeatherNavbarStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const WeatherNavbar = ({ items, onClose }) => {
  const handleMenuClose = () => {
    onClose()
  }

  const block1Items = items.filter((item) => item.block === 1)
  const block2Items = items.filter((item) => item.block === 2)

  return (
    <WeatherNavbarStyled>
      <div className="logo__wrapper">
        <div className="wa-icon-logo-blue"></div>
        <span>Weather app</span>
      </div>
      <button className="button-close" onClick={handleMenuClose}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <div className="content__wrapper">
        {block1Items.length > 0 && (
          <ul className="block-1__wrapper">
            {block1Items.map((item, index) => (
              <li key={index}>
                <Link to={item.path}>
                    <FontAwesomeIcon icon={item.icon} /> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {block2Items.length > 0 && (
          <ul className="block-2__wrapper">
            {block2Items.map((item, index) => (
              <li key={index}>
                <Link to={item.path}>
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
