import React, { useState } from 'react'
import { WeatherTableRowActions } from './WeatherTableRowActionsStyled'
import WeatherLoader from '../weather-loader/WeatherLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import WeatherSlidingPanel from '../weather-sliding-panel/WeatherSlidingPanel'
import { fetchHourlyPrediction } from '../../resources/services/APIs/hourlyPrediction'
import { fetchDiaryPrediction } from '../../resources/services/APIs/diaryPrediction'

const Actions = ({ row }) => {

  const [isLoading, setIsLoading] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [panelData, setPanelData] = useState(null)

  const handleAddToFavorites = () => {
    // Lógica para añadir a favoritos
    console.log('Añadir a favoritos', row.original)
  }

  const handleMoreInfo = async () => {
    const { CPRO, CMUN } = row.original
    const code = `${CPRO}${CMUN}`
    setIsLoading(true)
    try{
      const hourlyPredictionData = await fetchHourlyPrediction(code)
      const diaryPredictionData = await fetchDiaryPrediction(code)
      setPanelData({hourlyPredictionData, diaryPredictionData})
      setIsPanelOpen(true)
    }catch (e){
      console.error(e)
    }finally{
      setIsLoading(false)
    }
  }

  const closePanel = () => {
    setIsPanelOpen(false)
    setPanelData(null)
  }

  return (
    <WeatherTableRowActions>
      <button onClick={handleAddToFavorites}>
        <FontAwesomeIcon 
          icon={faStar} 
          style={{color: "var(--wa-leadbelcher)"}} />
      </button>
      <button onClick={handleMoreInfo}>
        {isLoading ? (
          <WeatherLoader />
        ) : (
          <FontAwesomeIcon 
            icon={faCircleInfo} 
            style={{ color: 'var(--wa-deep-blue)' }} />
        )}
      </button>
      {isPanelOpen && (
        <WeatherSlidingPanel 
          data={panelData} 
          onClose={closePanel} 
          isOpen={isPanelOpen} />
      )}
    </WeatherTableRowActions>
  )
}

export default Actions
