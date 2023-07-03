import styled from 'styled-components'

export const WeatherTodayPredictionStyled = styled.div`
display: flex;
flex-direction: column;
gap: 32px;
> span{
  font-size: 14px;
  font-weight: 700;
}
> ul{
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  gap: 16px;
  max-width: 100%;
  overflow: auto;
  > li{
      border-right: 1px solid var(--wa-leadbelcher);
      padding-right: 16px;
      text-align: center;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 8px;
      max-width: 250px;
      &:first-child{
        border-left: 1px solid var(--wa-leadbelcher);
        padding-left: 16px;
      }
    > time, > span{
      font-size: 12px;
    }
    > span{
      font-weight: 700;
    }
  }
}
`
