import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useTranslation } from 'react-i18next';
import { WeatherAdWarningStyled } from './WeatherAdWarningStyled';

// Data alerts by AEMET
const HIGH_TEMP = 40;
const HIGH_WIND = 70;
const HIGH_PREC = 15;
const HIGH_SNOW = 20;

const WeatherAdWarning = ({ data, index, type = "hour" }) => {

  const { t } = useTranslation();
  let advisories = [];

  const getAdvisories = () => {

    // Get data per hour for prediction by hours tab
    if (type === "hour") {
      const tempValue = data.temperatura ? parseInt(data.temperatura[index].value, 10) : null;
      const windValue = data.vientoAndRachaMax ? parseInt(data.vientoAndRachaMax[index].velocidad, 10) : null;
      const precValue = data.precipitacion ? parseInt(data.precipitacion[index].value, 10) : null;
      const snowValue = data.nieve ? parseInt(data.nieve[index].value, 10) : null;
      
      if (tempValue >= HIGH_TEMP) advisories.push(t('MORE_INFO.AD.AD_HIGH_TEMP'));
      if (windValue >= HIGH_WIND) advisories.push(t('MORE_INFO.AD.AD_HIGH_WIND'));
      if (precValue >= HIGH_PREC) advisories.push(t('MORE_INFO.AD.AD_HIGH_PREC'));
      if (snowValue >= HIGH_SNOW) advisories.push(t('MORE_INFO.AD.AD_HIGH_SNOW'));
      
    // Get data per days for prediction by days tab
    } else if (type === "day") {
      const tempMaxValue = data.temperatura.maxima;
      const windValue = data.viento && data.viento[index] ? parseInt(data.viento[index].velocidad, 10) : null;
      
      if (tempMaxValue >= HIGH_TEMP) advisories.push(t('MORE_INFO.AD.AD_HIGH_TEMP'));
      if (windValue >= HIGH_WIND) advisories.push(t('MORE_INFO.AD.AD_HIGH_WIND'));

    }
  }

  getAdvisories();

  if (advisories.length === 0) {
    return null;
  }

  return (
    <WeatherAdWarningStyled className='ad-warning__wrapper'>
      {advisories.length > 0 && (
        <>
          <FontAwesomeIcon 
            icon={faExclamationTriangle} 
            color='var(--wa-deep-blue)' 
            data-tooltip-id={`advisory-${index}`}
          />
          <ReactTooltip id={`advisory-${index}`} place='bottom'>
            <ul>
              {advisories.map((advisory, idx) => (
                <li key={idx}>{advisory}</li>
              ))}
            </ul>
          </ReactTooltip>
        </>
      )}
    </WeatherAdWarningStyled>
  );
}

export default WeatherAdWarning;
