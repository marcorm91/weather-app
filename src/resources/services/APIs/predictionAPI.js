import axios from 'axios';
import config from '../keys/config';

export const fetchPredictionData = async (code) => {
  if(!config){
    throw new Error(
      'The configuration file (config.js) does not exist. Create a config.js file based on config.example.js and add your API keys.'
    );
  }else{
    try {
      const apiKey = config.apiKey;
      const apiUrl = 'https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria';
      const response = await axios.get(`${apiUrl}/${code}/?api_key=${apiKey}`);
      const url = response.data.datos;
      const weatherResponse = await axios.get(url);
      return weatherResponse;
    } catch (error) {
      console.error('Error retrieving weather data: ', error);
      throw error;
    }
  }

};
