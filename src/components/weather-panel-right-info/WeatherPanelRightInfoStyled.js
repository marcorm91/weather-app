import styled from 'styled-components'

export const WeatherPanelRightInfoStyled = styled.div`
    .btn-minimized-panel{
        position: absolute;
        background-color: transparent;
        border: none;
        left: calc(-1 * var(--wa-spacing-05));
        width: 3rem;
        height: 3rem;
        padding: var(--wa-spacing-00);
        cursor: pointer;
    }
    ul{
        &.info__wrapper{
            list-style: none;
            padding: var(--wa-spacing-00);
            margin: var(--wa-spacing-04) var(--wa-spacing-00);
            display: flex;
            flex-direction: column;
            gap: var(--wa-spacing-03);
            > li{
                font-size: var(--wa-font-size-sm);
                > span{
                    font-family: var(--wa-font-family-semibold);
                }
            }
        }
    }
    hr + div:last-child{
        flex: 1;
        ul{
            flex-direction: row;
            flex-wrap: wrap;
            gap: var(--wa-spacing-00);
            margin: var(--wa-spacing-04) var(--wa-spacing-00);
            > li{
                max-width: calc(50% - var(--wa-spacing-04));
                flex: 1 1 calc(50% - var(--wa-spacing-04));
                display: flex;
                justify-content: center;
                &:not(:last-child):after{
                    display: none;
                }
            }
        }
    }
`

export const WeatherMapSkeletonStyled = styled.div`
    width: 100%;
    height: 18.75rem;
`

export const WeatherListSkeletonStyled = styled.div`
    ul{
        display: flex;
        flex-direction: column;
        margin: var(--wa-spacing-00);
        li{
            height: 1.25rem;
            width: 4rem;
            position: relative;
        }
    }
`

export const WeatherCurrentPredictionSkeletonStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--wa-spacing-04);
    margin-top: var(--wa-spacing-04);
    > div:first-child{
        width: 7.5rem;
        height: 7.5rem;
        margin: var(--wa-spacing-00) auto;
    }
    > div:last-child{
        flex: 1;
        width: 100%;
        height: 5rem;
    }
`
