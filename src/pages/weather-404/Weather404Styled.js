import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const Weather404Styled = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - (var(--wa-footer-height) + var(--wa-header-height)));
  position: relative;
  overflow: hidden;
  .icon-wrapper {
      width: 100vw;
      height: 90vh;
      position: absolute;
      top: -15vh;
      left: var(--wa-spacing-00);
      right: var(--wa-spacing-00);
      margin: auto;
      ${media('tablet')`
        width: 60vw;
        height: 40vh;
        inset: var(--wa-spacing-00);
      `}
      ${media('mobile')`
          height: 25vh;
      `}
    .cloud-offset, .main-cloud, .small-cloud {
      path {
        fill: var(--wa-deep-blue-op20);
      }
    }
    .small-cloud {
      path {
        animation: flyby 6s linear infinite;
      }
    }
    .wind-string {
      path {
        stroke: var(--wa-deep-blue);
        stroke-linecap: round;
        stroke-width: 0.4375rem;
        animation: wind-blow 3s linear infinite;
      }
    }
  }
  span{
      display: flex;
      user-select: none;
      justify-content: center;
      align-items: flex-end;
      column-gap: var(--wa-spacing-05);
      position: absolute;
      font-size: 3.5rem;
      font-family: var(--wa-font-family-bold);
      bottom: var(--wa-spacing-00);
      right: var(--wa-spacing-06);
      text-transform: uppercase;
      ${media('tablet')`
        font-size: var(--wa-font-size-4xl);
        bottom: var(--wa-spacing-04);
        column-gap: var(--wa-spacing-03);
        line-height: 1.6;
      `}
      ${media('mobile')`
        font-size: var(--wa-font-size-lg);
        bottom: var(--wa-spacing-03);
        right: var(--wa-spacing-04);
      `}
      b{
          font-family: var(--wa-font-family-extrabold);
          font-size: 5.125rem;
          line-height: 1.2;
          ${media('tablet')`
            font-size: var(--wa-font-size-7xl);
          `}
          ${media('mobile')`
            font-size: var(--wa-font-size-6xl);
          `}
      }
  }
`
