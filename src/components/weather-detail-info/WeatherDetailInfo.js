import React, { useState } from 'react'
import WeatherTabs from '../weather-tabs/WeatherTabs'
import WeatherPredictionHours from '../weather-prediction-hours/WeatherPredictionHours'
import WeatherPredictionDays from '../weather-prediction-days/WeatherPredictionDays'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import { faCalendarDays, faClock } from '@fortawesome/free-solid-svg-icons'
import { WeatherDetailInfoStyled } from './WeatherDetailInfoStyled'

const WeatherDetailInfo = () => {

  const [activeTab, setActiveTab] = useState('tab1')
  const { t } = useTranslation()

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }
  
  const tabs = [
    {
      id: 'tab1',
      label: `${t('MORE_INFO.MAIN.TABS.HOURLY_FORECAST')}`,
      icon: (
        <FontAwesomeIcon
          icon={faClock}
          size='sm'
          style={{ color: 'var(--wa-deep-blue)' }}
        />
      ),
    },
    {
      id: 'tab2',
      label: `${t('MORE_INFO.MAIN.TABS.DAILY_FORECAST')}`,
      icon: (
        <FontAwesomeIcon
          icon={faCalendarDays}
          size='sm'
          style={{ color: 'var(--wa-deep-blue)' }}
        />
      ),
    },
  ]

  return (
    <WeatherDetailInfoStyled>
      <WeatherTabs activeTab={activeTab} handleTabClick={handleTabClick} tabs={tabs} />
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={activeTab === tab.id ? 'tab-content__wrapper' : 'tab-content__wrapper hidden'}
        >
          {tab.id === 'tab1' ? (
            <WeatherPredictionHours />
          ) : (
            <WeatherPredictionDays />
          )}
        </div>
      ))}
    </WeatherDetailInfoStyled>
  )
}

export default WeatherDetailInfo
