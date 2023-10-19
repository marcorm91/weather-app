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
        .temperature-wrapper{
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--wa-deep-blue);
          border-radius: var(--wa-size-border-radius-04);
          padding: var(--wa-spacing-02);
          width: 1rem;
          height: 1rem;
          font-size: var(--wa-font-size-xs);
          color: var(--wa-white);
          font-family: var(--wa-font-family-semibold);
          box-shadow: var(--wa-box-shadow-02);
          &.type-1{
            background-color: var(--wa-temp-type-1);
          }
          &.type-2{
            background-color: var(--wa-temp-type-2);
          }
          &.type-3{
            background-color: var(--wa-temp-type-3);
          }
          &.type-4{
            background-color: var(--wa-temp-type-4);
          }
          &.type-5{
            background-color: var(--wa-temp-type-5);
          }
          &.type-6{
            background-color: var(--wa-temp-type-6);
          }
          &.type-7{
            background-color: var(--wa-temp-type-7);
          }
        }
      }
      .custom-marker{
        > span{
          background-color: var(--wa-deep-blue);
          color: var(--wa-white);
          font-family: var(--wa-font-family-semibold);
          padding: var(--wa-spacing-01) var(--wa-spacing-02);
          border-radius: var(--wa-size-border-radius-01);
        }
      }
    }
    > ul{
      &.list-options__wrapper{
        background-color: var(--wa-deep-blue);
        list-style: none;
        padding: var(--wa-spacing-03) var(--wa-spacing-04);
        margin: var(--wa-spacing-00);
        position: absolute;
        bottom: var(--wa-spacing-02);
        right: var(--wa-spacing-02);
        border-radius: var(--wa-size-border-radius-01);
        display: flex;
        gap: var(--wa-spacing-04);
        > li{
          pointer-events: none;
          &.inactive-item{
            pointer-events: auto;
            opacity: .5;
            cursor: pointer;
          }
        }
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
    .leaflet-popup{
      margin-bottom: var(--wa-spacing-03);
      &-tip-container, &-close-button{
        display: none;
      }
      &-content-wrapper{
        border-radius: var(--wa-size-border-radius-01);
        background-color: var(--wa-deep-blue);
        .leaflet-popup-content{
          margin: var(--wa-spacing-00);
          padding: var(--wa-spacing-01);
          text-align: center;
          font-family: var(--wa-font-family-semibold);
          color: var(--wa-white);
          font-size: var(--wa-font-size-xs);
        }
      }
    }
`
