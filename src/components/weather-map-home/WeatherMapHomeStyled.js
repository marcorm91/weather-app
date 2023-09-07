import styled from 'styled-components'

export const WeatherMapHomeStyled = styled.div`
    position: relative;
    height: 100%;
    div[ref="mapContainerRef"], .loading-skeleton{
      width: 100%;
      height: 100%;
      z-index: 0;
      .leaflet-interactive{
        cursor: grab;
      }
      .leaflet-marker-icon{
        &.leaflet-div-icon{
          background-color: transparent;
          border: none;
        }
        &.custom-icon{
          &:after{
            content: "";
            position: absolute;
            inset: var(--wa-spacing-00);
            z-index: -1;
            filter: blur(0.0625rem);
            background: radial-gradient(ellipse 50% 50% at 50% 50%, var(--wa-white), var(--wa-white-op50), transparent);         
          }
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
`
