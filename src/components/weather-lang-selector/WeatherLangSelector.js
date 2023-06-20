import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { WeatherLangSelectorStyled } from './WeatherLangSelectorStyled'

const WeatherLangSelector = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const selectedLanguage = localStorage.getItem('language') || 'es';
    i18n.changeLanguage(selectedLanguage);
  }, [i18n]);

  const handleChangeLanguage = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
  };

  return (
    <WeatherLangSelectorStyled value={i18n.language} onChange={handleChangeLanguage}>
        <option value="es">ESP</option>
        <option value="en">EN</option>
    </WeatherLangSelectorStyled>
  );
}

export default WeatherLangSelector;
