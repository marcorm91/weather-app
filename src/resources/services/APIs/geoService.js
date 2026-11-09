export const getNameFromCoordinates = async (latitude, longitude, signal) => {
  const query = new URLSearchParams({ lat: latitude, lon: longitude, format: 'json', 'accept-language': 'es', zoom: '10' })
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${query}`, { signal })
  if (!response.ok) throw new Error('geolocation')
  return response.json()
}
export const getMunicipalityByCPROCMUN = async (CPRO, CMUN, signal) => {
  const code = `${CPRO}${CMUN}`
  if (!/^\d{5}$/.test(code)) throw new Error('invalid')
  const query = new URLSearchParams({ where: `CODIGOINE='${code}'`, outFields: 'CODIGOINE', f: 'geojson', outSR: '4326' })
  const response = await fetch(`https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/Municipios/FeatureServer/0/query?${query}`, { signal })
  if (!response.ok) throw new Error('map')
  const data = await response.json()
  if (!data.features?.[0]) throw new Error('map')
  return data.features[0]
}
