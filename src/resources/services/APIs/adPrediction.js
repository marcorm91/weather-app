import { requestProduct, WeatherError } from './aemetClient'
export const fetchAdPrediction = code => {
  if (!/^[a-z]{3}$/i.test(code)) throw new WeatherError('invalid')
  return requestProduct(`prediccion/ccaa/hoy/${code}`, { text: true })
}
