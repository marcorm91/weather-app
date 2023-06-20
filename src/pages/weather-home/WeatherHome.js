import React from 'react'
import  WeatherTable from '../../components/weather-table/WeatherTable'
import { WeatherHomeStyled } from './WeatherHomeStyled'
import { useTranslation } from 'react-i18next'

const WeatherHome = () => {
  const { t, i18n } = useTranslation();
  const date = new Date();
  const dateOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  const day = date.toLocaleDateString(i18n.language, dateOptions);
  return (
    <WeatherHomeStyled>
      <h1>{t('HOME.WELCOME_MSG', { day })}</h1>
      <WeatherTable />
    </WeatherHomeStyled>
  );
}

export default WeatherHome;
