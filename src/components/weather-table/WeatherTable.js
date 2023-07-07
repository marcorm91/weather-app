import React, { useEffect, useState } from 'react'
import { WeatherTableStyled } from './WeatherTableStyled'
import WeatherTableRow from '../weather-table-row/WeatherTableRow'
import TablePaginator from '../weather-table-row-paginator/WeatherTableRowPaginator'
import codeTownsData from '../../resources/services/code_towns.json'
import { useTable, useGlobalFilter, usePagination } from 'react-table'
import { useTranslation } from 'react-i18next'

const WeatherTable = ({ showFavoritesOnly }) => {

  const { t } = useTranslation()
  const [favorites, setFavorites] = useState([])
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || []
    setFavorites(storedFavorites)
  }, [])

  useEffect(() => {
    if (showFavoritesOnly) {
      const filteredData = codeTownsData.filter((row) => {
        const favoriteId = `${row.CODAUTO}-${row.CPRO}-${row.CMUN}-${row.DC}`
        return favorites.includes(favoriteId)
      })
      setFilteredData(filteredData)
    } else {
      setFilteredData(codeTownsData)
    }
  }, [showFavoritesOnly, favorites])

  const handleDeleteRow = (rowId) => {
    if (showFavoritesOnly) {
      setFilteredData((prevData) =>
        prevData.filter((row) => {
          const currentRowId = `${row.CODAUTO}-${row.CPRO}-${row.CMUN}-${row.DC}`
          return currentRowId !== rowId
        })
      )
    }
  }

  const handleToggleFavorite = (rowId) => {
    const isFavorite = favorites.includes(rowId)
    let updatedFavorites = [...favorites]

    if (isFavorite) {
      updatedFavorites = updatedFavorites.filter(
        (favorite) => favorite !== rowId
      )
    } else {
      updatedFavorites.push(rowId)
    }

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    setFavorites(updatedFavorites)
  }

  const handleDeleteFavorites = () => {
    localStorage.removeItem('favorites')
    setFavorites([])
    setFilteredData(showFavoritesOnly ? [] : codeTownsData)
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

    if (favorites.length === 0 && showFavoritesOnly) {
      return <span>{t('HOME.TABLE.EMPTY_FAV')}</span>
    }

    return (
      <>
        <div className="table-top__wrapper">
          <button
            onClick={handleDeleteFavorites}
            className="btn btn-small btn-primary"
          >
            {t('HOME.TABLE.REMOVE_FAV')}
          </button>
          <input
            type="text"
            value={state.globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={t('HOME.TABLE.SEARCH')}
          />
        </div>
        <div className="table__wrapper">
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row)
                const favoriteId = `${row.original.CODAUTO}-${row.original.CPRO}-${row.original.CMUN}-${row.original.DC}`
                const isFavorite = favorites.includes(favoriteId)
                return (
                  <WeatherTableRow
                    key={row.id}
                    row={row}
                    onDeleteRow={handleDeleteRow}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={isFavorite}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
        <TablePaginator tableInstance={tableInstance} />
      </>
    )
  }

  return (
    <WeatherTableStyled>
      <Table />
    </WeatherTableStyled>
  )
}

export default WeatherTable
