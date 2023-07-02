/**
 * Finds the value of a given property for a specific period in a list of items
 * @param {Array} list - The list of items to search in
 * @param {string} currentHour - The current hour or period to match against
 * @param {string} property - The property to retrieve the value from
 * @returns {*} - The value of the property if found, or null if not found
 */
export const findPropertyValueByPeriod = (list, currentHour, properties) => {
    const foundItem = list.find(item => item.periodo === currentHour)
    if (foundItem) {
        for (let property of properties) {
        if (property in foundItem) {
            return foundItem
        }
        }
    }
    return null
}

/**
 * Current hour
 * @returns Get current hour (format 01, 02, 03, 21, 22, ...)
 */
export const getCurrentHour = () => {
    const currentDate = new Date();
    return currentDate.getHours().toString().padStart(2, '0');
}
  
  
  