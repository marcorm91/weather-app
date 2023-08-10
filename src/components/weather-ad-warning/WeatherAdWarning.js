import { WeatherAdWarningStyled } from './WeatherAdWarningStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useTranslation } from 'react-i18next'

const WeatherAdWarning = ({ data, index }) => {

  const { t } = useTranslation() 
  let advisories = [] 
  
  const tempValue = data.temperatura ? parseInt(data.temperatura[index].value, 10) : null
  const windValue = data.vientoAndRachaMax ? parseInt(data.vientoAndRachaMax[index].velocidad, 10) : null
  const precValue = data.precipitacion ? parseInt(data.precipitacion[index].value, 10) : null
  const snowValue = data.nieve ? parseInt(data.nieve[index].value, 10) : null

  const HIGH_TEMP = 40
  if (tempValue >= HIGH_TEMP) {
    advisories.push(t('MORE_INFO.AD.AD_HIGH_TEMP'))
  }
  
  const HIGH_WIND = 70
  if (windValue >= HIGH_WIND) {
    advisories.push(t('MORE_INFO.AD.AD_HIGH_WIND'))
  }

  const HIGH_PREC = 15
  if (precValue >= HIGH_PREC) {
    advisories.push(t('MORE_INFO.AD.AD_HIGH_PREC'))
  }

  const HIGH_SNOW = 20
  if (snowValue >= HIGH_SNOW) {
    advisories.push(t('MORE_INFO.AD.AD_HIGH_SNOW'))
  }

  if (advisories.length === 0){
    return null
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
  )
}

export default WeatherAdWarning
