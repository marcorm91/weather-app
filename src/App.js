import React from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import WeatherHeader from './components/weather-header/WeatherHeader'
import WeatherFooter from './components/weather-footer/WeatherFooter'
import WeatherHome from './pages/weather-home/WeatherHome'
import WeatherAlerts from './pages/weather-alerts/WeatherAlerts'
import WeatherContact from './pages/weather-contact/WeatherContact'
import WeatherMoreInfo from './pages/weather-more-info/WeatherMoreInfo'
import { RecentSearchesProvider } from './utils/js/RecentSearchesContext'

const App = () => {

  return (
    <RecentSearchesProvider>
      <Router>
        <WeatherHeader />
        <Routes>
          <Route path="/" element={<WeatherHome />} />
          <Route path="/alerts" element={<WeatherAlerts />} />
          <Route path="/contact" element={<WeatherContact />} />
          <Route path="/more-info" element={<WeatherMoreInfo />} />
        </Routes>
        <WeatherFooter />
      </Router>
    </RecentSearchesProvider>
  )
}

export default App
