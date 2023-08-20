import React, { useState } from 'react'
import WeatherChart from '../weather-chart/WeatherChart'
import WeatherDetailChart from '../weather-detail-chart/WeatherDetailChart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons'
import { WeatherChartsPredictionDaysStyled } from './WeatherChartsPredictionDaysStyled'
import { formatDate } from '../../utils/js/helpers'

const WeatherChartsPredictionDays = ( { chartTempData } ) => {
  
  const [chartProps, setChartProps] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const formattedChartData = chartTempData.map(item => ({
    ...item,
    x_value: formatDate(item.day),
    temperature: item.temperature 
  }))
  
  // Modify properties when clicking the chart for a medium fullscreen view.
  const handleClick = (props) => {
    const newProps = {
      ...props,
      showXAxis: true,
      showYAxis: false,
      showLabels: true,
      tooltip: false,
      ml: 32,
      mr: 32,
      mt: 32, 
      mb: 32,
      data: props.data.map((item, i) => {
        return {
          ...item,
          x_value: formattedChartData[i].x_value,
        }
      }),
      lines: props.lines.map(line => ({
        ...line,
        dot: true 
      }))
    }
    setChartProps(newProps)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }
  
  // Define props chart
  const chartsData = [
    {
      data: formattedChartData,
      aspect: 5,
      unitY: 'º',
      unitX: '',
      showXAxis: false,
      showYAxis: false,
      showLabels: false,
      tooltip: true,
      ml: 16,
      mr: 16,
      mt: 32, 
      mb: 32,
      lines: [
        {
          dataKey: 'maxTemperature',
          colorLine: 'var(--wa-red)',
          legend: 'Temperatura máxima',
          dot: false,
        },
        {
          dataKey: 'minTemperature',
          colorLine: 'var(--wa-cold-blue)',
          legend: 'Temperatura mínima',
          dot: false,
        }
      ]
    },
  ]

  return (
    <WeatherChartsPredictionDaysStyled>
       {chartsData.map((chartData, index) => (
          <li key={index}>
            <WeatherChart {...chartData} />
            <button onClick={() => handleClick(chartData)}>
              <FontAwesomeIcon icon={faMagnifyingGlassPlus} color='var(--wa-deep-blue)' size='lg'/>
            </button>
          </li>
        ))}
        {isModalOpen && <WeatherDetailChart chartProps={chartProps} closeModal={handleCloseModal} />}
    </WeatherChartsPredictionDaysStyled>
  )
}

export default WeatherChartsPredictionDays
