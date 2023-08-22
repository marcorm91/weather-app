import React, { useEffect, useState, useCallback } from 'react'
import { WeatherTableStyled } from './WeatherTableStyled'
import WeatherTableRow from '../weather-table-row/WeatherTableRow'
import TablePaginator from '../weather-table-row-paginator/WeatherTableRowPaginator'
import codeTownsData from '../../resources/services/code_towns.json'
import { useTable, useGlobalFilter, usePagination } from 'react-table'
import { useTranslation } from 'react-i18next'

const WeatherTable = ({ showFavoritesOnly, arrayFavorites }) => {
  const { t } = useTranslation()
  const [favorites, setFavorites] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isTableVisible, setIsTableVisible] = useState(true)
  const [selectedCommunity, setSelectedCommunity] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')
  const uniqueCommunities = [...new Set(codeTownsData.map(item => item.COMUNIDAD))].sort()
  const uniqueProvinces = selectedCommunity 
      ? [...new Set(codeTownsData.filter(item => item.COMUNIDAD === selectedCommunity).map(item => item.PROV))].sort() 
      : []

  // Get local storage favorites.
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || []
    setFavorites(storedFavorites)
  }, [])

  // Callback function to update filtered data based on favs and showFavoritesOnly flag
  const updateFilteredData = useCallback(() => {
    let tempData = codeTownsData

    if (selectedCommunity) {
      tempData = tempData.filter(row => row.COMUNIDAD === selectedCommunity)
    }
    if (selectedProvince) {
      tempData = tempData.filter(row => row.PROV === selectedProvince)
    }
    if (showFavoritesOnly) {
      const favoriteSet = new Set(favorites)
      tempData = tempData.filter((row) => {
        const favoriteId = `${row.CODAUTO}-${row.CPRO}-${row.CMUN}-${row.DC}`
        return favoriteSet.has(favoriteId)
      })
    }

    setFilteredData(tempData)
  }, [favorites, showFavoritesOnly, selectedCommunity, selectedProvince])

  // Update favorites state when arrayFavorites changes
  useEffect(() => {
    if (arrayFavorites) {
      setFavorites(arrayFavorites)
    }
    updateFilteredData()
  }, [arrayFavorites, updateFilteredData])

  // Update filter community and province selected
  useEffect(() => {
    updateFilteredData()
  }, [selectedCommunity, selectedProvince, updateFilteredData])

  // Remove items 1 by 1 from tab2 (favs table). If there is 1 item the table will be removed.
  const handleDeleteRow = (rowId) => {
    if (showFavoritesOnly) {
      if(filteredData.length === 1) {
        setIsTableVisible(false)
      }else{
        setFilteredData((prevData) =>
          prevData.filter((row) => {
            const currentRowId = `${row.CODAUTO}-${row.CPRO}-${row.CMUN}-${row.DC}`
            return currentRowId !== rowId
          })
        )
      } 
    }
  }

  // Delete all stored favorites.  If it's in tab2 (favs table), the table will be removed. 
  const handleDeleteFavorites = () => {
    localStorage.removeItem('favorites')
    setFavorites([])
    if(showFavoritesOnly) setIsTableVisible(false)
  }

  const columns = [
    { Header: 'COM-PROV-MUN-DC', accessor: 'CODE' },
    { Header: t('HOME.TABLE.MUNICIPALITY').toUpperCase(), accessor: 'NAME' },
    { Header: t('HOME.TABLE.PROVINCE').toUpperCase(), accessor: 'PROV' },
    { Header: t('HOME.TABLE.COMUNITY').toUpperCase(), accessor: 'COMUNIDAD' },
    { Header: '', accessor: 'ACTIONS' },
  ]

  const Table = () => {
    const tableInstance = useTable(
      {
        columns,
        data: filteredData,
        initialState: { pageIndex: 0, pageSize: 20 },
      },
      useGlobalFilter,
      usePagination
    )

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      state,
      setGlobalFilter,
    } = tableInstance

    return (
      <>
        <div className="table-top__wrapper">
          <div>
            <span>{t('HOME.TABLE.FILTERBY')}</span>
            <select
              value={selectedCommunity}
              onChange={(e) => {
                setSelectedCommunity(e.target.value)
                setSelectedProvince('') }}>
                <option value="">{t('HOME.TABLE.SELECT_COMMUNITY')}</option>
                {uniqueCommunities.map(community => <option key={community} value={community}>{community}</option>)}
            </select>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)} >
                <option value="">{t('HOME.TABLE.SELECT_PROVINCE')}</option>
                {uniqueProvinces.map(province => <option key={province} value={province}>{province}</option>)}
            </select>
            <input
              type="text"
              value={state.globalFilter || ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={t('HOME.TABLE.SEARCH')}
            />
          </div>
          <div>
            <button
              onClick={handleDeleteFavorites}
              className="btn btn-small btn-primary"
            >
              {t('HOME.TABLE.REMOVE_FAV')}
            </button>
          </div>
        </div>
        <div className="table__wrapper">
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.length === 0 && (
                <tr>
                  <td colSpan={columns.length}>
                    <span className='no-results-text'>{t('HOME.TABLE.NO_RESULTS')}</span>
                  </td>
                </tr>
              )}
              {page.map((row) => {
                prepareRow(row)
                const favoriteId = `${row.original.CODAUTO}-${row.original.CPRO}-${row.original.CMUN}-${row.original.DC}`
                const isFavorite = favorites.includes(favoriteId)
                return (
                  <WeatherTableRow
                    key={row.id}
                    row={row}
                    onDeleteRow={handleDeleteRow}
                    isFavorite={isFavorite}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
        {page.length > 0 && (
          <TablePaginator tableInstance={tableInstance} />
        )}
      </>
    )
  }

  return (
    <WeatherTableStyled>
      {isTableVisible ? (
        <Table />
      ) : (
        <span>{t('HOME.TABLE.EMPTY_FAV')}</span>
      )}
    </WeatherTableStyled>
  )
}

export default WeatherTable
