import { WeatherFooterStyled } from './WeatherFooterStyled'
import { useTranslation } from 'react-i18next';

const WeatherFooter = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  return (
    <WeatherFooterStyled>
      <p>© {currentYear} {t("FOOTER.COPYRIGHT")}</p>
    </WeatherFooterStyled>
  );
}

export default WeatherFooter;
