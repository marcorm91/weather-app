import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { WeatherLangSelectorStyled } from './WeatherLangSelectorStyled'
import { getSavedLanguage, storeSelectedLanguage } from '../../utils/js/localStorageUtils'

const WeatherLangSelector = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    const selectedLanguage = getSavedLanguage();
    i18n.changeLanguage(selectedLanguage)
  }, [i18n])

  const handleChangeLanguage = (event) => {
    const selectedLanguage = event.target.value
    i18n.changeLanguage(selectedLanguage)
    storeSelectedLanguage(selectedLanguage)
  }

  return (
    <WeatherLangSelectorStyled value={i18n.language} onChange={handleChangeLanguage}>
        <option value="es">ESP</option>
        <option value="en">EN</option>
    </WeatherLangSelectorStyled>
  )
}

export default WeatherLangSelector