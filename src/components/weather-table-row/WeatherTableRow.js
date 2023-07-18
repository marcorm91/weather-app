import React from 'react'
import { WeatherTableRowStyled } from './WeatherTableRowStyled'
import Actions from '../weather-table-row-actions/WeatherTableRowActions'
import { useTranslation } from 'react-i18next'

const WeatherTableRow = ({ row, onDeleteRow  }) => {

  const { t } = useTranslation()
  const { CODAUTO, CPRO, CMUN, DC, NAME, PROV, COMUNIDAD } = row.original

  return (
    <WeatherTableRowStyled>
        <td style={{maxWidth: "180px", width: "180px"}}>
          <label className='hide-desktop'>{t('HOME.TABLE.CODE')}:</label>{CODAUTO}-{CPRO}-{CMUN}-{DC}
        </td>
        <td>
          <label className='hide-desktop'>{t('HOME.TABLE.MUNICIPALITY')}:</label>{NAME}
        </td>
        <td>
          <label className='hide-desktop'>{t('HOME.TABLE.PROVINCE')}:</label>{PROV}
        </td>
        <td>
          <label className='hide-desktop'>{t('HOME.TABLE.COMUNITY')}:</label>{COMUNIDAD}
        </td>
        <td><Actions row={row} onDeleteRow={onDeleteRow}/></td>
    </WeatherTableRowStyled>
  )
}

export default WeatherTableRow
