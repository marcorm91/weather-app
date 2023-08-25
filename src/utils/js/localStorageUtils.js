/****** LANGUAGE APP */

const languageKey = 'language'

/**
 * Get the saved language from local storage. If none exists, default to 'es'.
 * 
 * @returns {string} The saved or default language code.
 */
export const getSavedLanguage = () => {
    return localStorage.getItem(languageKey) || 'es'
}

/**
 * Store the selected language to local storage.
 * 
 * @param {string} selectedLanguage - The language code to be stored.
 */
export const storeSelectedLanguage = (selectedLanguage) => {
    localStorage.setItem(languageKey, selectedLanguage)
}

/****** RECENT SEARCHES */

const recentSearchesKey = 'recentSearches';

/**
 * Get the recent searches from local storage.
 * 
 * @returns {Array} The saved recent searches or an empty array.
 */
export const getRecentSearchesFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem(recentSearchesKey)) || [];
}

/**
 * Store the current state of recent searches to local storage.
 * 
 * @param {Array} searches - The list of recent searches.
 */
export const storeRecentSearchesToLocalStorage = (searches) => {
    localStorage.setItem(recentSearchesKey, JSON.stringify(searches));
}

export const storeSearchItem = (item) => {
    let searches = getRecentSearchesFromLocalStorage();
    const existingItem = searches.find(search => search.nombre === item.nombre);

    if (existingItem) {
        searches = searches.filter(search => search.nombre !== item.nombre);
    }

    searches.unshift(item);

    if (searches.length > 5) {
        searches.pop();
    }

    storeRecentSearchesToLocalStorage(searches);
    return searches;
}

/****** FAVORITES */

const favoritesKey = 'favorites'

/**
 * Get all saved favorites from local storage.
 * 
 * @returns {Array} The saved favorites or an empty array.
 */
export const getFavorites = () => {
    return JSON.parse(localStorage.getItem(favoritesKey)) || []
}

/**
 * Add a favorite to local storage.
 * 
 * @param {string} favorite The favorite item to add.
 */
export const addFavorite = (favorite) => {
    const favorites = getFavorites()
    favorites.push(favorite)
    localStorage.setItem(favoritesKey, JSON.stringify(favorites))
}

/**
 * Remove a specific favorite from local storage.
 * 
 * @param {string} favoriteToRemove The favorite item to remove.
 */
export const removeFavorite = (favoriteToRemove) => {
    const favorites = getFavorites()
    const updatedFavorites = favorites.filter(fav => fav !== favoriteToRemove)
    localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites))
}

/**
 * Remove all favorites from local storage.
 */
export const removeAllFavorites = () => {
    localStorage.removeItem(favoritesKey)
}
