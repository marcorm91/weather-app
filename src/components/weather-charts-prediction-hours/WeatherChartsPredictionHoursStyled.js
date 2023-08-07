import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const WeatherChartsPredictionHoursStyled = styled.ul`
    list-style: none;
    margin: var(--wa-spacing-00);
    padding: var(--wa-spacing-00);
    display: flex;
    flex-wrap: wrap;
    user-select: none;
    > li{
        flex: 1 1 50%;
        max-width: calc(50% - var(--wa-spacing-02));
        position: relative;
        ${media('tablet')`
            flex: 1 1 100%;
            max-width: 100%;
        `}
        > button{
            position: absolute;
            right: var(--wa-spacing-04);
            top: var(--wa-spacing-00);
            background-color: transparent;
            border: none;
            padding: var(--wa-spacing-00);
            cursor: pointer;
        }
    }
`
