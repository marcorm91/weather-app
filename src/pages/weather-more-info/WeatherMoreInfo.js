import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { WeatherMoreInfoStyled } from './WeatherMoreInfoStyled'
import WeatherPanelRightInfo from '../../components/weather-panel-right-info/WeatherPanelRightInfo'
import { fetchHourlyPrediction } from '../../resources/services/APIs/hourlyPrediction'
import { fetchDiaryPrediction } from '../../resources/services/APIs/diaryPrediction'
import WeatherDetailInfo from '../../components/weather-detail-info/WeatherDetailInfo'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

const WeatherMoreInfo = () => {
  const location = useLocation()
  const { data } = location.state || {}
  const { CPRO, CMUN } = data
  const code = `${CPRO}${CMUN}`
  const [hourlyPredictionData, setHourlyPredictionData] = useState(null)
  const [diaryPredictionData, setDiaryPredictionData] = useState(null)

  const handleMinimizeClick = () => {
    if(window.innerWidth > 1024) {
      setIsMinimized(prevState => !prevState)
    }
  }

  const [isMinimized, setIsMinimized] = useState(window.innerWidth <= 1024)

  useEffect(() => {
    const handleResize = () => {
      setIsMinimized(window.innerWidth <= 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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
    <WeatherMoreInfoStyled className={`background-main-image ${isMinimized ? 'minimized-panel' : ''}`}>
      <div className='col__wrapper'>
        <div className='title__wrapper'>
          <Link to={'/'}>
            <FontAwesomeIcon icon={faChevronLeft} color='var(--wa-deep-blue)' size='lg'/></Link>
            <h2>{data.NAME}, {data.PROV}, {data.COMUNIDAD}</h2>
        </div>
        <WeatherDetailInfo 
          hourlyPredictionData={hourlyPredictionData} 
          diaryPredictionData={diaryPredictionData} />
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
