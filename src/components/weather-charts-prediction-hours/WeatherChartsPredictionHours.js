import React, { useState } from 'react'
import WeatherChart from '../weather-chart/WeatherChart'
import WeatherDetailChart from '../weather-detail-chart/WeatherDetailChart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons'
import { WeatherChartsPredictionHoursStyled } from './WeatherChartsPredictionHoursStyled'
import { getCurrentHour } from '../../utils/js/helpers'

const WeatherChartsPredictionHours = ( { chartTempData, chartWindData, chartRainData, chartSnowData } ) => {

  const [chartProps, setChartProps] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
        let currentHour = Number(getCurrentHour())
        let resultHour = (currentHour + i) % 24
        let formattedHour = resultHour.toString().padStart(2, '0') 
        return {
          ...item,
          x_value: formattedHour,
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
  
  // Define props charts
  const chartsData = [
    {
      data: chartTempData,
      aspect: 5,
      unitY: 'º',
      unitX: 'h',
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
          dataKey: 'Temperatura',
          colorLine: 'var(--wa-deep-blue)',
          legend: 'Temperatura',
          dot: false,
        },
      ]
    },
    {
      data: chartWindData,
      unitY: ' Km/h',
      unitX: 'h',
      aspect: 5,
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
          dataKey: 'Viento',
          colorLine: 'var(--wa-deep-blue)',
          legend: 'Viento',
          dot: false
        },
      ]
    },
    {
      data: chartRainData,
      aspect: 5,
      unitY: ' mm.',
      unitX: 'h',
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
          dataKey: 'Precipitacion',
          colorLine: 'var(--wa-deep-blue)',
          legend: 'Precipitación',
          dot: false,
        },
      ]
    },
    {
      data: chartSnowData,
      aspect: 5,
      unitY: ' cm.',
      unitX: 'h',
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
          dataKey: 'Nieve',
          colorLine: 'var(--wa-deep-blue)',
          legend: 'Nieve',
          dot: false,
        },
      ]
    }
  ]

  return (
    <WeatherChartsPredictionHoursStyled>
       {chartsData.map((chartData, index) => (
          <li key={index}>
            <WeatherChart {...chartData} />
            <button onClick={() => handleClick(chartData)}>
              <FontAwesomeIcon icon={faMagnifyingGlassPlus} color='var(--wa-deep-blue)' size='lg'/>
            </button>
          </li>
        ))}
        {isModalOpen && <WeatherDetailChart chartProps={chartProps} closeModal={handleCloseModal} />}
    </WeatherChartsPredictionHoursStyled>
  )
}

export default WeatherChartsPredictionHours
