import React, { createContext, useState, useEffect } from 'react'
import {  getRecentSearchesFromLocalStorage, storeRecentSearchesToLocalStorage } from './localStorageUtils' 

const RecentSearchesContext = createContext()

export const RecentSearchesProvider = ({ children }) => {
    const [recentSearches, setRecentSearches] = useState(getRecentSearchesFromLocalStorage())

    useEffect(() => {
        storeRecentSearchesToLocalStorage(recentSearches)
    }, [recentSearches])

    return (
        <RecentSearchesContext.Provider value={{ recentSearches, setRecentSearches }}>
            {children}
        </RecentSearchesContext.Provider>
    )
}

export default RecentSearchesContext
