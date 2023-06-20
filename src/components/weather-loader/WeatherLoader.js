import { WeatherLoaderStyled } from './WeatherLoaderStyled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const WeatherLoader = () => {
  return (
    <WeatherLoaderStyled>
        <FontAwesomeIcon icon={faSpinner} spin style={{ color: 'var(--wa-deep-blue)' }} />
    </WeatherLoaderStyled>
  );
}

export default WeatherLoader;
