import styled from 'styled-components'

export const WeatherChartStyled = styled.div`
    font-size: var(--wa-font-size-sm);
    font-family: var(--wa-font-family-light);
    .recharts-legend-wrapper{
        top: var(--wa-spacing-00) !important;
        .recharts-legend-item-text{
            font-family: var(--wa-font-family-semibold);
        }
    }
`