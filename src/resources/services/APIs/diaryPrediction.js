import { municipalityCode, requestProduct } from './aemetClient'
export const fetchDiaryPrediction = code => requestProduct(`prediccion/especifica/municipio/diaria/${municipalityCode(code)}`)
