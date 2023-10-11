import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const WeatherCurrentGeolocationStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  .loading-skeleton{
    width: 100%;
    height: 16rem;
  }
  > span{
    font-size: var(--wa-font-size-sm);
    > b{
        font-weight: normal;
        font-family: var(--wa-font-family-semibold);
    }
  }
  > a{
    min-width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: var(--wa-spacing-05);
    align-self: center;
  }
  > ul{
    margin: var(--wa-spacing-04) var(--wa-spacing-00) var(--wa-spacing-00) var(--wa-spacing-00);
    padding: var(--wa-spacing-00);
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--wa-spacing-03);
    ${media('tablet')`
          flex-direction: row;
          flex-wrap: wrap;
          column-gap: var(--wa-spacing-05);
          justify-content: center;
    `}
    > li{
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: var(--wa-font-family-semibold);
        font-size: var(--wa-font-size-sm);
        color: var(--wa-black);
        &.current-sky__wrapper{
          ${media('tablet')`
            flex: 1 1 100%;
          `}
          svg{
            width: 5.25rem;
            height: 5.25rem;
          }
          span{
            display: none;
          }
        }
        &.current-temp__wrapper{
          display: flex;
          flex-direction: column;
          margin-bottom: var(--wa-spacing-04);
          ${media('tablet')`
            flex: 1 1 100%;
          `}
            > span{
              &.main-text__wrapper{
                font-size: var(--wa-font-size-4xl);
                font-family: var(--wa-font-family-bold);
              }
            }
        }
        &.current-wind__wrapper{
          display: flex;
          flex-direction: column;
          align-items: center;
          > span{
            display: flex;
          }
        }
    }
  }
`