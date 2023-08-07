import React from 'react'
import { WeatherChartStyled } from './WeatherChartStyled'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { getCurrentHour } from '../../utils/js/helpers'

const WeatherChart = ({
  data,
  dataKey,
  aspect,
  legend,
  unitX,
  unitY,
  colorLine,
  dot,
  tooltip,
  className,
  showXAxis = true,
  showYAxis = true,
  labelFormatter = (value) => value, 
  type = 'monotone',
  showLabels,
}) => {

  const dataAsNumbers = data.map(item => ({
    ...item,
    [dataKey]: Number(item[dataKey]),
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      if (unitX === 'h' && typeof label === 'number') {
        let labelHour = Number(label)
        let currentHour = Number(getCurrentHour())
        let resultHour = (currentHour + labelHour) % 24
        let resultHourString = resultHour.toString().padStart(2, '0') 
        return (
          <div className="wa-custom-tooltip__wrapper">
            <span className="unitx-data">{`${resultHourString}${unitX}`}</span>
            <span className="unity-data"><b>{`${dataKey}`}:</b> {`${payload[0].value}${unitY}`}</span>
          </div>
        )
      } else {
        return (
          <div className="wa-custom-tooltip__wrapper">
            <span className="unitx-data">{`${label}${unitX}`}</span>
            <span className="unity-data"><b>{`${dataKey}`}:</b> {`${payload[0].value}${unitY}`}</span>
          </div>
        )
      }
    }
    return null
  }
  
  const CustomizedLabel = (props) => {
    const { x, y, stroke, value } = props
    return (
      <text
        x={x}
        y={y}
        dy={-8}
        fill={stroke}
        fontSize={'var(--wa-font-size-2xs)'}
        textAnchor="middle"
      >
        {value}{unitY}
      </text>
    )
  }

  return (
    <WeatherChartStyled className={className}>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <LineChart data={dataAsNumbers} margin={{ top: 32, left: 16, right: 16, bottom: 32 }}>
          {showXAxis && (
            <XAxis
              unit={unitX}
              dataKey="name"
              stroke="var(--wa-black)"
            />
          )}
          {showYAxis && (
            <YAxis
              unit={unitY}
              stroke="var(--wa-black)"
            />
          )}
          {tooltip && ( <Tooltip content={<CustomTooltip />} /> )}
          {legend && ( <Legend formatter={labelFormatter} align='left' verticalAlign='top' /> )}
          <Line
            label={showLabels ? <CustomizedLabel /> : undefined}
            type={type}
            dataKey={dataKey}
            stroke={colorLine}
            dot={dot}
            legendType='plainline'
            overflow={'visible'}
          />
        </LineChart>
      </ResponsiveContainer>
    </WeatherChartStyled>
  )
}

export default WeatherChart
