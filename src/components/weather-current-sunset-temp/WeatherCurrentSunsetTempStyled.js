import styled from 'styled-components'

export const WeatherCurrentSunsetTempStyled = styled.div`
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
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
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
`
