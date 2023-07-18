
import WeatherHeader from "./components/weather-header/WeatherHeader"
import WeatherFooter from "./components/weather-footer/WeatherFooter"
import WeatherHome from "./pages/weather-home/WeatherHome"
import WeatherAlerts from "./pages/weather-alerts/WeatherAlerts"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WeatherContact from "./pages/weather-contact/WeatherContact"

function App() {
  return (
    <Router>
        <WeatherHeader />
        <Routes>
          <Route path="/" element={<WeatherHome/>} />
          <Route path="/alerts" element={<WeatherAlerts/>} />
          <Route path="/contact" element={<WeatherContact />} />
        </Routes>
        <WeatherFooter />
    </Router>
  )
}

export default App
