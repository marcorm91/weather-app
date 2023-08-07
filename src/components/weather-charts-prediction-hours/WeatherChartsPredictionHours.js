import WeatherChart from '../weather-chart/WeatherChart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { WeatherChartsPredictionHoursStyled } from './WeatherChartsPredictionHoursStyled'

const WeatherChartsPredictionHours = ( { chartTempData, chartWindData, chartRainData, chartSnowData } ) => {
  return (
    <WeatherChartsPredictionHoursStyled>
        <li>
            <WeatherChart
              colorLine={'var(--wa-deep-blue)'}
              data={chartTempData}
              aspect={5}
              unitY={'º'}
              unitX={'h'}
              dataKey={'Temperatura'}
              legend={'Temperatura'}
              showXAxis={false}
              showYAxis={false}
              showLabels={false}
              tooltip={true}
              dot={false}
            />
            <button>
              <FontAwesomeIcon icon={faMagnifyingGlass} color='var(--wa-deep-blue)' size='lg'/>
            </button>
        </li>
        <li>
            <WeatherChart
              colorLine={'var(--wa-deep-blue)'}
              data={chartWindData}
              unitY={' Km/h'}
              unitX={'h'}
              aspect={5}
              dataKey={'Viento'}
              legend={'Viento'}
              showXAxis={false}
              showYAxis={false}
              showLabels={false}
              tooltip={true}
              dot={false}
            />
            <button>
              <FontAwesomeIcon icon={faMagnifyingGlass} color='var(--wa-deep-blue)' size='lg'/>
            </button>
        </li>  
        <li>
            <WeatherChart
              colorLine={'var(--wa-deep-blue)'}
              data={chartRainData}
              aspect={5}
              unitY={' mm.'}
              unitX={'h'}
              dataKey={'Precipitacion'}
              legend={'Precipitacion'}
              showXAxis={false}
              showYAxis={false}
              showLabels={false}
              tooltip={true}
              dot={false}
            />
            <button>
              <FontAwesomeIcon icon={faMagnifyingGlass} color='var(--wa-deep-blue)' size='lg'/>
            </button>
        </li> 
        <li>
            <WeatherChart
              colorLine={'var(--wa-deep-blue)'}
              data={chartSnowData}
              aspect={5}
              unitY={' cm.'}
              unitX={'h'}
              dataKey={'Nieve'}
              legend={'Nieve'}
              showXAxis={false}
              showYAxis={false}
              showLabels={false}
              tooltip={true}
              dot={false}
            />
            <button>
              <FontAwesomeIcon icon={faMagnifyingGlass} color='var(--wa-deep-blue)' size='lg'/>
            </button>
        </li>      
    </WeatherChartsPredictionHoursStyled>
  )
}

export default WeatherChartsPredictionHours
