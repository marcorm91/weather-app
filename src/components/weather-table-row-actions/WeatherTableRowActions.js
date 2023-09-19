import React, { useState, useEffect } from 'react'
import { WeatherTableRowActions } from './WeatherTableRowActionsStyled'
import WeatherLoader from '../weather-loader/WeatherLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faCircleInfo, faMapLocation } from '@fortawesome/free-solid-svg-icons'
import WeatherSlidingPanel from '../weather-sliding-panel/WeatherSlidingPanel'
import { fetchHourlyPrediction } from '../../resources/services/APIs/hourlyPrediction'
import { fetchDiaryPrediction } from '../../resources/services/APIs/diaryPrediction'
import { getFavorites, removeFavorite, addFavorite } from '../../utils/js/localStorageUtils'

const Actions = ({ row, onDeleteRow, setSelectedTown }) => {
  const rowId = `${row.original.CODAUTO}-${row.original.CPRO}-${row.original.CMUN}-${row.original.DC}`
  const [isLoading, setIsLoading] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [panelData, setPanelData] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false) 
  const municipalityObject = row.original
    
  // Get items from local storage
  useEffect(() => {
    const favorites = getFavorites()
    setIsFavorite(favorites.includes(rowId))
  }, [rowId])
  
  // Add item to fav list table.  Check if exists and delete from list.
  const handleAddToFavorites = () => {
    const isCurrentFavorite = getFavorites().includes(rowId)
    if (isCurrentFavorite) {
      removeFavorite(rowId)
      if (onDeleteRow) {
        onDeleteRow(rowId)
      }
    } else {
      addFavorite(rowId)
    }
    setIsFavorite(!isCurrentFavorite)
  }

  // Get more info from component by CPRO and CMUN.
  const handleMoreInfo = async () => {
    const { CPRO, CMUN } = row.original
    const code = `${CPRO}${CMUN}`
    setIsLoading(true)
    try {
      const hourlyPredictionData = await fetchHourlyPrediction(code)
      const diaryPredictionData = await fetchDiaryPrediction(code)
      setPanelData({ hourlyPredictionData, diaryPredictionData })
      setIsPanelOpen(true)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const closePanel = () => {
    setIsPanelOpen(false)
    setPanelData(null)
  }

  return (
    <WeatherTableRowActions>
      <button 
        onClick={handleAddToFavorites}
        className={isFavorite ? 'fav-button checked' : 'fav-button'}>
        <FontAwesomeIcon
          icon={faStar}
        />
      </button>
      <button
        onClick={() => setSelectedTown(row.original)}>
        <FontAwesomeIcon 
          color='var(--wa-deep-blue)'
          icon={faMapLocation}
        />
      </button>
      <button onClick={handleMoreInfo}>
        {isLoading ? (
          <WeatherLoader />
        ) : (
          <FontAwesomeIcon
            color='var(--wa-deep-blue)'
            icon={faCircleInfo}
          />
        )}
      </button>
      {isPanelOpen && (
        <WeatherSlidingPanel
          data={panelData}
          onClose={closePanel}
          isOpen={isPanelOpen}
          municipalityObject={municipalityObject}
        />
      )}
    </WeatherTableRowActions>
  )
}

export default Actions