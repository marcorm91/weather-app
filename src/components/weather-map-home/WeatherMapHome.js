import React, { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { WeatherMapHomeStyled } from './WeatherMapHomeStyled'
import { skyIconMap } from '../../utils/js/skyIcons'
import { getCurrentDate, getCurrentHour, getTimezoneOffset, drawOnMap, getBoundsFromGeoJSON } from '../../utils/js/helpers'
import { renderToString } from 'react-dom/server'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudRain, faCloudSunRain, faSnowflake, faTemperatureQuarter, faWind } from '@fortawesome/free-solid-svg-icons'
import { getMunicipalityByCPROCMUN } from '../../resources/services/APIs/geoService'
import { fetchCurrentWeatherSpain } from '../../resources/services/APIs/currentWeatherSpain'
import { Tooltip as ReactTooltip } from 'react-tooltip'

const WeatherMapHome = ({ CPRO, CMUN }) => {
  const mapRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const mapContainerRef = useRef(null)
  const [isViewingSpain, setIsViewingSpain] = useState(false)
  const [isViewingCanary, setIsViewingCanary] = useState(false)
  const [isViewingMunicipality, setIsViewingMunicipality] = useState(false)
  const [isFetchingMunicipality, setIsFetchingMunicipality] = useState(false)
  const [activeItem, setActiveItem] = useState('cloudSunRain')

  // ------------------ Functions related to Mapping and Geolocation ------------------

  /**
   * Displays a map view focused on the specified latitude, longitude, and region.
   * Fetches the current weather data for the given region and adds it as markers on the map.
   * @param {Number} lat - Latitude to center the map on.
   * @param {Number} lng - Longitude to center the map on.
   * @param {Number} defaultZoom - Initial zoom level for the map.
   * @param {string} region - Region for which the weather data should be fetched.
   * @param {string} timezoneOffset - Timezone offset for the specified region.
   * @returns {void}
   */
  const showMap = async (lat, lng, defaultZoom, region, timezoneOffset) => {

    if (!mapRef.current) return

    const width = window.innerWidth
    let zoomLevel = defaultZoom
    if (width <= 767) {
        zoomLevel = defaultZoom - 1
    }

    mapRef.current.setView([lat, lng], zoomLevel)

    const formattedDateTime = `${getCurrentDate().slice(0, -9)}T${getCurrentHour()}:00:00${timezoneOffset}`
    const data = await fetchCurrentWeatherSpain('eCielo', region, 6, formattedDateTime)

    data[0].features.forEach(feature => {
        const coordinates = feature.geometry.coordinates
        const eCieloValue = feature.properties.eCielo
        const iconComponent = skyIconMap[eCieloValue]
        const municipalityName = feature.properties.Municipio
        if (!iconComponent) return
        addMarkerWithTooltip(coordinates, iconComponent, municipalityName)
    })
  }

  /**
   * Displays the default map view focused on Spain.
   * Fetches the current weather data for Spain and adds it as markers on the map.
   * Once data is fetched and displayed, loading state is set to false.
   */
  const showDefaultSpainMap = async () => {
    await showMap(39.8168, -2.9000, 6, 'PB', getTimezoneOffset())
    setLoading(false)
  }

  /**
   * Displays the map view focused on the Canary Islands.
   * Fetches the current weather data for the Canary Islands and adds it as markers on the map.
   * Uses a predefined timezone offset for the Canary Islands.
   */
  const showCanariesMap = async () => {
    const timezoneOffset = "+01:00"
    await showMap(28.5916, -15.6291, 7, 'CAN', timezoneOffset)
  }

  /**
   * Adds a marker to the map with a custom wind icon that represents a given wind value and direction.
   * 
   * @param {Array} coordinates - An array of latitude and longitude values where the marker will be placed.
   * @param {Number} windValue - The numerical value of the wind speed to be displayed on the marker.
   * @param {String} windPosition - A string indicating the wind direction, which is used to style the marker with a specific CSS class.
   * @param {String} municipalityName - The name of the municipality associated with the marker, displayed on mouseover.
   */
  const addMarkerWithWindValue = useCallback((coordinates, windPosition, windVel, municipalityName) => {
    const windClass = windPosition
    const iconHTML = `<div class='wind-wrapper direction-${windClass}'>${windVel}</div>`
    const customIcon = L.divIcon({ html: iconHTML })
    const marker = L.marker([coordinates[1], coordinates[0]], { icon: customIcon }).addTo(mapRef.current)
    marker.on('mouseover', (e) => showMunicipioName(e, municipalityName))
    marker.on('mouseout', hideMunicipioName)
  }, [])

  /**
   * Adds a marker to the map with a custom icon representing the given precipitation value.
   *
   * @param {Array} coordinates - An array containing the latitude and longitude values where the marker will be placed.
   * @param {string} precipitationValue - The value of precipitation to be displayed on the marker.
   * @param {string} municipalityName - The name of the municipality associated with the marker, displayed on mouseover.
   */
  const addMarkerWithPrecipitationValue = useCallback((coordinates, precipitationValue, municipalityName) => {
    const iconHTML = `<div class='precipitation-wrapper'>${precipitationValue}</div>`
    const customIcon = L.divIcon({ html: iconHTML })
    const marker = L.marker([coordinates[1], coordinates[0]], { icon: customIcon }).addTo(mapRef.current)
    marker.on('mouseover', (e) => showMunicipioName(e, municipalityName))
    marker.on('mouseout', hideMunicipioName)
  }, [])
  
  /**
   * Sets the map view based on the given view type.
   * @param {string} view - The view type ("peninsula" or "canarias").
   */
  const setMapView = async (view, region) => {
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

    handleListItemClick(activeItem, region)

  }

  /**
   * Print tooltip to map with parameters coords, icon and municipality
   */
  const addMarkerWithTooltip = useCallback((coordinates, iconComponent, municipalityName) => {
    const iconHTML = renderToString(iconComponent(30, 'var(--wa-deep-blue)'))
    const customIcon = L.divIcon({ html: iconHTML })
    const marker = L.marker([coordinates[1], coordinates[0]], { icon: customIcon }).addTo(mapRef.current)
    marker.on('mouseover', (e) => showMunicipioName(e, municipalityName))
    marker.on('mouseout', hideMunicipioName)
  }, [])

  /**
   * Determines the temperature class based on the given temperature value.
   * @param {*} temp Temperature value
   * @returns Temperature class
   */
  const getTemperatureClass = (temp) => {
    if (temp <= 0) return 'type-1'
    if (temp > 0 && temp <= 10) return 'type-2'
    if (temp > 10 && temp <= 20) return 'type-3'
    if (temp > 20 && temp <= 30) return 'type-4'
    if (temp > 30 && temp <= 40) return 'type-5'
    if (temp > 40 && temp <= 45) return 'type-6'
    return 'type-7'
  }
  
  /**
   * Adds a marker on the map with the temperature value.
   * The marker will have a class based on the temperature range.
   * @param {Array} coordinates - Array containing latitude and longitude
   * @param {string} temperatureValue - The temperature value as a string
   * @param {string} municipalityName - The name of the municipality
   */
  const addMarkerWithTemperatureValue = useCallback((coordinates, temperatureValue, municipalityName) => {
    const temperatureClass = getTemperatureClass(parseFloat(temperatureValue))
    const iconHTML = `<div class='temperature-wrapper ${temperatureClass}'>${temperatureValue}°</div>`
    const customIcon = L.divIcon({ html: iconHTML })
    const marker = L.marker([coordinates[1], coordinates[0]], { icon: customIcon }).addTo(mapRef.current)
    marker.on('mouseover', (e) => showMunicipioName(e, municipalityName))
    marker.on('mouseout', hideMunicipioName)
  }, [])

  /**
   * Adds a marker on the map with the snow value.
   * @param {Array} coordinates - Array containing latitude and longitude
   * @param {string} snowValue - The snow value as a string
   * @param {string} municipalityName - The name of the municipality
   */
  const addMarkerWithSnowValue = useCallback((coordinates, snowValue, municipalityName) => {
    const iconHTML = `<div class='snow-wrapper'>${snowValue}</div>` 
    const customIcon = L.divIcon({ html: iconHTML })
    const marker = L.marker([coordinates[1], coordinates[0]], { icon: customIcon }).addTo(mapRef.current)
    marker.on('mouseover', (e) => showMunicipioName(e, municipalityName))
    marker.on('mouseout', hideMunicipioName)
  }, [])

  /**
   * Show municipality tooltip
   * @param {*} e 
   * @param {*} municipioName 
   */
  const showMunicipioName = (e, municipioName) => {
    const popupContent = `
        <span>${municipioName}</span>
    `
    L.popup()
      .setContent(popupContent)
      .setLatLng(e.latlng)
      .openOn(mapRef.current)
  }

  /**
   * Hide municipality
   */
  const hideMunicipioName = () => {
    mapRef.current.closePopup()
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

  /**
   * Fetches weather data for a specified type and region and then adds corresponding markers to the map.
   *
   * @param {string} type - The type of weather data to fetch (e.g., 'eCielo', 'Tempta', 'diVien', 'cPrecp').
   * @param {string} region - The region for which the data should be fetched (default is 'PB').
   * @returns {void}
   */
  const fetchDataAndDrawMarkers = async (type, region = 'PB') => {
    if (!mapRef.current) return

    const formattedDateTime = `${getCurrentDate().slice(0, -9)}T${getCurrentHour()}:00:00${getTimezoneOffset(region)}`
    const data = await fetchCurrentWeatherSpain(type, region, 6, formattedDateTime)

    data[0].features.forEach(feature => {
        const coordinates = feature.geometry.coordinates
        const value = feature.properties[type].toString()
        const municipalityName = feature.properties.Municipio

        switch (type) {
            case 'eCielo':
                const iconComponent = skyIconMap[value]
                if (iconComponent) addMarkerWithTooltip(coordinates, iconComponent, municipalityName)
                break
            case 'Tempta':
                addMarkerWithTemperatureValue(coordinates, value, municipalityName)
                break
            case 'diVien':
                const windPosition = feature.properties.diVien.toString()
                const windVel = feature.properties.viVien.toString()
                addMarkerWithWindValue(coordinates, windPosition, windVel, municipalityName)
                break
            case 'cPrecp':
                addMarkerWithPrecipitationValue(coordinates, value, municipalityName)
                break
              case 'caNieve': 
                addMarkerWithSnowValue(coordinates, value, municipalityName)
                break
            default:
                break
        }
    })
  }

  /**
   * Handles the click event for the list items in the weather map view selector.
   * Updates the map view based on the selected weather view type
   * @param {string} viewType - The weather view type selected by the user (e.g., "cloudSunRain", "temperatureQuarter", ...)
   */
  const handleListItemClick = (viewType, region) => {
    clearMapIcons()
    switch (viewType) {
        case "cloudSunRain":
            fetchDataAndDrawMarkers('eCielo', region)
            break
        case "temperatureQuarter":
            fetchDataAndDrawMarkers('Tempta', region)
            break
        case "wind":
            fetchDataAndDrawMarkers('diVien', region)
            break
        case "cloudRain":
            fetchDataAndDrawMarkers('cPrecp', region)
            break
        case "snow":
              fetchDataAndDrawMarkers('caNieve', region)
              break
        default:
            break
    }
    setActiveItem(viewType)
  }

  // ------------------ useEffect Hooks ------------------

  /**
   * Initialize the map using default data Spain
   */
  useEffect(() => {
    const initMap = (latitude, longitude, zoomLevel) => {
      if (mapContainerRef.current && !mapRef.current) {
        const width = window.innerWidth
        if (width <= 767) {
          zoomLevel = 5
        } else if (width <= 1024) {
          zoomLevel = 6
        }
        mapRef.current = L.map(mapContainerRef.current, {
          maxZoom: 7,
          minZoom: 5
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
      const data = await fetchCurrentWeatherSpain('eCielo', 'PB', 6, formattedDateTime)
      data[0].features.forEach(feature => {
        const coordinates = feature.geometry.coordinates
        const eCieloValue = feature.properties.eCielo
        const iconComponent = skyIconMap[eCieloValue]
        const municipalityName = feature.properties.Municipio
        // If not found icon in skyMap
        if (!iconComponent) return
        addMarkerWithTooltip(coordinates, iconComponent, municipalityName)
      })
    }
    if (!loading) {
      fetchDataAndDisplayOnMap()
      setIsViewingMunicipality(true)
    }
  }, [loading, addMarkerWithTooltip])

  /**
   * Action that goes to the municipality to get the weather details
   */
  useEffect(() => {
    if (CPRO && CMUN) {
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
          <ul className='list-options__wrapper'>
            <li
              data-view="cloudSunRain"
              data-tooltip-id='cloudSunRain'
              onClick={(e) => handleListItemClick(e.currentTarget.getAttribute('data-view'), isViewingCanary ? 'CAN' : 'PB')} 
              className={activeItem !== 'cloudSunRain' ? 'inactive-item' : null}>
              <FontAwesomeIcon
                icon={faCloudSunRain}
                size='sm'
                color='var(--wa-white)' />
              
            </li>
            <li 
              data-view="temperatureQuarter"
              data-tooltip-id='temperatureQuarter'
              onClick={(e) => handleListItemClick(e.currentTarget.getAttribute('data-view'), isViewingCanary ? 'CAN' : 'PB')}
              className={activeItem !== 'temperatureQuarter' ? 'inactive-item' : null}>
              <FontAwesomeIcon
                icon={faTemperatureQuarter}
                size='1x'
                color='var(--wa-white)' />
            </li>
            <li
              data-view="wind"
              data-tooltip-id='wind'
              onClick={(e) => handleListItemClick(e.currentTarget.getAttribute('data-view'), isViewingCanary ? 'CAN' : 'PB')}
              className={activeItem !== 'wind' ? 'inactive-item' : null}>
              <FontAwesomeIcon
                icon={faWind}
                size='1x'
                color='var(--wa-white)' />

            </li>
            <li
              data-view="cloudRain"
              data-tooltip-id='cloudRain'
              onClick={(e) => handleListItemClick(e.currentTarget.getAttribute('data-view'), isViewingCanary ? 'CAN' : 'PB')}
              className={activeItem !== 'cloudRain' ? 'inactive-item' : null}>
              <FontAwesomeIcon
                  icon={faCloudRain}
                  size='1x'
                  color='var(--wa-white)' />

            </li>
            <li
              data-view="snow"
              data-tooltip-id='snow'
              onClick={(e) => handleListItemClick(e.currentTarget.getAttribute('data-view'), isViewingCanary ? 'CAN' : 'PB')}
              className={activeItem !== 'snow' ? 'inactive-item' : null}>
              <FontAwesomeIcon
                  icon={faSnowflake}
                  size='1x'
                  color='var(--wa-white)' />
            </li>
            <ReactTooltip id='cloudSunRain' place='top'>
              {t('HOME.MAP.SKY_CONDITION')}
            </ReactTooltip>
            <ReactTooltip id='temperatureQuarter' place='top'>
              {t('HOME.MAP.TEMPERATURE')}
            </ReactTooltip>
            <ReactTooltip id='wind' place='top'>
              {t('HOME.MAP.WIND')}
            </ReactTooltip>
            <ReactTooltip id='cloudRain' place='top'>
              {t('HOME.MAP.PRECIPITATION')}
            </ReactTooltip>
            <ReactTooltip id='snow' place='top'>
            {t('HOME.MAP.SNOW')}
            </ReactTooltip>
          </ul>
          {!isViewingSpain && (isViewingCanary || isViewingMunicipality) ? (
            <button
              onClick={() => setMapView("peninsula", "PB")}
              className='btn btn-small btn-primary spain-top-right'>{t('HOME.MAP.VIEW_PENINSULA')}</button>
          ) : null}
          {isViewingSpain && !isViewingCanary ? (
            <button
              onClick={() => setMapView("canarias", "CAN")}
              className='btn btn-small btn-primary canaries'>{t('HOME.MAP.VIEW_CANARIES')}</button>
          ) : null}
        </>
      )}
    </WeatherMapHomeStyled>
  )

}

export default WeatherMapHome
