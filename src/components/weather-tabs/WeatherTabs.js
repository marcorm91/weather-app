import React from 'react'
import { WeatherTabsStyled } from './WeatherTabsStyled'

const WeatherTabs = ({ activeTab, handleTabClick, tabs }) => {
  return (
    <WeatherTabsStyled>
      {tabs.map((tab) => (
        <li
          key={tab.id}
          className={activeTab === tab.id ? 'active' : ''}
          onClick={() => handleTabClick(tab.id)}
        >
          {tab.label}  {tab.icon}
        </li>
      ))}
    </WeatherTabsStyled>
  )
}

export default WeatherTabs
