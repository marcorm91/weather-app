import styled from 'styled-components'

export const WeatherCurrentSunsetStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  time{
    display: flex;
    align-items: center;
    gap: 4px;
    > span{
      font-size: 42px;
      &:first-child{
        font-weight: 700;
      }
    }
  }
  .sunset__wrapper{
    display: flex;
    align-items: center;
    flex-direction: column;
    > span{
      font-size: 12px;
    }
  }
`
