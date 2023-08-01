import styled from 'styled-components'

export const WeatherAlertsStyled = styled.main`
  min-height: calc(100vh - var(--wa-header-box-height) - var(--wa-footer-height));
  max-height: calc(100vh - var(--wa-header-box-height) - var(--wa-footer-height));
  overflow: auto;
  background-color: var(--wa-dr-white);
  padding: var(--wa-spacing-04);
  box-sizing: border-box;
  > span{
    display: block;
    margin-bottom: var(--wa-spacing-04);
    font-size: var(--wa-font-size-sm);
  }
`;
