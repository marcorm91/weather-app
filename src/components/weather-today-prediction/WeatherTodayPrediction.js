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
  const skyList3 = hourlyData?.data[0]?.prediccion?.dia[2]?.estadoCielo
  const tempList1 = hourlyData?.data[0]?.prediccion?.dia[0]?.temperatura
  const tempList2 = hourlyData?.data[0]?.prediccion?.dia[1]?.temperatura
  const tempList3 = hourlyData?.data[0]?.prediccion?.dia[2]?.temperatura

  const nextHours = []
  const maxHoursToShow = 6

  let isSecondSkyList = false
  let isSecondTempList = false
  let isThirdSkyList = false
  let isThirdTempList = false

  let skyListIndex = 0
  let tempListIndex = 0

  // Iterate over skyList1, skyList2, and skyList3 to find the next hours
  while (nextHours.length < maxHoursToShow) {
    let skyItem, tempItem

    if (isThirdSkyList) {
      skyItem = skyList3[skyListIndex]
      tempItem = tempList3[tempListIndex]
    } else if (isSecondSkyList) {
      skyItem = skyList2[skyListIndex]
      tempItem = tempList2[tempListIndex]
    } else {
      skyItem = skyList1[skyListIndex]
      tempItem = tempList1[tempListIndex]
    }

    if (!skyItem || !tempItem) {
      break
    }

    if ((isSecondSkyList || isThirdSkyList) || skyItem.periodo > currentHour) {
      const hour = skyItem.periodo + ':00'
      const value = skyItem.value
      const description = skyItem.descripcion
      const temp = tempItem.value
      nextHours.push({ hour, value, description, temp })
    }

    if (!isSecondSkyList && skyItem.periodo === '23') {
      isSecondSkyList = true
      skyListIndex = 0 // Reset skyListIndex for the second list
    } else if (isSecondSkyList && skyListIndex === skyList2.length - 1 && !isThirdSkyList) {
      isThirdSkyList = true
      skyListIndex = 0 // Reset skyListIndex for the third list
    } else {
      skyListIndex++
    }

    if (!isSecondTempList && tempItem.periodo === '23') {
      isSecondTempList = true
      tempListIndex = 0 // Reset tempListIndex for the second list
    } else if (isSecondTempList && tempListIndex === tempList2.length - 1 && !isThirdTempList) {
      isThirdTempList = true
      tempListIndex = 0 // Reset tempListIndex for the third list
    } else {
      tempListIndex++
    }
  }

  // Remove the first element if it matches the current hour
  if (nextHours.length > 0 && nextHours[0].hour === currentHour + ':00') {
    nextHours.shift()
  }

  return (
    <WeatherTodayPredictionStyled>
      <span>{t('HOME.PANEL_INFO.PREDICTON_NEXT_HOURS')}</span>
      <ul>
        {nextHours.slice(0, maxHoursToShow).map((item, i) => (
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
