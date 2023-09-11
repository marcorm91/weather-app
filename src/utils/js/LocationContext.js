import React, { createContext, useContext, useState, useEffect } from 'react'

const LocationContext = createContext()

export const useLocation = () => useContext(LocationContext)

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null)
  const [geoError, setGeoError] = useState(false)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      error => {
        console.error('Error getting location:', error)
        setLocation(null)
        setGeoError(true)
      }
    )
  }, [])

  return (
    <LocationContext.Provider value={{ location, geoError }}>
      {children}
    </LocationContext.Provider>
  )
}
