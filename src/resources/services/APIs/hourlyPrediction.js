import { municipalityCode, requestProduct } from './aemetClient'
export const fetchHourlyPrediction = code => requestProduct(`prediccion/especifica/municipio/horaria/${municipalityCode(code)}`)
