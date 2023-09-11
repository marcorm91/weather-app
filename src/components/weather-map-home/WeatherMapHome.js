import React, { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { WeatherMapHomeStyled } from './WeatherMapHomeStyled'
import { fetchHourlyPrediction } from '../../resources/services/APIs/hourlyPrediction'
import towns from '../../resources/services/code_towns.json'
import { skyIconMap } from '../../utils/js/skyIcons'
import { getCurrentDate, getCurrentHour } from '../../utils/js/helpers'
import { renderToString } from 'react-dom/server'
import FuzzySet from 'fuzzyset.js'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapLocationDot, faSlash } from '@fortawesome/free-solid-svg-icons'
import { getNameFromCoordinates, getCoordinatesFromName } from '../../resources/services/APIs/geoService'
import { fetchProvinceGeoData } from '../../resources/services/APIs/provinceService'
import { useLocation } from '../../utils/js/LocationContext'

const WeatherMapHome = () => {
  const mapRef = useRef(null)
  const [loading, setLoading] = useState(true)
  // const [location, setLocation] = useState(null)
  const [provincia, setProvincia] = useState('')
  const { t } = useTranslation()
  const mapContainerRef = useRef(null)
  const { location, geoError } = useLocation();
  
  const currentDate = getCurrentDate()
  const currentHour = getCurrentHour()
  
  // ------------------ Functions related to Towns and Weather Data ------------------

  /**
   * Call skyIconMap to determinate the icon that should be displayed on the map
   * @param {*} skyValue value icon (11, 11n, ...)
   * @param {*} size size icon
   * @param {*} color color icon
   * @returns icon sky
   */
  const getWeatherIconComponent = (skyValue, size, color) => {
    if(skyIconMap[skyValue]){
      return skyIconMap[skyValue](size, color)
    }
    return null
  }

  /**
   * Retrieve the province and municipality code to process it on the map later
   * @param {*} name municipality name
   * @returns CPRO+CMUN
   */
  const getTownCodeFromName = (name) => {
    const town = towns.find(t => t.NAME === name)
    return town ? town.CPRO + town.CMUN : null
  }

  /**
   * Identifiy the municipality match if the full name isn't provided by the geolocator.  There may
   * be several municipalities with the same name without their full designation within the same province.
   * @param {*} municipalityName municipality name
   * @param {*} provinceName province name
   * @returns municipality name
   */
  const getTownFromNameAndProvinceFuzzy = (municipalityName, provinceName) => {
    const combinedNames = towns.map(t => `${t.NAME}, ${t.PROV}`) 
    const fuzzy = FuzzySet(combinedNames)
    const searchString = `${municipalityName}, ${provinceName}`
    const result = fuzzy.get(searchString)
    if (result && result.length > 0) {
        const [score, matchedName] = result[0]
        if (score > 0.5) {
            return towns.find(t => `${t.NAME}, ${t.PROV}` === matchedName)
        }
    }
    return null
  }

  /**
   * Get the current date and time values of the passed type and object
   */
  const getCurrentWeatherData = useCallback((properties, sourceData) => {
    if (!sourceData) return null
    const currentDayData = sourceData.data[0].prediccion.dia.find(day => day.fecha === currentDate)
    if (!currentDayData) return null
    const result = {}
    properties.forEach(property => {
        const propData = currentDayData[property]
        if (propData) {
            const propValue = propData.find(data => data.periodo === currentHour)
            result[property] = propValue ? propValue.value : null
        } else {
            result[property] = null
        }
    })
    return result
  }, [currentDate, currentHour])


  /**
   * Return main municipalities from province
   * @param {string} detectedTown 
   * @returns array main municipalities
   */
  const getMainTowns = (detectedTown) => {
    return towns.filter(t => t.CPRO === detectedTown.CPRO && t.MAIN)
  }
    
  // ------------------ Functions related to Mapping and Geolocation ------------------

  /**
   * Properties L map (lines, colors, ...)
   * @param {*} geoShape 
   */
  const drawProvinceOnMap = (geoShape) => {
    L.geoJSON(geoShape, {
      style: {
        color: 'var(--wa-deep-blue)',
        weight: 2,
        opacity: .2,
        fillColor: 'var(--wa-deep-blue)',
        fillOpacity: .1
      }
    }).addTo(mapRef.current)
  }

  /**
   * Get coordinates from geoJSON and paint limit line to province
   */
  const getBoundsFromGeoJSON = (geoShape) => {
    let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180
    const processCoordinates = (coords) => {
        coords.forEach(coord => {
            const [lon, lat] = coord
            minLat = Math.min(lat, minLat)
            maxLat = Math.max(lat, maxLat)
            minLon = Math.min(lon, minLon)
            maxLon = Math.max(lon, maxLon)
        })
    }
    if (geoShape.geometry.type === "Polygon") {
        geoShape.geometry.coordinates.forEach(coordGroup => {
            processCoordinates(coordGroup)
        })
    } else if (geoShape.geometry.type === "MultiPolygon") {
        geoShape.geometry.coordinates.forEach(poly => {
            poly.forEach(coordGroup => {
                processCoordinates(coordGroup)
            })
        })
    }
    return [[minLat, minLon], [maxLat, maxLon]]
  }

  /**
   * We call Nominatim using the coordinates to retrieve the name of the location. 
   * With this name, we identify three random neighboring municipalities to display on the map. 
   * Additionally, we fetch current weather data (such as temperatures, snow, etc.) to be displayed on the map as well.
   */
  const fetchLocationInfo = useCallback(async (latitude, longitude) => {
        
    try {
        const data = await getNameFromCoordinates(latitude, longitude)
        const municipalityName = data.address.city || data.address.town || data.address.village || 'Unknown'
        const provinceName = data.address.province || data.address.state_district || 'Unknown'

        // Detect the municipality using Fuzzy matching based on it's province 
        const detectedTown = getTownFromNameAndProvinceFuzzy(municipalityName, provinceName)
        const mainTowns = getMainTowns(detectedTown)

        // Make request for the municipalities that have 'MAIN' as a parameter in the JSON from previously detected municipality
        const mainTownsCoordsPromises = mainTowns.map(main => getCoordinatesFromName(main.NAME))
        const mainTownsCoords = await Promise.all(mainTownsCoordsPromises)

        const mainTownsPromises = mainTowns.map(main => {
            const mainTownCode = getTownCodeFromName(main.NAME)
            return fetchHourlyPrediction(mainTownCode)
        })

        const mainTownsResults = await Promise.all(mainTownsPromises)

        // Draw the status of the found municipalities on the map
        mainTownsCoords.forEach((coords, index) => {
          const mainWeatherData = getCurrentWeatherData(['estadoCielo', 'temperatura'], mainTownsResults[index])
          const mainWeatherSky = mainWeatherData?.estadoCielo
          const mainTemperature = mainWeatherData?.temperatura
          const mainIconComponent = getWeatherIconComponent(mainWeatherSky, '100%', 'var(--wa-deep-blue)')
          const mainIconHtml = renderToString(mainIconComponent)
          const mainCustomIcon = L.divIcon({ 
                                    html: `${mainIconHtml} <span>${mainTemperature ? `${mainTemperature}°C` : ''}</span>`,
                                    className: 'custom-marker', 
                                    iconAnchor: [24, 58], 
                                    iconSize: [54, 54] })
          L.marker(coords, { icon: mainCustomIcon }).addTo(mapRef.current)
        })

        setProvincia(provinceName)     

        // From the detected coordinates and it's province, draw the province boundaries on the map to highlight it on the page 
        const provinceData = await fetchProvinceGeoData(provinceName)
        if (provinceData?.geo_shape) {
            drawProvinceOnMap(provinceData.geo_shape)
            if (provinceData?.geo_shape && mapRef.current) {
                const bounds = getBoundsFromGeoJSON(provinceData.geo_shape)
                mapRef.current.fitBounds(bounds)
            }
        }
        if (provinceData?.geo_point_2d && mapRef.current) {
            mapRef.current.setView([provinceData.geo_point_2d.lat, provinceData.geo_point_2d.lon], 9)
        }  

    } catch (error) {
        console.error('Error getting location:', error)
    }
  }, [getCurrentWeatherData])

  // ------------------ useEffect Hooks ------------------

  /**
   * Initialize the map using data retrieved from the previous fetch call.
   * If the user not accept, the map will see by default (country Spain)
   */
  useEffect(() => {
    const initMap = (latitude, longitude, zoomLevel) => {
      if (mapContainerRef.current && !mapRef.current) {
        mapRef.current = L.map(mapContainerRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          touchZoom: true,
          dragging: true,
          minZoom: 5
        }).setView([latitude, longitude], zoomLevel)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current)
      }
    }
    if (location) {
      initMap(location.latitude, location.longitude, 9)
      fetchLocationInfo(location.latitude, location.longitude)
    }
    return () => {
      if (mapRef.current) {
          mapRef.current.remove()
          mapRef.current = null
      }
    }
  }, [loading, location, fetchLocationInfo])

  /**
   * If !location show loading
   */
  useEffect(() => {
    if (location || geoError) {
      setLoading(false)
    }
  }, [location, geoError])

  return (
    <WeatherMapHomeStyled className='map__wrapper'>
        {loading ? (
            <div className='loading-skeleton'></div>
        ) : location ? (
            <>
              <div ref={mapContainerRef}></div>
              <ul>
                  <li>{t('HOME.MAP.PROVINCE_OF')} {provincia}</li>
              </ul>
            </>
        ) : (
            <div className='denied-map'>
              <FontAwesomeIcon icon={faMapLocationDot} />
              <FontAwesomeIcon icon={faSlash} />
            </div>
        )}
    </WeatherMapHomeStyled>
  )

}

export default WeatherMapHome
