import styled from 'styled-components'

export const WeatherPredictionHoursStyled = styled.div`
  > ul{
    &.prediction-hours__wrapper{
        list-style: none;
        margin: var(--wa-spacing-06) var(--wa-spacing-00);
        padding: var(--wa-spacing-00);
        display: grid;
        gap: var(--wa-spacing-03);
        grid-template-columns: repeat(26, 1fr);
        overflow: auto;
        > li{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            > div{
                &:not(.react-tooltip, .ad-warning__wrapper){
                    width: 4.375rem;
                    height: 4.375rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    user-select: none;
                }
            }
            &.ad-warning__wrapper{
                position: absolute;
                top: var(--wa-spacing-00);
            }
            &:first-child{
                background-color: var(--wa-deep-blue-light);
                position: sticky;
                left: var(--wa-spacing-00);
                z-index: 1;
            }
            &:not(:first-child){
                background-color: var(--wa-deep-blue-op10);
                transition: 0.3s;
                > div{
                    font-family: var(--wa-font-family-semibold);
                    font-size: var(--wa-font-size-sm);
                    > span {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        > div{
                            display: flex;
                            align-items: center;
                        }
                    }
                }
                &:hover{
                    background-color: var(--wa-deep-blue-op20);
                }
            }
            &.limit-day{
                &:after{
                    content: "";
                    position: absolute;
                    right: calc(-1 * var(--wa-spacing-03));
                    top: var(--wa-spacing-00);
                    bottom: var(--wa-spacing-00);
                    width: 0.25rem;
                    background: repeating-linear-gradient(
                        325deg,
                        var(--wa-deep-blue-op10),
                        var(--wa-deep-blue-op10) 0.625rem,
                        var(--wa-deep-blue-light) 0.625rem,
                        var(--wa-deep-blue-light) 1.25rem);
                    border-left: var(--wa-border-width-03) solid var(--wa-white);
                    border-right: var(--wa-border-width-03) solid var(--wa-white);
                }
            }
        }
    }  
  }
`

export const WeatherPredictionHoursSkeletonStyled = styled.ul`
    list-style: none;
    margin: var(--wa-spacing-06) var(--wa-spacing-00);
    padding: var(--wa-spacing-00);
    display: grid;
    gap: var(--wa-spacing-03);
    grid-template-columns: repeat(26, 1fr);
    overflow: hidden;
    > li{
        > div{
            width: 4.375rem;
            height: 4.375rem;
            border-radius: var(--wa-size-border-radius-00);
        }
    }
`
