// Base URL for the Nominatim service
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org"

/**
 * Fetch location information based on latitude and longitude
 * @param {*} latitude 
 * @param {*} longitude 
 * @returns Return municipality data
 */
export const getNameFromCoordinates = async (latitude, longitude) => {
    const url = `${NOMINATIM_BASE_URL}/reverse?lat=${latitude}&lon=${longitude}&format=json&language=en`
    try {
        const response = await fetch(url)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching location information:', error)
        throw error
    }
}


/**
 * Get coordinates based on a municipality name
 * @param {string} municipalityName 
 * @param {string} provinceName 
 * @returns Return coordinates
 */
export const getCoordinatesFromName = async (municipalityName, provinceName) => {
    const encodedMunicipality = encodeURIComponent(municipalityName.replace(/,/g, ' '))
    const encodedProvince = encodeURIComponent(provinceName)
    const url = `${NOMINATIM_BASE_URL}/search?city=${encodedMunicipality}&county=${encodedProvince}&countrycodes=ES&format=json&limit=1`
    try {
        const response = await fetch(url)
        const data = await response.json()
        if (data && data.length > 0) {
            return [data[0].lat, data[0].lon]
        } else {
            throw new Error('No data returned from Nominatim')
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error)
        throw error
    }
}

/**
 * Return coordinates by municipality (inverse nominatim)
 * @param {*} location 
 * @returns Municipality
 */
export const getCoordinatesByLocation = async (location) => {
    const query = encodeURIComponent(location)
    const url = `${NOMINATIM_BASE_URL}/search?q=${query}&format=json`
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('Failed to fetch coordinates from Nominatim.')
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching coordinates:', error)
        throw error
    }
}

/**
 * Fetches the details of a municipality based on its province (CPRO) and municipality (CMUN) codes.
 * @param {string} CPRO - The province code. 
 * @param {string} CMUN - The municipality code.
 * @returns Returns the municipality details as an object if found.
 */
export const getMunicipalityByCPROCMUN = async (CPRO, CMUN) => {
    let pageNumber = 0
    const pageSize = 500 
    let municipalityFound = null
    const codigoINE = CPRO + CMUN
    while (!municipalityFound) {
        const url = `https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/Municipios/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson&resultOffset=${pageNumber * pageSize}&resultRecordCount=${pageSize}`
        const response = await fetch(url)
        const data = await response.json()
        const municipality = data.features.find(feature => feature.properties.CODIGOINE === codigoINE)
        if (municipality) {
            municipalityFound = municipality
        } else {
            pageNumber++
            if (data.features.length < pageSize) {
                break
            }
        }
    }
    return municipalityFound
  }