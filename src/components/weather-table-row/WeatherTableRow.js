import React from 'react'
import { WeatherTableRowStyled } from './WeatherTableRowStyled'
import Actions from '../weather-table-row-actions/WeatherTableRowActions'

const WeatherTableRow = ({ row }) => {
  const { CODAUTO, CPRO, CMUN, DC, NAME } = row.original;

  return (
    <WeatherTableRowStyled>
        <td>{CODAUTO}</td>
        <td>{CPRO}</td>
        <td>{CMUN}</td>
        <td>{DC}</td>
        <td>{NAME}</td>
        <td><Actions row={row} /></td>
    </WeatherTableRowStyled>
  );
};

export default WeatherTableRow;
