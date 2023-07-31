import styled from 'styled-components'

export const WeatherTodayPredictionStyled = styled.div`
display: flex;
flex-direction: column;
gap: 32px;
> span{
  font-size: var(--wa-font-size-sm);
  font-family: var(--wa-font-family-semibold);
}
> ul{
  display: flex;
  align-items: center;
  margin: var(--wa-spacing-00);
  padding: 0;
  list-style: none;
  gap: var(--wa-spacing-04);
  max-width: 100%;
  overflow: auto;
  > li{
      border-right: var(--wa-border-width-01) solid var(--wa-leadbelcher);
      padding-right: var(--wa-spacing-04);
      text-align: center;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: var(--wa-spacing-03);
      max-width: 15.625rem;
      &:first-child{
        border-left: var(--wa-border-width-01) solid var(--wa-leadbelcher);
        padding-left: var(--wa-spacing-04);
      }
    > time, > span{
      font-size: var(--wa-font-size-sm);
    }
    > span{
      font-family: var(--wa-font-family-semibold);
    }
  }
}
`
