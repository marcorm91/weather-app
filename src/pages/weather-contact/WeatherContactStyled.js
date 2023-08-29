import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const WeatherContactStyled = styled.main`
  min-height: calc(100vh - var(--wa-header-height) - var(--wa-footer-height));
  max-height: calc(100vh - var(--wa-header-height) - var(--wa-footer-height));
  overflow: auto;
  background-color: var(--wa-dr-white);
  padding: var(--wa-spacing-04);
  box-sizing: border-box;
  display: flex;
  gap: var(--wa-spacing-06);
  ${media('mobile')`
    flex-direction: column-reverse;
    gap: var(--wa-spacing-04);
  `}
  > .col__wrapper{
    height: 100%;
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: var(--wa-size-border-radius-03);
    border: var(--wa-border-width-01) solid rgba(209, 213, 219, 0.3);
    padding: var(--wa-spacing-04);
    h2, p{
      margin: var(--wa-spacing-00) var(--wa-spacing-00) var(--wa-spacing-04) var(--wa-spacing-00);
    }
    p, a, ul{
      font-size: var(--wa-font-size-sm);
    }
    ul{
      list-style: square;
      &.contact__wrapper{
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: var(--wa-spacing-03);
        padding: var(--wa-spacing-00);
        a{
          text-decoration: none;
          color: var(--wa-black);
          font-family: var(--wa-font-family-medium);
          display: flex;
          align-items: center;
          gap: var(--wa-spacing-03);
          svg{
            color: var(--wa-deep-blue);
          }
        }
      }
    }
    &:first-child{
      flex: 1 1 75%;
      ${media('mobile')`
        flex: 1 1 100%;
      `}
    }
    &:last-child{
      flex: 1 1 25%;
      position: sticky;
      top: var(--wa-spacing-00);
      ${media('mobile')`
        flex: 1 1 100%;
        position: static;
      `}
    }
  }
`;
