import { useTranslation } from 'react-i18next'
import { WeatherHeaderStyled } from './WeatherHeaderStyled'
import WeatherLangSelector from '../weather-lang-selector/WeatherLangSelector'

const WeatherHeader = () => {
  const { t } = useTranslation();
  return (
    <WeatherHeaderStyled>
      <div className="title__wrapper">
        <div className="wa-icon-logo-white"></div>
        <h1>{t("HEADER.TITLE")}</h1>
      </div>
      <WeatherLangSelector></WeatherLangSelector>
    </WeatherHeaderStyled>
  );
}

export default WeatherHeader;
