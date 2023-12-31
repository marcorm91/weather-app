import React from 'react'
import { WeatherTodayPredictionStyled } from './WeatherTodayPredictionStyled'
import { skyIconMap } from '../../utils/js/skyIcons'
import { getCurrentHour, getCurrentDate } from '../../utils/js/helpers'
import { useTranslation } from 'react-i18next'

const WeatherTodayPrediction = ({ hourlyData }) => {
  const { t } = useTranslation()

  const currentHour = getCurrentHour()
  const currentDate = getCurrentDate()

  // Find the current day in the data.  If the array ends and there are still elements to display, it should
  // jump to the next list.
  const currentDayIndex = hourlyData?.data[0]?.prediccion?.dia.findIndex(day => day.fecha === currentDate)
  const currentDay = hourlyData?.data[0]?.prediccion?.dia[currentDayIndex]
  const nextDay = hourlyData?.data[0]?.prediccion?.dia[currentDayIndex + 1]

  const skyList = [...(currentDay?.estadoCielo || []), ...(nextDay?.estadoCielo || [])]
  const tempList = [...(currentDay?.temperatura || []), ...(nextDay?.temperatura || [])]

  const nextHours = []
  const maxHoursToShow = 6

  let startIndex = -1
  for (let i = 0; i < skyList.length; i++) {
    if (skyList[i].periodo === currentHour) {
      startIndex = i
      break
    }
  }

  if (startIndex !== -1) {
    for (let i = startIndex+1; i < skyList.length; i++) {
      const hour = skyList[i].periodo + ':00'
      const value = skyList[i].value
      const description = skyList[i].descripcion
      const temp = tempList[i]?.value
      nextHours.push({ hour, value, description, temp })
      if (nextHours.length === maxHoursToShow) {
        break
      }
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
