import styled from 'styled-components'

export const WeatherDetailChartStyled = styled.div`
    position: fixed;
    left: var(--wa-spacing-00);
    right: var(--wa-spacing-00);
    bottom: var(--wa-spacing-00);
    background-color: var(--wa-white);
    z-index: 2;
    box-shadow: var(--wa-box-shadow-01);
    padding: var(--wa-spacing-04);
    box-sizing: border-box;
    height: 50vh;
    &:after{
        content: "";
        position: fixed;
        height: 50vh;
        top: var(--wa-spacing-00);
        left: var(--wa-spacing-00);
        right: var(--wa-spacing-00);
        background-color: #00000050;
    }
    > div{
        margin-top: var(--wa-spacing-04);
        height: 100%;
        .recharts-responsive-container{
            height: 100%;
            .recharts-wrapper{
                min-height: 100%;
                .recharts-surface{
                    height: 100%;
                }
            }
        }
    }
    > button{
        position: absolute;
        top: var(--wa-spacing-04);
        right: var(--wa-spacing-05);
        background-color: transparent;
        border: none;
        cursor: pointer;
        z-index: 2;
        outline: none;
    }
`
