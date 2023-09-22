import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { WeatherMapHomeStyled } from './WeatherMapHomeStyled'
import { skyIconMap } from '../../utils/js/skyIcons'
import { getCurrentDate, getCurrentHour, getTimezoneOffset, drawOnMap, getBoundsFromGeoJSON } from '../../utils/js/helpers'
import { renderToString } from 'react-dom/server'
import { useTranslation } from 'react-i18next'
import { getMunicipalityByCPROCMUN } from '../../resources/services/APIs/geoService'
import { fetchCurrentSkySpain } from '../../resources/services/APIs/currentSkySpain'

const WeatherMapHome = ({ CPRO, CMUN }) => {
  const mapRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const mapContainerRef = useRef(null)
  const [isViewingSpain, setIsViewingSpain] = useState(false)
  const [isViewingCanary, setIsViewingCanary] = useState(false)
  const [isViewingMunicipality, setIsViewingMunicipality] = useState(false)
  const [isFetchingMunicipality, setIsFetchingMunicipality] = useState(false)
  
  // ------------------ Functions related to Mapping and Geolocation ------------------

  /**
   * Displays the default map view focused on Spain.
   * Fetches the current weather data for Spain and adds it as markers on the map.
   */
  const showDefaultSpainMap = async () => {

    if (!mapRef.current) return
    
    mapRef.current.setView([39.8168, -2.9000], 6)

    const formattedDateTime = `${getCurrentDate().slice(0, -9)}T${getCurrentHour()}:00:00${getTimezoneOffset()}`
    const data = await fetchCurrentSkySpain('eCielo', 'PB', 6, formattedDateTime)

    data[0].features.forEach(feature => {
      const coordinates = feature.geometry.coordinates
      const eCieloValue = feature.properties.eCielo
      const iconComponent = skyIconMap[eCieloValue]
      if (!iconComponent) return
      const iconHTML = renderToString(iconComponent(32, 'var(--wa-deep-blue)'))
      const customIcon = L.divIcon({ html: iconHTML })
      L.marker([coordinates[1], coordinates[0]], { icon: customIcon }).addTo(mapRef.current)
    })
    setLoading(false)
  }

  /**
   * Displays the map view focused on Canaries.
   */
  const showCanariesMap = async () => {
    if (!mapRef.current) return
    
    mapRef.current.setView([28.5916, -15.6291], 7)

    const formattedDateTime = `${getCurrentDate().slice(0, -9)}T${getCurrentHour()}:00:00+01:00`
    const data = await fetchCurrentSkySpain('eCielo', 'CAN', 6, formattedDateTime)

    data[0].features.forEach(feature => {
        const coordinates = feature.geometry.coordinates
        const eCieloValue = feature.properties.eCielo
        const iconComponent = skyIconMap[eCieloValue]
        if (!iconComponent) return
        const iconHTML = renderToString(iconComponent(32, 'var(--wa-deep-blue)'))
        const customIcon = L.divIcon({ html: iconHTML })
        L.marker([coordinates[1], coordinates[0]], { icon: customIcon }).addTo(mapRef.current)
    })
  }

  /**
   * Sets the map view based on the given view type.
   * @param {string} view - The view type ("peninsula" or "canarias").
   */
  const setMapView = async (view) => {
    if (!mapRef.current) return

    mapRef.current.eachLayer(layer => {
      if (layer instanceof L.TileLayer) return
      mapRef.current.removeLayer(layer)
    })

    switch (view) {
      case "peninsula":
        await showDefaultSpainMap()
        setIsViewingSpain(true)
        setIsViewingCanary(false)
        break
      case "canarias":
        await showCanariesMap()
        setIsViewingSpain(false)
        setIsViewingCanary(true)
        break
      default: break
    }
  }

  /**
   * Reset layer map
   */
  const clearMapIcons = () => {
    if (!mapRef.current) return
    mapRef.current.eachLayer(layer => {
      if (layer instanceof L.TileLayer) return
      mapRef.current.removeLayer(layer)
    })
  }
  
  // ------------------ useEffect Hooks ------------------

  /**
   * Initialize the map using default data Spain
   */
  useEffect(() => {
    const initMap = (latitude, longitude, zoomLevel) => {
      if (mapContainerRef.current && !mapRef.current) {
        mapRef.current = L.map(mapContainerRef.current, {
          zoomControl: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          touchZoom: false,
          dragging: false,
          minZoom: 4
        }).setView([latitude, longitude], zoomLevel)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current)
      }
    }
    initMap(39.8168, -2.9000, 6)
    setIsViewingSpain(true)
    setLoading(false)
  }, [loading])

  /**
   * Fetches data AEMET for Spain and display on map
   */
  useEffect(() => {
    const fetchDataAndDisplayOnMap = async () => {
      const formattedDateTime = `${getCurrentDate().slice(0, -9)}T${getCurrentHour()}:00:00${getTimezoneOffset()}`
      const data = await fetchCurrentSkySpain('eCielo', 'PB', 6, formattedDateTime)
      data[0].features.forEach(feature => {
        const coordinates = feature.geometry.coordinates
        const eCieloValue = feature.properties.eCielo
        const iconComponent = skyIconMap[eCieloValue]
        // If not found icon in skyMap
        if (!iconComponent) return 
        const iconHTML = renderToString(iconComponent(32, 'var(--wa-deep-blue)'))
        const customIcon = L.divIcon({ html: iconHTML })
        L.marker([coordinates[1], coordinates[0]], { icon: customIcon }).addTo(mapRef.current)
      })
    }
    if (!loading) {
      fetchDataAndDisplayOnMap()
      setIsViewingMunicipality(true)
    }
  }, [loading])
  
  /**
   * Action that goes to the municipality to get the weather details
   */
  useEffect(() => {
    if(CPRO && CMUN){
      const centerMapToTown = async () => {
        setIsFetchingMunicipality(true)
        if (CPRO && CMUN) {
          clearMapIcons()  
          setIsViewingSpain(false)
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
        setIsFetchingMunicipality(false)
      }
      centerMapToTown()
    }
  }, [CPRO, CMUN, mapRef])

  return (
    <WeatherMapHomeStyled className='map__wrapper'>
      {loading || isFetchingMunicipality ? (
        <div className='loading-skeleton'></div>
      ) : (
        <>
          <div className='leaflet-container leaflet-touch leaflet-fade-anim' ref={mapContainerRef}></div>
          {!isViewingSpain && (isViewingCanary || isViewingMunicipality) ? (
            <button 
              onClick={() => setMapView("peninsula")}
              className='btn btn-small btn-primary spain-top-left'>{t('HOME.MAP.VIEW_PENINSULA')}</button>
          ) : null}
          {isViewingSpain && !isViewingCanary ? (
            <button 
              onClick={() => setMapView("canarias")}
              className='btn btn-small btn-primary canaries'>{t('HOME.MAP.VIEW_CANARIES')}</button>
          ) : null}
        </>
      )}
    </WeatherMapHomeStyled>
  )

}

export default WeatherMapHome
