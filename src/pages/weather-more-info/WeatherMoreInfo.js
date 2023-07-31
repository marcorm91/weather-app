import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { WeatherMoreInfoStyled } from './WeatherMoreInfoStyled'
import WeatherPanelRightInfo from '../../components/weather-panel-right-info/WeatherPanelRightInfo'
import { fetchHourlyPrediction } from '../../resources/services/APIs/hourlyPrediction'
import { fetchDiaryPrediction } from '../../resources/services/APIs/diaryPrediction'
import WeatherDetailInfo from '../../components/weather-detail-info/WeatherDetailInfo'

const WeatherMoreInfo = () => {
  const location = useLocation()
  const [isMinimized, setIsMinimized] = useState(false)
  const { data } = location.state || {}
  const { CPRO, CMUN } = data
  const code = `${CPRO}${CMUN}`
  const [hourlyPredictionData, setHourlyPredictionData] = useState(null)
  const [diaryPredictionData, setDiaryPredictionData] = useState(null)

  const handleMinimizeClick = () => {
    setIsMinimized(prevState => !prevState);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hourlyData = await fetchHourlyPrediction(code)
        const diaryData = await fetchDiaryPrediction(code)
        setHourlyPredictionData(hourlyData)
        setDiaryPredictionData(diaryData)
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [code])

  return (
    <WeatherMoreInfoStyled className={isMinimized ? 'minimized-panel' : ''}>
      <div className='col__wrapper'>
        <h2>{data.NAME}, {data.PROV}, {data.COMUNIDAD}</h2>
        <WeatherDetailInfo />
      </div>
      <div className='col__wrapper'>
        <WeatherPanelRightInfo
          municipalityObject={data}
          hourlyPredictionData={hourlyPredictionData}
          diaryPredictionData={diaryPredictionData}
          onMinimize={handleMinimizeClick}
        />
      </div>
    </WeatherMoreInfoStyled>
  )
}

export default WeatherMoreInfo
