import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const WeatherMoreInfoStyled = styled.main`
  min-height: calc(100vh - 68px - 30px);
  max-height: calc(100vh - 68px - 30px);
  overflow: auto;
  background-color: var(--wa-dr-white);
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  gap: 16px;
  > .col__wrapper{
    &:first-child{
      flex: 1 1 60%;
      > h2{
        margin: 0;
      }
    }
    &:last-child{
      flex: 1 1 40%;
      background-color: var(--wa-deep-blue-op10);
      padding: 16px 32px;
      box-sizing: border-box;
      border-radius: 8px;
      position: sticky;
      max-height: 100%;
      border-right: 8px solid var(--wa-deep-blue);
      ${media('mobile')`
        display: none;
      `}
      &:after{
        content: "";
        position: absolute;
        left: -8px;
        bottom: 0;
        top: 0;
        margin: auto;
        width: 16px;
        height: 16px;
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
      max-width: 140px;
      flex: 1;
      padding: 16px 0;
      .btn-minimized-panel{
        transform: rotate(180deg);
      }
      .map__wrapper, .info__wrapper, .separator{
        display: none;
      }
      .separator + div{
        > div:first-child{ // Current temp
          flex-direction: column;
          gap: 0;
          > span{
            font-size: 36px;
          }
        }
        > div:last-child{ // Current values (humidity, wind, ...)
          ul{
            flex-direction: column;
            align-items: center;
            gap: 8px;
            margin: 32px 0;
            li{
              margin: 0px;
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
                  margin-top: 12px;
                }
              }
              span{
                font-size: 14px;
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
