export const timezoneFor = code => /^(35|38)/.test(String(code)) ? 'Atlantic/Canary' : 'Europe/Madrid'
export const localClock = (code, now = new Date()) => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: timezoneFor(code), year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23',
  }).formatToParts(now).map(({ type, value }) => [type, value]))
  return { date: `${parts.year}-${parts.month}-${parts.day}`, hour: parts.hour }
}
export const numberOrNull = value => {
  const scalar = Array.isArray(value) ? value[0] : value
  return scalar === '' || scalar == null || !Number.isFinite(Number(scalar)) ? null : Number(scalar)
}
const first = value => Array.isArray(value) ? value[0] : value
const byHour = (items, hour, property = 'value') => first(items?.find(item => String(item.periodo).padStart(2, '0') === hour && item[property] != null)?.[property]) ?? null
const buildHourlyRows = product => (product?.prediccion?.dia || []).flatMap(day => {
  const periods = [...new Set(['temperatura', 'estadoCielo', 'humedadRelativa', 'precipitacion', 'vientoAndRachaMax'].flatMap(key =>
    (day[key] || []).map(item => String(item.periodo).padStart(2, '0')).filter(period => /^(0\d|1\d|2[0-4])$/.test(period))))].sort()
  return periods.map(hour => {
    const date = hour === '24' ? new Date(Date.parse(day.fecha.slice(0, 10) + 'T00:00:00Z') + 86400000).toISOString().slice(0, 10) : day.fecha.slice(0, 10)
    const normalizedHour = hour === '24' ? '00' : hour
    return ({
    key: `${date}T${normalizedHour}`, date, hour: normalizedHour,
    temperature: numberOrNull(byHour(day.temperatura, hour)),
    feelsLike: numberOrNull(byHour(day.sensTermica, hour)),
    humidity: numberOrNull(byHour(day.humedadRelativa, hour)),
    rain: byHour(day.precipitacion, hour), snow: byHour(day.nieve, hour),
    wind: numberOrNull(byHour(day.vientoAndRachaMax, hour, 'velocidad')),
    gust: numberOrNull(byHour(day.vientoAndRachaMax, hour)),
    direction: byHour(day.vientoAndRachaMax, hour, 'direccion'),
    sky: byHour(day.estadoCielo, hour), description: byHour(day.estadoCielo, hour, 'descripcion'),
    sunrise: day.orto, sunset: day.ocaso,
  })})
}).sort((a, b) => a.key.localeCompare(b.key))

// Midnight may be supplied as both 24 on the previous day and 00 on the next.
export const hourlyRows = product => [...new Map(buildHourlyRows(product).map(row => [row.key, row])).values()]

export const forecastModel = (hourly, daily, code, now = new Date()) => {
  const clock = localClock(code, now)
  const rows = hourlyRows(hourly).filter(row => row.key >= `${clock.date}T${clock.hour}`)
  const days = (daily?.prediccion?.dia || []).filter(day => day.fecha.slice(0, 10) >= clock.date)
  return { rows, days, current: rows[0] || null, today: days.find(day => day.fecha.slice(0, 10) === clock.date), clock }
}
export const displayValue = (value, unit = '') => value == null || value === '' ? '—' : `${value}${unit}`
// Daily probabilities retain their original UTC interval; never average overlapping periods.
export const dailyPeriods = day => (day.probPrecipitacion || []).filter(item => numberOrNull(item.value) !== null)
