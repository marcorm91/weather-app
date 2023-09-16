export const fetchCurrentSkySpain = async (period, dateTime) => {
    const url = `https://www.aemet.es/es/api-eltiempo/variables/eCielo/PB/${period}/${dateTime}/01/D+0`;
    const response = await fetch(url)
    const data = await response.json()
    return data
}