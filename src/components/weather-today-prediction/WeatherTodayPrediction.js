import React from 'react'
import { WeatherTodayPredictionStyled } from './WeatherTodayPredictionStyled'
import { skyIconMap } from '../../utils/js/skyIcons'
import { getCurrentHour } from '../../utils/js/helpers'
import { useTranslation } from 'react-i18next'

const WeatherTodayPrediction = ({ hourlyData }) => {
  const { t } = useTranslation()

  // Getting current date and hour for making later comparisons
  const currentHour = getCurrentHour()

  // Get info next hours prediction
  const skyList1 = hourlyData?.data[0]?.prediccion?.dia[0]?.estadoCielo
  const skyList2 = hourlyData?.data[0]?.prediccion?.dia[1]?.estadoCielo
  const tempList1 = hourlyData?.data[0]?.prediccion?.dia[0]?.temperatura
  const tempList2 = hourlyData?.data[0]?.prediccion?.dia[1]?.temperatura

  const nextHours = []
  const maxHoursToShow = 6

  let isSecondSkyList = false
  let isSecondTempList = false

  let skyListIndex = 0
  let tempListIndex = 0

  // Iterate over skyList1 and skyList2 to find the next hours
  while (nextHours.length < maxHoursToShow) {
    const skyItem = isSecondSkyList ? skyList1[skyListIndex] : skyList2[skyListIndex]
    const tempItem = isSecondTempList ? tempList1[tempListIndex] : tempList2[tempListIndex]

    if (!skyItem || !tempItem) {
      break
    }

    if (isSecondSkyList || skyItem.periodo > currentHour) {
      const hour = skyItem.periodo + ':00'
      const value = skyItem.value
      const description = skyItem.descripcion
      const temp = tempItem.value
      nextHours.push({ hour, value, description, temp })
    }

    if (!isSecondSkyList && skyItem.periodo === '23') {
      isSecondSkyList = true
      skyListIndex = 0 // Reset skyListIndex for the second list
    } else {
      skyListIndex++
    }

    if (!isSecondTempList && tempItem.periodo === '23') {
      isSecondTempList = true
      tempListIndex = 0 // Reset tempListIndex for the second list
    } else {
      tempListIndex++
    }
  }

  return (
    <WeatherTodayPredictionStyled>
      <span>{t('HOME.PANEL_INFO.PREDICTON_NEXT_HOURS')}</span>
      <ul>
        {nextHours.map((item, i) => (
          <li key={i}>
            <time>{item.hour}</time>
            {skyIconMap[item.value] && skyIconMap[item.value](58, 'var(--wa-deep-blue)')}
            <span>{item.temp}º</span>
            <span>{item.description}</span>
          </li>
        ))}
      </ul>
    </WeatherTodayPredictionStyled>
  )
}

export default WeatherTodayPrediction
