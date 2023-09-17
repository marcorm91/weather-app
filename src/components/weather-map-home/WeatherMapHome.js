import React, { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { WeatherMapHomeStyled } from './WeatherMapHomeStyled'
import { fetchHourlyPrediction } from '../../resources/services/APIs/hourlyPrediction'
import towns from '../../resources/services/code_towns.json'
import { skyIconMap } from '../../utils/js/skyIcons'
import { getCurrentDate, getCurrentHour, getTimezoneOffset } from '../../utils/js/helpers'
import { renderToString } from 'react-dom/server'
import FuzzySet from 'fuzzyset.js'
import { useTranslation } from 'react-i18next'
import { getNameFromCoordinates, getCoordinatesFromName } from '../../resources/services/APIs/geoService'
import { fetchProvinceGeoData } from '../../resources/services/APIs/provinceService'
import { fetchCurrentSkySpain } from '../../resources/services/APIs/currentSkySpain'
import { useLocation } from '../../utils/js/LocationContext'

const WeatherMapHome = ({ CPRO, CMUN }) => {
  const mapRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [provincia, setProvincia] = useState('')
  const { t } = useTranslation()
  const mapContainerRef = useRef(null)
  const { location, geoError } = useLocation()
  const [isViewingSpain, setIsViewingSpain] = useState(false)
  const [isViewingCanary, setIsViewingCanary] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  
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
    const currentDayData = sourceData.data[0].prediccion.dia.find(day => day.fecha === getCurrentDate())
    if (!currentDayData) return null
    const result = {}
    properties.forEach(property => {
        const propData = currentDayData[property]
        if (propData) {
            const propValue = propData.find(data => data.periodo === getCurrentHour())
            result[property] = propValue ? propValue.value : null
        } else {
            result[property] = null
        }
    })
    return result
  }, [])


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
  }

  /**
   * Displays the map view focused on Canaries.
   */
  const showCanariesMap = async () => {
    if (!mapRef.current) return
    
    mapRef.current.setView([28.5916, -15.6291], 7);

    const formattedDateTime = `${getCurrentDate().slice(0, -9)}T${getCurrentHour()}:00:00+01:00`
    const data = await fetchCurrentSkySpain('eCielo', 'CAN', 6, formattedDateTime);

    console.log(data)

    data[0].features.forEach(feature => {
        const coordinates = feature.geometry.coordinates;
        const eCieloValue = feature.properties.eCielo;
        const iconComponent = skyIconMap[eCieloValue];
        if (!iconComponent) return;
        const iconHTML = renderToString(iconComponent(32, 'var(--wa-deep-blue)'));
        const customIcon = L.divIcon({ html: iconHTML });
        L.marker([coordinates[1], coordinates[0]], { icon: customIcon }).addTo(mapRef.current);
    });
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
        const mainTownsCoordsPromises = mainTowns.map(main => getCoordinatesFromName(main.NAME, main.PROV))
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

    return new Promise((resolve) => {
      mapRef.current.whenReady(resolve)
    })

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
    if (location) {
      initMap(location.latitude, location.longitude, 9)
      fetchLocationInfo(location.latitude, location.longitude).then(() => {
        setMapLoaded(true)
      })
    }else 
      // No allow geolocation.  Print default Spain map
      if(geoError){
        initMap(39.8168, -2.9000, 6)
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
            fetchDataAndDisplayOnMap()
      }
    return () => {
      if (mapRef.current) {
          mapRef.current.remove()
          mapRef.current = null
      }
    }
  }, [loading, location, fetchLocationInfo, geoError])

  /**
   * If !location show loading
   */
  useEffect(() => {
    if (location || geoError) {
      setLoading(false)
    }
  }, [location, geoError])

  /**
   * If there's a geoError, show the default Spain map.
   */
  useEffect(() => {
    if (geoError) {
        showDefaultSpainMap()
        setIsViewingSpain(true)
    }
  }, [geoError])

  /**
   * Action that goes to the municipality to get the weather details
   */
  useEffect(() => {
    const centerMapToTown = async () => {
        if (CPRO && CMUN) {
            const town = towns.find(t => t.CPRO === CPRO && t.CMUN === CMUN)
            if (town) {
                try {
                    const coords = await getCoordinatesFromName(town.NAME, town.PROV)
                    if (coords && mapRef.current) {
                        mapRef.current.setView(coords, 10)
                    }
                } catch (error) {
                    console.error("Error obteniendo las coordenadas:", error)
                }
            }
        }
    }
    centerMapToTown()
  }, [CPRO, CMUN, mapRef])

  return (
    <WeatherMapHomeStyled className='map__wrapper'>
      {loading ? (
        <div className='loading-skeleton'></div>
      ) : (
        <>
          <div ref={mapContainerRef}></div>
          {location && !isViewingCanary && !isViewingSpain && mapLoaded ? (
            <ul>
                <li>{t('HOME.MAP.PROVINCE_OF')} {provincia}</li>
            </ul>
          ) : null}
          {!isViewingSpain && (isViewingCanary || geoError || location) ? (
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
