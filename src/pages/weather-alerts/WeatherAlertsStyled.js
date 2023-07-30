import styled from 'styled-components'

export const WeatherAlertsStyled = styled.main`
  min-height: calc(100vh - 68px - 30px);
  max-height: calc(100vh - 68px - 30px);
  overflow: auto;
  background-color: var(--wa-dr-white);
  padding: 16px;
  box-sizing: border-box;
  > span{
    display: block;
    margin-bottom: 16px;
    font-size: 14px;
  }
`;
