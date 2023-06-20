import React, { useState } from 'react'
import { WeatherTableRowActions } from './WeatherTableRowActionsStyled'
import Loader from '../weather-loader/WeatherLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { fetchPredictionData } from '../../resources/services/APIs/predictionAPI'

const Actions = ({ row }) => {

  const [isLoading, setIsLoading] = useState(false);

  const handleAddToFavorites = () => {
    // Lógica para añadir a favoritos
    console.log('Añadir a favoritos', row.original);
  };

  const handleMoreInfo = async () => {
    const { CPRO, CMUN } = row.original
    const code = `${CPRO}${CMUN}`
    setIsLoading(true);
    try{
      
      const predictionData = await fetchPredictionData(code);
      console.log(predictionData);
      
    }catch (e){
      console.error(e)
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <WeatherTableRowActions>
      <button onClick={handleAddToFavorites}>
        <FontAwesomeIcon icon={faStar} style={{color: "var(--wa-leadbelcher)"}} />
      </button>
      <button onClick={handleMoreInfo}>
        {isLoading ? (
          <Loader />
        ) : (
          <FontAwesomeIcon icon={faCircleInfo} style={{ color: 'var(--wa-deep-blue)' }} />
        )}
      </button>
    </WeatherTableRowActions>
  );
};

export default Actions;
