import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const WeatherMoreInfoStyled = styled.main`
  min-height: calc(100vh - var(--wa-header-box-height) - var(--wa-footer-height));
  max-height: calc(100vh - var(--wa-header-box-height) - var(--wa-footer-height));
  overflow: auto;
  background-color: var(--wa-dr-white);
  padding: var(--wa-spacing-04);
  box-sizing: border-box;
  display: flex;
  gap: var(--wa-spacing-04);
  > .col__wrapper{
    display: flex;
    flex-direction: column;
    gap: var(--wa-spacing-04);
    &:first-child{
      flex: 1 1 60%;
      > h2{
        margin: var(--wa-spacing-00);
        ${media('mobile')`
          font-size: var(--wa-font-size-lg);
        `}
      }
    }
    &:last-child{
      flex: 1 1 40%;
      background-color: var(--wa-deep-blue-op10);
      padding: var(--wa-spacing-04) var(--wa-spacing-06);
      box-sizing: border-box;
      border-radius: var(--wa-size-border-radius-02);
      position: sticky;
      max-height: 100%;
      border-right: var(--wa-border-width-04) solid var(--wa-deep-blue);
      ${media('mobile')`
        display: none;
      `}
      &:after{
        content: "";
        position: absolute;
        left: calc(-1 * var(--wa-spacing-03));
        bottom: var(--wa-spacing-00);
        top: var(--wa-spacing-00);
        margin: auto;
        width: var(--wa-spacing-04);
        height: var(--wa-spacing-04);
        background-color: var(--wa-dr-white);
        transform: rotate(45deg);
      }
      > div{
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    }
  }
  /** Minimized panel */
  &.minimized-panel{
    > .col__wrapper:last-child{
      max-width: 8.75rem;
      flex: 1;
      padding: var(--wa-spacing-04) var(--wa-spacing-00);
      .btn-minimized-panel{
        transform: rotate(180deg);
      }
      .map__wrapper, .info__wrapper, .separator{
        display: none;
      }
      .separator + div{
        > div:first-child{ // Current temp
          flex-direction: column;
          gap: var(--wa-spacing-00);
          > span{
            font-size: var(--wa-font-size-5xl);
          }
        }
        > div:last-child{ // Current values (humidity, wind, ...)
          ul{
            flex-direction: column;
            align-items: center;
            gap: var(--wa-spacing-03);
            margin: var(--wa-spacing-06) var(--wa-spacing-00);
            li{
              margin: var(--wa-spacing-00);
              width: 100%;
              max-width: 100%;
              flex: 1 1 100%;
              &.wind__wrapper{
                > span:last-child{
                  display: none;
                }
              }
              &.precipitation__wrapper{
                > span{
                  display: block;
                  margin-top: var(--wa-spacing-03);
                }
              }
              span{
                font-size: var(--wa-font-size-sm);
              }
              svg{
                display: none;
              }
            }
          }
        }
      }
    }
  }
`;
