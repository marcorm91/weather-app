import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const WeatherHomeStyled = styled.main`
  min-height: calc(100vh - var(--wa-header-height) - var(--wa-footer-height));
  max-height: calc(100vh - var(--wa-header-height) - var(--wa-footer-height));
  overflow: auto;
  padding: var(--wa-spacing-04);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > h1{
    margin-top: var(--wa-spacing-00);
    margin-bottom: var(--wa-spacing-04);
    font-size: var(--wa-font-size-2xl);
    ${media('mobile')`
      font-size: var(--wa-font-size-lg);
    `}
  }
  > ul{
    margin: var(--wa-spacing-06) var(--wa-spacing-00);
    ${media('mobile')`
      margin: var(--wa-spacing-04) var(--wa-spacing-00);
    `}
  }
  > .weather-ad__wrapper{
    position: fixed;
    top: var(--wa-spacing-08);
    left: var(--wa-spacing-00);
    right: var(--wa-spacing-00);
    ${media('mobile')`
      display: none;
    `}
    & ~ h1{
      margin-top: var(--wa-spacing-06);
      margin-bottom: var(--wa-spacing-03);
      ${media('mobile')`
        margin-top: var(--wa-spacing-00);
      `}
    }
    & ~ .content__wrapper{
      .table__wrapper{
        max-height: calc(100vh - 25.9375rem);
      }
    }
  }
  > .content__wrapper{
    display: flex;
    gap: var(--wa-spacing-05);
    flex: 1;
    > div{
      background-color: rgba(255, 255, 255, 0.85);
      border-radius: var(--wa-size-border-radius-03);
      border: var(--wa-border-width-01) solid rgba(209, 213, 219, 0.3);
      padding: var(--wa-spacing-04);
      box-sizing: border-box;
      &.flex-50{
        flex: 1 1 50%;
        max-width: 50%;
        width: 50%;
      }
      &.flex-45{
        flex: 1 1 45%;
        max-width: 45%;
        width: 45%;
      }
      &.flex-10{
        flex: 1 1 10%;
        max-width: 10%;
        width: 10%;
        height: fit-content;
      }
      ${media('tablet')`
        &[class^='flex-']{
          flex: 1 1 100%;
          max-width: 100%;
          width: 100%;
        }
      `}
    }
    ${media('tablet')`
        flex-direction: column;
    `}
  }
`;
