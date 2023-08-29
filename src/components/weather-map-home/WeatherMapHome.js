import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { WeatherMapHomeStyled } from './WeatherMapHomeStyled'

const WeatherMapHome = () => {
  const mapRef = useRef(null)
  const [view, setView] = useState("spain")

  useEffect(() => {
    const defaultLat = 39.963667
    const defaultLon = -2.74922
    const defaultZoom = 6

    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        dragging: false
      }).setView([defaultLat, defaultLon], defaultZoom)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current)
    } else {
      mapRef.current.setView([defaultLat, defaultLon], defaultZoom)
    }
  }, [])

  const toggleView = () => {
    if (view === "spain") {
      const canariasLat = 28.2916
      const canariasLon = -15.6291
      const canariasZoom = 7
      mapRef.current.setView([canariasLat, canariasLon], canariasZoom)
      setView("canarias")
    } else {
      const defaultLat = 39.963667
      const defaultLon = -2.74922
      const defaultZoom = 6
      mapRef.current.setView([defaultLat, defaultLon], defaultZoom)
      setView("spain")
    }
  }

  return (
    <WeatherMapHomeStyled className='map__wrapper'>
      <div id="map"></div>
      <button className='btn btn-primary btn-small' onClick={toggleView}>
        {view === "spain" ? "Ir a Canarias" : "Ir a la Península"}
      </button>
    </WeatherMapHomeStyled>
  )
}

export default WeatherMapHome
