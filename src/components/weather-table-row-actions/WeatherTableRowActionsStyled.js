import styled from "styled-components";

export const WeatherTableRowActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  > button{
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 18px;
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
