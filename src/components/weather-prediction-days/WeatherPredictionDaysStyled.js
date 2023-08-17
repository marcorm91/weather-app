import styled from 'styled-components'

export const WeatherPredictionDaysStyled = styled.div`
    ul{
        &.prediction-days__wrapper{
            list-style: none;
            margin: var(--wa-spacing-06) var(--wa-spacing-00);
            padding: var(--wa-spacing-00);
            display: grid;
            gap: var(--wa-spacing-03);
            grid-template-columns: 4.375rem repeat(7, max-content);
            overflow: auto;
            > li{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: relative;
                > div{
                    &:not(.react-tooltip, .ad-warning__wrapper){
                        min-height: 4.375rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                        user-select: none;
                    }
                }
                .react-tooltip{
                    white-space: normal !important;
                    padding: var(--wa-spacing-03) !important;
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
                    padding: 0 var(--wa-spacing-03);
                    > div{
                        font-family: var(--wa-font-family-semibold);
                        font-size: var(--wa-font-size-sm);
                        width: 100%;
                        > * {
                            white-space: nowrap;
                            flex: 1;
                            padding: var(--wa-spacing-00) var(--wa-spacing-04);
                            > div{
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                        }
                    }
                    &:hover{
                        background-color: var(--wa-deep-blue-op20);
                    }
                }
                &:nth-child(3){
                    > div:not(:first-child, :last-child){
                        > *:nth-child(-n+3){
                            display: none;
                        }
                    }
                }
            }
        }  
    }
`
