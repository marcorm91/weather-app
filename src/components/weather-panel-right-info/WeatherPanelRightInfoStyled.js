import styled from "styled-components";

export const WeatherPanelRightInfoStyled = styled.div`
    ul{
        &.info__wrapper{
            list-style: none;
            padding: 0;
            margin: 16px 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
            > li{
                font-size: 14px;
                > span{
                    font-weight: 700;
                }
            }
        }
    }
    hr + div:last-child{
        flex: 1;
        ul{
            flex-direction: row;
            flex-wrap: wrap;
            gap: 16px;
            margin: 16px 0;
            > li{
                max-width: calc(50% - 16px);
                flex: 1 1 calc(50% - 16px);
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
    height: 300px;
`

export const WeatherListSkeletonStyled = styled.div`
    ul{
        display: flex;
        li{
            height: 20px;
            position: relative;
        }
    }
`

export const WeatherCurrentPredictionSkeletonStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 16px;
    > div:first-child{
        width: 120px;
        height: 120px;
        margin: 0 auto;
    }
    > div:last-child{
        flex: 1;
        width: 100%;
        height: 80px;
    }
`
