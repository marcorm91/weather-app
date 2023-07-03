import styled from 'styled-components'

export const WeatherCurrentPredictionStyled = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
    > div:first-child{
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 21px;
      > span{
        font-size: 48px;
        font-weight: 700;
        position: relative;
        &:after{
          content: 'º';
          position: absolute;
          font-size: 26px;
        }
      }
      > div{
        display: flex;
        align-items: center;
        flex-direction: column;
        > span{
          font-size: 12px;
        }
      }
    }
    > div:last-child{
      ul{
        display: flex;
        justify-content: center;
        gap: 32px;
        margin: 0;
        padding: 0;
        list-style: none;
        li{
          display: flex;
          align-items: center;
          gap: 4px;
          &.temperature__wrapper{
            display: flex;
            gap: 8px;
            > span{
              font-size: 16px;
              font-weight: 700;
              position: relative;
              &:after{
                content: 'º';
                position: absolute;
                font-size: 12px;
              }
            }
          }
          &.humidity__wrapper{
            > span{
              display: flex;
              gap: 2px;
              font-size: 16px;
              font-weight: 700;
              &:after{
                content: "%";
              }
            }
          }
          &.wind__wrapper{
            gap: 12px;
            > span{
              display: flex;
              gap: 2px;
              font-size: 16px;
              font-weight: 700;
              &:last-child{
                line-height: 0;
                font-size: 14px;
                gap: 0;
                align-items: center;
              }
            }
          }
          &.precipitation__wrapper{
            gap: 12px;
            > span{
              display: flex;
              gap: 2px;
              font-size: 16px;
              font-weight: 700;
              &:last-child{
                line-height: 0;
                font-size: 14px;
                gap: 0;
                align-items: center;
              }
            }
          }
          &:not(:last-child):after{
            content: "|";
            display: inline-flex;
            margin-left: 28px;
          }
        }
      }
    }
`
