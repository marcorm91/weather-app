import React, {useContext} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { WeatherNavbarStyled } from './WeatherNavbarStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import WeatherBackdrop from '../weather-backdrop/WeatherBackdrop'
import { AnimatePresence } from 'framer-motion'
import { storeSearchItem } from '../../utils/js/localStorageUtils'
import RecentSearchesContext from '../../utils/js/RecentSearchesContext'

const WeatherNavbar = ({ items, onClose, isOpen }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const { setRecentSearches } = useContext(RecentSearchesContext);

  const handleMenuClose = () => {
    onClose()
  }

  const handleMenuItemClick = () => {
    onClose()
  }

  const handleSubItemMenuClick = (subItem) => {
    const newItem = {
      nombre: subItem.label,
      state: subItem.state
    }
    const newSearches = storeSearchItem(newItem)
    setRecentSearches(newSearches)
    onClose()
  }

  const block1Items = items.filter((item) => 
    item.block === 1 && 
    (!item.hideIfNoSubItems || (item.subItems && item.subItems.length))
  )
  const block2Items = items.filter((item) => 
    item.block === 2 && 
    (!item.hideIfNoSubItems || (item.subItems && item.subItems.length))
  )

  const isCurrentPage = (path) => {
    return location.pathname === path
  }

  const slidingNavbar = {
    open: { x: 0, opacity: 1 },
    closed: { x: '100%', opacity: 0 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <WeatherBackdrop 
            isOpen={isOpen} 
            onClick={onClose} />
          <WeatherNavbarStyled
            key="slidingNavbar"
            initial="closed" 
            animate={isOpen ? "open" : "closed"} 
            exit="closed"
            variants={slidingNavbar} 
            transition={{ type: 'tween', stiffness: 20, damping: 20 }}>
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
                        className={isCurrentPage(item.path) ? 'active' : null}>
                      <Link
                        className={!item.path ? 'no-link' : (item.className) || null}
                        to={item.path}
                        onClick={handleMenuItemClick}
                        style={item.subItems && item.subItems.length > 0 ? { pointerEvents: 'none' } : {}}
                      >
                        <FontAwesomeIcon icon={item.icon} /> {item.label}
                      </Link>
                      {item.subItems && (
                        <ul>
                          {item.subItems.map((subItem, index) => (
                            <li key={index} className="submenu-item">
                              <Link
                                  to={subItem.to}
                                  state={{data: subItem.state}}
                                  onClick={() => handleSubItemMenuClick(subItem)}>
                                  {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {block2Items.length > 0 && (
                <ul className="block-2__wrapper">
                  {block2Items.map((item, index) => (
                    <li key={index}
                        className={isCurrentPage(item.path) ? 'active' : null} >
                      <Link
                        className={!item.path ? 'no-link' : (item.className) || null}
                        to={item.path}
                        onClick={handleMenuItemClick}
                        style={item.subItems && item.subItems.length > 0 ? { pointerEvents: 'none' } : {}}
                      >
                        <FontAwesomeIcon icon={item.icon} /> {item.label}
                      </Link>
                      {item.subItems && (
                        <ul>
                          {item.subItems.map(subItem => (
                              <li key={subItem.label} className="submenu-item">
                                <Link
                                  className={!subItem.path ? 'no-link' : null}
                                  to={subItem.path}
                                  onClick={handleMenuItemClick}>
                                  {subItem.label}
                                </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </WeatherNavbarStyled>
        </>
      )}
    </AnimatePresence>
  )
}

export default WeatherNavbar