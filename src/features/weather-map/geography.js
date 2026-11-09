const cache = new Map()
const BASE = 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/Municipios/FeatureServer/0/query'
export async function loadGeography(level, province, signal) {
  const key = level === 'province' || level === 'town' ? `municipalities-${province}` : level === 'country' ? 'communities' : 'provinces'
  if (cache.has(key)) return cache.get(key)
  let url = `${process.env.PUBLIC_URL || ''}/maps/${key}.geojson`
  if (key.startsWith('municipalities')) {
    if (!/^\d{2}$/.test(province)) throw new Error('mapError')
    const query = new URLSearchParams({ where: `CODIGOINE LIKE '${province}%'`, outFields: 'CODIGOINE,NAMEUNIT', f: 'geojson', outSR: '4326', geometryPrecision: '4', maxAllowableOffset: '0.003', resultRecordCount: '1000' })
    url = `${BASE}?${query}`
  }
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('mapError')
  const collection = await response.json()
  if (!Array.isArray(collection.features) || !collection.features.length || collection.exceededTransferLimit || collection.properties?.exceededTransferLimit) throw new Error('mapError')
  if (key.startsWith('municipalities')) collection.features = collection.features.map(feature => ({ ...feature, properties: { code: feature.properties.CODIGOINE, name: feature.properties.NAMEUNIT } }))
  cache.set(key, collection)
  return collection
}
export function featureCentre(feature) {
  const points = []
  const walk = coords => { if (typeof coords[0] === 'number') points.push(coords); else coords.forEach(walk) }
  walk(feature.geometry.coordinates)
  const xs = points.map(p => p[0]), ys = points.map(p => p[1])
  return { lon: (Math.min(...xs) + Math.max(...xs)) / 2, lat: (Math.min(...ys) + Math.max(...ys)) / 2 }
}
