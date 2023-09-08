const BASE_URL = "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/provincias-espanolas/records?limit=60"

/**
 * Fetches geographical data for a given Spanish province from the OpenDataSoft API.
 * @param {string} provinceName - The name of the Spanish province to retrieve data for.
 * @returns {Object} - An object containing details about the specified province, or undefined if not found.
 * @throws {Error} - Throws an error if the API call fails.
 */
export const fetchProvinceGeoData = async (provinceName) => {
    try {
      const response = await fetch(BASE_URL)
      const data = await response.json()
      return data.results.find(prov => prov.provincia === provinceName)
    } catch (error) {
      console.error("Error fetching province data:", error)
      throw error
    }
}
