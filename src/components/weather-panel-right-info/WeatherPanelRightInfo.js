import React from 'react'
import WeatherMapMunicipality from '../weather-map-municipality/WeatherMapMunicipality'
import { WeatherPanelRightInfoStyled, 
         WeatherMapSkeletonStyled, 
         WeatherListSkeletonStyled,
         WeatherCurrentPredictionSkeletonStyled } from './WeatherPanelRightInfoStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import WeatherCurrentPrediction from '../weather-current-prediction/WeatherCurrentPrediction'

const WeatherPanelRightInfo = ({ municipalityObject, hourlyPredictionData, diaryPredictionData, onMinimize }) => {
  const { t } = useTranslation()

  if (!hourlyPredictionData || !diaryPredictionData) {

    return (
      <WeatherPanelRightInfoStyled >
        <WeatherMapSkeletonStyled className='loading-skeleton' />
        <WeatherListSkeletonStyled>
            <ul>
                <li className='loading-skeleton'></li>
                <li className='loading-skeleton'></li>
                <li className='loading-skeleton'></li>
            </ul>
        </WeatherListSkeletonStyled>
        <hr className='separator' />
        <WeatherCurrentPredictionSkeletonStyled>
            <div className='loading-skeleton'></div>
            <div className='loading-skeleton'></div>
        </WeatherCurrentPredictionSkeletonStyled>
      </WeatherPanelRightInfoStyled>
    )
  }

  return (
    <WeatherPanelRightInfoStyled>
      <button className='btn-minimized-panel' onClick={onMinimize}>
        <FontAwesomeIcon icon={faAnglesRight} size='3x' color='var(--wa-deep-blue)' />
      </button>
      <WeatherMapMunicipality municipalityObject={municipalityObject} />
      <ul className='info__wrapper'>
        <li><span>{t('MORE_INFO.PANEL_RIGHT_INFO.MUNICIPALITY')}: </span>{municipalityObject.NAME}</li>
        <li><span>{t('MORE_INFO.PANEL_RIGHT_INFO.PROVINCE')}: </span>{municipalityObject.PROV}</li>
        <li><span>{t('MORE_INFO.PANEL_RIGHT_INFO.COMUNITY')}: </span>{municipalityObject.COMUNIDAD}</li>
      </ul>
      <hr className='separator' />
      <WeatherCurrentPrediction
        hourlyData={hourlyPredictionData} 
        diaryData={diaryPredictionData} />
    </WeatherPanelRightInfoStyled>
  )
}

export default WeatherPanelRightInfo
