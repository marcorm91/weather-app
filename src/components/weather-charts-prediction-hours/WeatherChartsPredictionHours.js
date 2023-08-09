import React, { useState } from 'react'
import WeatherChart from '../weather-chart/WeatherChart'
import WeatherDetailChart from '../weather-detail-chart/WeatherDetailChart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { WeatherChartsPredictionHoursStyled } from './WeatherChartsPredictionHoursStyled'
import { getCurrentHour } from '../../utils/js/helpers'

const WeatherChartsPredictionHours = ( { chartTempData, chartWindData, chartRainData, chartSnowData } ) => {

  const [chartProps, setChartProps] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = (props) => {
    const newProps = {
      ...props,
      showXAxis: true,
      showYAxis: false,
      showLabels: true,
      dot: true,
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
    }
    setChartProps(newProps)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }
  
  const chartsData = [
    {
      colorLine: 'var(--wa-deep-blue)',
      data: chartTempData,
      aspect: 5,
      unitY: 'º',
      unitX: 'h',
      dataKey: 'Temperatura',
      legend: 'Temperatura',
      showXAxis: false,
      showYAxis: false,
      showLabels: false,
      tooltip: true,
      dot: false,
      ml: 16,
      mr: 16,
      mt: 32, 
      mb: 32
    },
    {
      colorLine: 'var(--wa-deep-blue)',
      data: chartWindData,
      unitY: ' Km/h',
      unitX: 'h',
      aspect: 5,
      dataKey: 'Viento',
      legend: 'Viento',
      showXAxis: false,
      showYAxis: false,
      showLabels: false,
      tooltip: true,
      dot: false,
      ml: 16,
      mr: 16,
      mt: 32, 
      mb: 32
    },
    {
      colorLine: 'var(--wa-deep-blue)',
      data: chartRainData,
      aspect: 5,
      unitY: ' mm.',
      unitX: 'h',
      dataKey: 'Precipitacion',
      legend: 'Precipitacion',
      showXAxis: false,
      showYAxis: false,
      showLabels: false,
      tooltip: true,
      dot: false,
      ml: 16,
      mr: 16,
      mt: 32, 
      mb: 32
    },
    {
      colorLine: 'var(--wa-deep-blue)',
      data: chartSnowData,
      aspect: 5,
      unitY: ' cm.',
      unitX: 'h',
      dataKey: 'Nieve',
      legend: 'Nieve',
      showXAxis: false,
      showYAxis: false,
      showLabels: false,
      tooltip: true,
      dot: false,
      ml: 16,
      mr: 16,
      mt: 32, 
      mb: 32
    }
  ]

  return (
    <WeatherChartsPredictionHoursStyled>
       {chartsData.map((chartData, index) => (
          <li key={index}>
            <WeatherChart {...chartData} />
            <button onClick={() => handleClick(chartData)}>
              <FontAwesomeIcon icon={faMagnifyingGlass} color='var(--wa-deep-blue)' size='lg'/>
            </button>
          </li>
        ))}
        {isModalOpen && <WeatherDetailChart chartProps={chartProps} closeModal={handleCloseModal} />}
    </WeatherChartsPredictionHoursStyled>
  )
}

export default WeatherChartsPredictionHours
