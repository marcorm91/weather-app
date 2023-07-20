import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { WeatherMoreInfoStyled } from './WeatherMoreInfoStyled'
import WeatherPanelRightInfo from '../../components/weather-panel-right-info/WeatherPanelRightInfo'
import { fetchHourlyPrediction } from '../../resources/services/APIs/hourlyPrediction'
import { fetchDiaryPrediction } from '../../resources/services/APIs/diaryPrediction'

const WeatherMoreInfo = () => {
  const location = useLocation()
  const { data } = location.state || {}
  const { CPRO, CMUN } = data
  const code = `${CPRO}${CMUN}`
  const [hourlyPredictionData, setHourlyPredictionData] = useState(null)
  const [diaryPredictionData, setDiaryPredictionData] = useState(null)

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
    <WeatherMoreInfoStyled>
      <div className='col__wrapper'>
        <h2>{data.NAME}, {data.PROV}, {data.COMUNIDAD}</h2>
      </div>
      <div className='col__wrapper'>
          <WeatherPanelRightInfo
            municipalityObject={data}
            hourlyPredictionData={hourlyPredictionData}
            diaryPredictionData={diaryPredictionData}
          />
      </div>
    </WeatherMoreInfoStyled>
  )
}

export default WeatherMoreInfo
