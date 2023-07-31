import styled from 'styled-components'

export const WeatherTableRowActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--wa-spacing-03);
  > button{
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: var(--wa-font-size-lg);
    width: 32px;
    outline: none;
    &.fav-button{
      color: var(--wa-leadbelcher);
      &.checked{
        color: var(--wa-green);
      }
    }
  }
`
