import styled from 'styled-components'

export const WeatherAlertsStyled = styled.main`
  min-height: calc(100vh - var(--wa-header-height) - var(--wa-footer-height));
  max-height: calc(100vh - var(--wa-header-height) - var(--wa-footer-height));
  overflow: auto;
  background-color: var(--wa-dr-white);
  padding: var(--wa-spacing-04);
  box-sizing: border-box;
  > div{
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: var(--wa-size-border-radius-03);
    border: var(--wa-border-width-01) solid rgba(209, 213, 219, 0.3);
    padding: var(--wa-spacing-04);
    > span{
      display: block;
      margin-bottom: var(--wa-spacing-04);
      font-size: var(--wa-font-size-sm);
    }
  }

`

export const WeatherAccordionSkeletonStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--wa-spacing-03);
  > div{
    height: 2.375rem;
    width: 50%;
  }
`
