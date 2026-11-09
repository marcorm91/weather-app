import towns from '../../resources/services/code_towns.json'
export const townByCode = new Map(towns.map(town => [`${town.CPRO}${town.CMUN}`, town]))
export const communities = [...new Map(towns.map(town => [town.CODAUTO, { code: town.CODAUTO, name: town.COMUNIDAD }])).values()].sort((a, b) => a.name.localeCompare(b.name, 'es'))
export const provinces = [...new Map(towns.map(town => [town.CPRO, { code: town.CPRO, name: town.PROV, community: town.CODAUTO }])).values()].sort((a, b) => a.name.localeCompare(b.name, 'es'))
// Forecasts represent the named city, never a regional average.
const capitalRows = [
['01059',42.85,-2.67],['02003',38.99,-1.86],['03014',38.35,-.48],['04013',36.84,-2.46],['05019',40.66,-4.70],['06015',38.88,-6.97],['07040',39.57,2.65],['08019',41.39,2.17],['09059',42.34,-3.70],['10037',39.48,-6.37],['11012',36.53,-6.29],['12040',39.99,-.05],['13034',38.98,-3.93],['14021',37.89,-4.78],['15030',43.36,-8.41],['16078',40.07,-2.14],['17079',41.98,2.82],['18087',37.18,-3.60],['19130',40.63,-3.16],['20069',43.32,-1.98],['21041',37.26,-6.95],['22125',42.14,-.41],['23050',37.77,-3.79],['24089',42.60,-5.57],['25120',41.62,.62],['26089',42.47,-2.45],['27028',43.01,-7.56],['28079',40.42,-3.70],['29067',36.72,-4.42],['30030',37.98,-1.13],['31201',42.82,-1.64],['32054',42.34,-7.86],['33044',43.36,-5.85],['34120',42.01,-4.53],['35016',28.12,-15.44],['36038',42.43,-8.64],['37274',40.97,-5.66],['38038',28.46,-16.25],['39075',43.46,-3.81],['40194',40.95,-4.12],['41091',37.39,-5.98],['42173',41.76,-2.47],['43148',41.12,1.24],['44216',40.34,-1.11],['45168',39.86,-4.03],['46250',39.47,-.38],['47186',41.65,-4.72],['48020',43.26,-2.93],['49275',41.50,-5.74],['50297',41.65,-.89],['51001',35.89,-5.32],['52001',35.29,-2.94],
]
export const referenceCities = capitalRows.map(([code, lat, lon]) => ({ code, lat, lon, town: townByCode.get(code) })).filter(city => city.town)
const overviewCodes = new Set(['41091','50297','33044','07040','35016','38038','39075','47186','45168','08019','46250','06015','15030','28079','30030','31201','01059','26089','51001','52001'])
export const overviewCities = referenceCities.filter(city => overviewCodes.has(city.code))
export const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim()
export function resolveScope(params) {
  const town = townByCode.get(params.get('municipio'))
  const province = provinces.find(item => item.code === (town?.CPRO || params.get('provincia')))
  const community = communities.find(item => item.code === (province?.community || params.get('comunidad')))
  return { town, province, community, level: town ? 'town' : province ? 'province' : community ? 'community' : 'country' }
}
export function scopeParams(item, type) {
  if (type === 'country') return {}
  if (type === 'town') return { comunidad: item.CODAUTO, provincia: item.CPRO, municipio: `${item.CPRO}${item.CMUN}` }
  if (type === 'province') return { comunidad: item.community, provincia: item.code }
  return { comunidad: item.code }
}
export const townsInProvince = code => towns.filter(town => town.CPRO === code)
export function searchTowns(query) {
  const needle = normalize(query)
  if (needle.length < 2) return []
  return towns.filter(town => normalize(`${town.NAME} ${town.PROV}`).includes(needle)).sort((a, b) => {
    const rank = town => normalize(town.NAME) === needle ? 0 : normalize(town.NAME).startsWith(needle) ? 1 : 2
    return rank(a) - rank(b) || a.NAME.localeCompare(b.NAME, 'es')
  }).slice(0, 8)
}
