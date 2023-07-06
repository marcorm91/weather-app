import React, { useEffect, useState } from 'react'
import { WeatherTableStyled } from './WeatherTableStyled'
import WeatherTableRow from '../weather-table-row/WeatherTableRow'
import TablePaginator from '../weather-table-row-paginator/WeatherTableRowPaginator'
import codeTownsData from '../../resources/services/code_towns.json'
import { useTable, useGlobalFilter, usePagination } from 'react-table'
import { useTranslation } from 'react-i18next'

const WeatherTable = ({ showFavoritesOnly }) => {

  const { t } = useTranslation()

  const [data, setData] = useState(showFavoritesOnly ? [] : codeTownsData)

  useEffect(() => {
    // Update data when showFavoritesOnly changes
    if (showFavoritesOnly) {
      const favorites = JSON.parse(localStorage.getItem('favorites')) || []
      // Filter codeTownsData based on favorites
      setData(
        codeTownsData.filter((row) => {
          const favoriteId = `${row.CODAUTO}-${row.CPRO}-${row.CMUN}-${row.DC}`
          return Array.isArray(favorites) && favorites.includes(favoriteId)
        }))
    } else {
      setData(codeTownsData)
    }
  }, [showFavoritesOnly])

  // Remove from list table the row if this is check as fav
  const handleDeleteRow = (rowId) => {
    setData((prevData) =>
      prevData.filter((row) => {
        const currentRowId = `${row.CODAUTO}-${row.CPRO}-${row.CMUN}-${row.DC}`;
        return currentRowId !== rowId;
      })
    );
  };

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
        data,
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
        <input
          type="text"
          value={state.globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder={t('HOME.TABLE.SEARCH')}
        />
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
                return <WeatherTableRow key={row.id} row={row} handleDeleteRow={handleDeleteRow}/>
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
