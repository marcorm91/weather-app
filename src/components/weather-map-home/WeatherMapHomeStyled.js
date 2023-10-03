import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const WeatherMapHomeStyled = styled.div`
    position: relative;
    height: 100%;
    > .loading-skeleton{
      width: 100%;
      height: 100%;
      z-index: 2;
      > * {
        display: none;
      }
    }
    > div{
      width: 100%;
      height: 100%;
      z-index: 0;
      ${media('tablet')`
          min-height: 600px;
      `}
      ${media('mobile')`
          min-height: 450px;
      `}
      .leaflet-interactive{
        cursor: default;
      }
      .leaflet-bottom.leaflet-right{
        display: none;
      }
      .leaflet-marker-icon{
        &.leaflet-div-icon{
          background-color: transparent;
          border: none;
        }
      }
      .custom-marker{
        > span{
          background-color: var(--wa-deep-blue);
          color: #fff;
          font-family: var(--wa-font-family-semibold);
          padding: var(--wa-spacing-01) var(--wa-spacing-02);
          border-radius: var(--wa-size-border-radius-01);
        }
      }
    }
    > ul{
      padding: var(--wa-spacing-03);
      margin: var(--wa-spacing-00);
      display: flex;
      flex-direction: column;
      gap: var(--wa-spacing-02);
      font-size: var(--wa-font-size-xs);
      list-style: none;
      position: absolute;
      top: var(--wa-spacing-02);
      right: var(--wa-spacing-02);
      z-index: 1;
      &:after{
        content: "";
        position: absolute;
        inset: var(--wa-spacing-00);
        margin: auto;
        background: var(--wa-black-op99);
        border-radius: var(--wa-size-border-radius-01);
      }
      > li{
        color: var(--wa-white);
        position: relative;
        z-index: 1;
      }
    }
    .canaries{
      position: absolute;
      bottom: var(--wa-spacing-02);
      left: var(--wa-spacing-02);
    }
    .spain-top-right{
      position: absolute;
      top: var(--wa-spacing-02);
      right: var(--wa-spacing-02);
    }
    .spain-top-left{
      position: absolute;
      top: var(--wa-spacing-02);
      left: var(--wa-spacing-02);
    }
`
