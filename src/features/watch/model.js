import { townByCode, normalize } from '../weather-map/catalogue'
export function visibleWarnings(snapshot, now, period) {
  if (!snapshot || snapshot.status === 'unavailable') return []
  return (snapshot.warnings || []).filter(item => item.end > now && (period === 'active' ? item.start <= now : period === 'future' ? item.start > now : true))
}
export function associatedTowns(warnings, query = '', province = '') {
  const rows = new Map()
  for (const warning of warnings) for (const code of warning.municipalityCodes) {
    const town = townByCode.get(code)
    if (!town || (province && String(town.CPRO) !== province)) continue
    if (query && !normalize(`${town.NAME} ${town.PROV} ${warning.area}`).includes(normalize(query))) continue
    const row = rows.get(code) || { code, town, warnings: [], level: 0 }
    row.warnings.push(warning); row.level = Math.max(row.level, warning.level); rows.set(code, row)
  }
  return [...rows.values()].sort((a, b) => b.level - a.level || a.town.NAME.localeCompare(b.town.NAME, 'es'))
}
