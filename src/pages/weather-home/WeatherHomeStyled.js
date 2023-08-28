import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const WeatherHomeStyled = styled.main`
  min-height: calc(100vh - var(--wa-header-box-height) - var(--wa-footer-height));
  max-height: calc(100vh - var(--wa-header-box-height) - var(--wa-footer-height));
  overflow: auto;
  background-color: var(--wa-dr-white);
  padding: var(--wa-spacing-04);
  box-sizing: border-box;
  > h1{
    margin: var(--wa-spacing-00);
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
    & ~ h1{
      margin-top: var(--wa-spacing-06);
    }
    & ~ .tab-content__wrapper{
      .table__wrapper{
        max-height: calc(100vh - 25.625rem);
      }
    }
  }
  > .content__wrapper{
    display: flex;
    gap: var(--wa-spacing-05);
    > div{
      flex: 1 1 50%;
      max-width: 50%;
      width: 50%;
      ${media('tablet')`
        flex: 1 1 100%;
        max-width: 100%;
        width: 100%;
      `}
    }
    ${media('tablet')`
        flex-direction: column;
    `}
  }
`;
