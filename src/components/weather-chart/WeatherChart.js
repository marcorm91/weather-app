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
  aspect,
  unitX,
  unitY,
  tooltip,
  className,
  lines = [],
  showXAxis = true,
  showYAxis = true,
  showLabels,
  mt, ml, mr, mb
}) => {

  // Retrieve data to convert into numbers and process in subsequent functions
  const dataAsNumbers = data.map(item => {
    let transformedItem = { ...item }
    lines.forEach(line => {
      transformedItem[line.dataKey] = Number(item[line.dataKey])
    })
    return transformedItem
  })
  
  // This function calculates the X unit if it's based on hourly data. 
  // If it is an hour, it converts it to HH format and returns the subsequent hour.
  const calculateXValue = (unitX, label, payload) => {
    if (unitX === 'h' && typeof label === 'number') {
        let labelHour = Number(label)
        let currentHour = Number(getCurrentHour())
        let resultHour = (currentHour + labelHour) % 24
        return resultHour.toString().padStart(2, '0') + unitX
    }
    return payload[0].payload.x_value + unitX
  }

  // Custom tooltip to display info.
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null
    const xValue = calculateXValue(unitX, label, payload)
    return (
      <div className="wa-custom-tooltip__wrapper">
          <span className="unitx-data">{xValue}</span>
          {payload.map((entry, index) => {
              const matchingLine = lines.find(line => line.dataKey === entry.dataKey)
              const legendText = matchingLine ? matchingLine.legend : entry.name
              return (
                  <span className="unity-data" key={index}>
                      <b>{legendText}:</b> {`${entry.value}${unitY}`}
                  </span>
              )
          })}
      </div>
    )
  }

  // Custom Label to display info.
  const CustomizedLabel = (props) => {
    const { x, y, stroke, value } = props
    return (
      <text
        x={x}
        y={y}
        dy={-8}
        fill={stroke}
        fontSize={'var(--wa-font-size-xs)'}
        textAnchor="middle"
      >
        {value}{unitY}
      </text>
    )
  }

  return (
    <WeatherChartStyled className={className}>
      <ResponsiveContainer aspect={aspect}>
        <LineChart data={dataAsNumbers} margin={{ top: mt, left: ml, right: mr, bottom: mb }}>
          {showXAxis && (
            <XAxis
              unit={unitX}
              dataKey="x_value"
              stroke="var(--wa-black)"
            />
          )}
          {showYAxis && (
            <YAxis
              unit={unitY}
              stroke="var(--wa-black)"
            />
          )}
          {tooltip && ( <Tooltip content={<CustomTooltip />} position={{y:0}} /> )}
          <Legend payload={
                    lines.map(line => ({
                        value: line.legend,
                        type: 'line',
                        color: line.colorLine
                    }))
                  } 
                  align='left' 
                  verticalAlign='top' />
          {lines.map((line, index) => (
            <Line
              key={index}
              label={showLabels ? <CustomizedLabel /> : undefined}
              type={line.type}
              dataKey={line.dataKey}
              stroke={line.colorLine}
              dot={line.dot}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </WeatherChartStyled>
  )
}

export default WeatherChart
