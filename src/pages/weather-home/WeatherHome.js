import React, { useState } from 'react'
import WeatherTable from '../../components/weather-table/WeatherTable'
import { WeatherHomeStyled } from './WeatherHomeStyled'
import { useTranslation } from 'react-i18next'
import WeatherTabs from '../../components/weather-tabs/WeatherTabs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import WeatherAd from '../../components/weather-ad/WeatherAd'
import { getFavorites } from '../../utils/js/localStorageUtils'
import WeatherMapHome from '../../components/weather-map-home/WeatherMapHome'
// import backgroundImage from '../../resources/assets/images/background.jpg' 

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
        <div>
          <WeatherTabs activeTab={activeTab} handleTabClick={handleTabClick} tabs={tabs} />
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={activeTab === tab.id ? 'tab-content__wrapper' : 'tab-content__wrapper hidden'}
            >
              {tab.id === 'tab1' ? (
                <WeatherTable 
                  key="all" 
                  showFavoritesOnly={false} 
                  setSelectedTown={setSelectedTown} />
              ) : (
                hasFavorites > 0 ? (
                  <WeatherTable 
                    key="favorites" 
                    showFavoritesOnly={true} 
                    arrayFavorites={favorites} 
                    setSelectedTown={setSelectedTown}/>
                ) : <span>{t('HOME.TABLE.EMPTY_FAV')}</span>
              )}
            </div>
          ))}
        </div>
        <div>
          <WeatherMapHome 
            CPRO={selectedTown?.CPRO} 
            CMUN={selectedTown?.CMUN} />
        </div>
      </div>
    </WeatherHomeStyled>
  )
}

export default WeatherHome
