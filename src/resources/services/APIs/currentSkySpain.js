export const fetchCurrentSkySpain = async (type, location, period, dateTime) => {
    let dayIncrement = 0
    const maxAttempts = 10
    let data

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const url = `https://www.aemet.es/es/api-eltiempo/variables/${type}/${location}/${period}/${dateTime}/01/D+${dayIncrement}`
        const response = await fetch(url)
        if (response.status === 200) {
            data = await response.json()
            break
        } else if (response.status === 404) {
            dayIncrement++
        } else {
            throw new Error(`Received unexpected status code: ${response.status}`)
        }
    }

    if (!data) {
        throw new Error('Unable to fetch data after multiple attempts')
    }

    return data
}
