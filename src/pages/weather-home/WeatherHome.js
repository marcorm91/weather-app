import React, { useState, useEffect } from 'react'
import WeatherTable from '../../components/weather-table/WeatherTable'
import { WeatherHomeStyled } from './WeatherHomeStyled'
import { useTranslation } from 'react-i18next'
import WeatherTabs from '../../components/weather-tabs/WeatherTabs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import WeatherAd from '../../components/weather-ad/WeatherAd'
import { getFavorites } from '../../utils/js/localStorageUtils'
import WeatherMapHome from '../../components/weather-map-home/WeatherMapHome'
import { useLocation  } from '../../utils/js/LocationContext'
import WeatherCurrentGeolocation from '../../components/weather-current-geolocation/WeatherCurrentGeolocation'
import { ResizableBox } from 'react-resizable'
import "react-resizable/css/styles.css"

const WeatherHome = () => {
  
  const { t, i18n } = useTranslation()
  const date = new Date()
  const dateOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  const day = date.toLocaleDateString(i18n.language, dateOptions)
  const [activeTab, setActiveTab] = useState('tab1')
  const favorites = getFavorites()
  const hasFavorites = favorites.length > 0
  const [selectedTown, setSelectedTown] = useState(null)
  const { location } = useLocation()
  const [geolocationError, setGeolocationError] = useState(false)
  const [shouldDisplay, setShouldDisplay] = useState(false)
  const flexClass = shouldDisplay ? 'flex-45' : 'flex-50'

  // Attach the error handling function as an event listener to the window object
  // It listens for a custom 'GeolocationError' event
  useEffect(() => {
    const handleError = (e) => {
        setGeolocationError(e.detail)
    }
    
    window.addEventListener('GeolocationError', handleError)

    if (location && !geolocationError) {
        setShouldDisplay(true);
    } else {
        setShouldDisplay(false);
    }

    return () => {
        window.removeEventListener('GeolocationError', handleError)
    }
  }, [location, geolocationError])

  let geolocationContentStyle = shouldDisplay ? { display: 'flex' } : { display: 'none' };

  // If location and geoLocationError it's OK... print the component
  let geolocationContent = null
  if (location && !geolocationError) {
    geolocationContent = (
        <div className='flex-10' style={geolocationContentStyle}>
            <WeatherCurrentGeolocation location={location} onError={setGeolocationError} />
        </div>
    )
  }

  // Handle click for tabs (all and favs)
  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const tabs = [
    { id: 'tab1', label: `${t('HOME.TABS.ALL')}` },
    {
      id: 'tab2',
      label: `${t('HOME.TABS.FAV')}`,
      icon: (
        <FontAwesomeIcon
          icon={faStar}
          size='sm'
          style={{ color: 'var(--wa-green)' }}
        />
      ),
    },
  ]

  return (
    <WeatherHomeStyled className='background-main-image'>
      <WeatherAd />
      <h1>{t('HOME.WELCOME_MSG', { day })}</h1>
      <div className='content__wrapper'>
        <ResizableBox 
          width={700}
          height={Infinity} 
          axis="x"
          minConstraints={[400, Infinity]}
          maxConstraints={[800, Infinity]} >
          <div className={flexClass}>
            <WeatherTabs activeTab={activeTab} handleTabClick={handleTabClick} tabs={tabs} />
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={activeTab === tab.id ? 'tab-content__wrapper' : 'tab-content__wrapper hidden'}
              >
                {tab.id === 'tab1' ? (
                  <WeatherTable 
                    key='all' 
                    showFavoritesOnly={false} 
                    setSelectedTown={setSelectedTown} />
                ) : (
                  hasFavorites > 0 ? (
                    <WeatherTable 
                      key='favorites' 
                      showFavoritesOnly={true} 
                      arrayFavorites={favorites} 
                      setSelectedTown={setSelectedTown}/>
                  ) : <span>{t('HOME.TABLE.EMPTY_FAV')}</span>
                )}
              </div>
            ))}
          </div>
        </ResizableBox>
        <div className={`${flexClass} remaining-space`} >
          <WeatherMapHome 
            CPRO={selectedTown?.CPRO} 
            CMUN={selectedTown?.CMUN} />
        </div>
        {geolocationContent}
      </div>
    </WeatherHomeStyled>
  )
}

export default WeatherHome
