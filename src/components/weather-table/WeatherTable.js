import { WeatherTableStyled } from './WeatherTableStyled'
import WeatherTableRow from '../weather-table-row/WeatherTableRow'
import TablePaginator from '../weather-table-row-paginator/WeatherTableRowPaginator'
import codeTownsData from '../../resources/services/code_towns.json'
import { useTable, useGlobalFilter, usePagination } from 'react-table'
import { useTranslation } from 'react-i18next'

const WeatherTable = () => {
  const { t } = useTranslation()

  const data = codeTownsData

  const columns = [
    { Header: 'CODAUTO', accessor: 'CODAUTO' },
    { Header: 'CPRO', accessor: 'CPRO' },
    { Header: 'CMUN', accessor: 'CMUN' },
    { Header: 'DC', accessor: 'DC' },
    { Header: t("HOME.TABLE.NAME").toUpperCase(), accessor: 'NAME' },
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
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row)
                return (
                  <WeatherTableRow key={row.id} row={row} />
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
