import React, { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { renderToString } from 'react-dom/server'
import { WeatherMapStyled } from './WeatherMapStyled'
import mapService from '../../resources/services/APIs/mapService'

const WeatherMap = ({ municipalityObject }) => {
  const { NAME, PROV } = municipalityObject

  useEffect(() => {
    const location = `${NAME}, ${PROV}, Spain`

    mapService.getCoordinatesByLocation(location)
      .then(data => {
        if (data.length > 0) {
          const { lat, lon } = data[0]
          const iconHtml = renderToString(<FontAwesomeIcon icon={faLocationDot} color='var(--wa-deep-blue)' size='2x' />)
          const customIcon = L.divIcon({
            html: iconHtml, 
            iconAnchor: [16, 32],
          })
          const map = L.map('map').setView([lat, lon], 10)
  
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
          L.marker([lat, lon], { icon: customIcon }).addTo(map)
        }
      })
  }, [NAME, PROV])

  return (
      <WeatherMapStyled className='map__wrapper'>
        <div id="map"></div>
      </WeatherMapStyled>
  )

}

export default WeatherMap
