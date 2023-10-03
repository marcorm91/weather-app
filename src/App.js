import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import WeatherHeader from './components/weather-header/WeatherHeader'
import WeatherFooter from './components/weather-footer/WeatherFooter'
import WeatherHome from './pages/weather-home/WeatherHome'
import WeatherAlerts from './pages/weather-alerts/WeatherAlerts'
import WeatherContact from './pages/weather-contact/WeatherContact'
import WeatherMoreInfo from './pages/weather-more-info/WeatherMoreInfo'
import Weather404 from './pages/weather-404/Weather404'
import { RecentSearchesProvider } from './utils/js/RecentSearchesContext'
import { LocationProvider } from './utils/js/LocationContext'

const App = () => {

  return (
    <RecentSearchesProvider>
      <LocationProvider>
        <Router>
          <WeatherHeader />
          <Routes>
            <Route path="/" element={<WeatherHome />} />
            <Route path="/alerts" element={<WeatherAlerts />} />
            <Route path="/contact" element={<WeatherContact />} />
            <Route path="/more-info" element={<WeatherMoreInfo />} />
            <Route path="*" element={<Weather404 />} />
          </Routes>
          <WeatherFooter />
        </Router>
      </LocationProvider>
    </RecentSearchesProvider>
  )
}

export default App
