import moment from 'moment'
import 'moment/locale/es'

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
 * @returns Return current hour (format 01, 02, 03, 21, 22, ...)
 */
export const getCurrentHour = () => {
    const currentDate = new Date()
    return currentDate.getHours().toString().padStart(2, '0')
}
  
/**
 * Current date
 * @returns Return current date (format YYYY-MM-DDTHH:MM:SS)
 */
export const getCurrentDate = () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}T00:00:00`
    return formattedDate
}

/**
 * Convert a date string from format "YYYY-MM-DDTHH:MM:SS" to "DD-MM-YYYY"
 * @param {string} dateString The date string in "YYYY-MM-DDTHH:MM:SS" format
 * @returns {string} The reformatted date string in "DD-MM-YYYY" format.
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // +1 because months are 0-indexed
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
}

/**
 * Transforms a date string from 'DD-MM-YYYY' format into a localized format.
 * @param {string} dateStr - The date string in 'DD-MM-YYYY' format.
 * @param {string} language - The current language (e.g., 'en', 'es').
 * @returns {string} - The localized date string.
 */
export const transformDate = (dateStr, language) => {
    const formats = {
        'es': 'DD [de] MMMM [de] YYYY',
        'en': 'MMMM DD, YYYY'
    }
    const format = formats[language] || formats['es']
    moment.locale(language) 
    return moment(dateStr, 'DD-MM-YYYY').format(format)
}

/**
 * Get the name of the day of the week for a given date string.
 * @param {string} dateString - A date in the format "YYYY-MM-DDTHH:mm:ss".
 * @returns {string} - The name of the day of the week.
 */
export const getDayOfWeek = (dateString) => {
    return moment(dateString).format('dddd');
}

/**
 * Get the current timezone offset in the format +HH:MM or -HH:MM
 * @returns {string} - The timezone offset.
 */
export const getTimezoneOffset = () => {
    const offsetInMinutes = new Date().getTimezoneOffset();
    const hours = Math.abs(Math.floor(offsetInMinutes / 60)).toString().padStart(2, '0');
    const minutes = (Math.abs(offsetInMinutes) % 60).toString().padStart(2, '0');
    const sign = offsetInMinutes < 0 ? '+' : '-';
    return `${sign}${hours}:${minutes}`;
}
