import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { WeatherMapMunicipalityStyled } from './WeatherMapMunicipalityStyled'
import { drawOnMap, getBoundsFromGeoJSON } from '../../utils/js/helpers'
import { getMunicipalityByCPROCMUN } from '../../resources/services/APIs/geoService'

const WeatherMapMunicipality = ({ municipalityObject }) => {
  const { CPRO, CMUN } = municipalityObject
  const mapRef = useRef(null)
  const mapContainerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAndDrawMunicipalityOutline = async () => {
      if (!mapRef.current && mapContainerRef.current) {
        mapRef.current = L.map(mapContainerRef.current).setView([39.8168, -2.9000], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
      }    
      try {
        const municipalityGeoJSON = await getMunicipalityByCPROCMUN(CPRO, CMUN)           
        if (municipalityGeoJSON && mapRef.current) {
          drawOnMap(municipalityGeoJSON, mapRef.current)
          const bounds = getBoundsFromGeoJSON(municipalityGeoJSON)
          mapRef.current.fitBounds(bounds)
        } else {
          console.log("Municipality outline not found.")
        }
      } catch (error) {
        console.error("Error obtaining the municipality outline:", error)
      }
    }  
    fetchAndDrawMunicipalityOutline().then(() => setIsLoading(false))
  }, [CPRO, CMUN, isLoading])
  
  return (
    <WeatherMapMunicipalityStyled className='map__wrapper'>
        {isLoading ? (
            <div className="loading-skeleton"></div>
        ) : (
            <div ref={mapContainerRef}></div>
        )}
    </WeatherMapMunicipalityStyled>
  )

}

export default WeatherMapMunicipality
