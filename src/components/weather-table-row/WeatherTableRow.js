import React from 'react'
import { WeatherTableRowStyled } from './WeatherTableRowStyled'
import Actions from '../weather-table-row-actions/WeatherTableRowActions'

const WeatherTableRow = ({ row }) => {
  const { CODAUTO, CPRO, CMUN, DC, NAME, PROV, COMUNIDAD } = row.original

  return (
    <WeatherTableRowStyled>
        <td style={{maxWidth: "180px", width: "180px"}}>{CODAUTO}-{CPRO}-{CMUN}-{DC}</td>
        <td>{NAME}</td>
        <td>{PROV}</td>
        <td>{COMUNIDAD}</td>
        <td><Actions row={row} /></td>
    </WeatherTableRowStyled>
  )
}

export default WeatherTableRow
