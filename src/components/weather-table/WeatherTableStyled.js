import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const WeatherTableStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--wa-spacing-04);
  > .loading-skeleton{
    width: 100%;
    height: 50vh;
  }
  .table-top__wrapper{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: var(--wa-spacing-06);
    margin: var(--wa-spacing-04) var(--wa-spacing-00) var(--wa-spacing-03) var(--wa-spacing-00);
    ${media('mobile')`
      flex-direction: column;
      align-items: flex-start;
      gap: var(--wa-spacing-04);
    `}
    > div{
      display: flex;
      flex-wrap: wrap;
      column-gap: 24px;
      row-gap: 16px;
      &:first-child{
        ${media('mobile')`
          width: 100%;
        `}
        > input{
          ${media('mobile')`
            flex: 1 1 auto;
          `}
        }
      }
      &:last-child{
        ${media('mobile')`
          align-self: flex-end;
        `}
      }
      .overlay-panel__wrapper{
        position: relative;
        > button{
          background-color: transparent;
          border: var(--wa-border-width-01) solid var(--wa-deep-blue);
          width: 2rem;
          height: 2rem;
          border-radius: var(--wa-size-border-radius-01);
          cursor: pointer;
          font-size: var(--wa-font-size-xl);
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(--wa-deep-blue);
        }
        .overlay-panel{
          position: absolute;
          background: var(--wa-white);
          z-index: 11;
          padding: var(--wa-spacing-05);
          box-shadow: 0 0 0.25rem 0 var(--wa-black-op50);
          border-radius: var(--wa-size-border-radius-02);
          top: calc(100% + var(--wa-spacing-02));
          gap: var(--wa-spacing-05);
          ${media('tablet')`
            flex-direction: column;
          `}
        }
      }
    }
  }
  .table__wrapper{
    width: 100%;
    max-height: calc(100vh - 24.6875rem);
    overflow: auto;
    ${media('mobile')`
      max-height: calc(100vh - 26.25rem);
    `}
    table{
        width: 100%;
        text-align: left;
        border-spacing: 0;  
        thead{
            position: sticky;
            top: var(--wa-spacing-00);
            background-color: var(--wa-dr-white);
            tr{
                th{
                    border-bottom: var(--wa-border-width-02) solid var(--wa-leadbelcher);
                    padding: var(--wa-spacing-03) var(--wa-spacing-02);
                    font-weight: normal;
                    font-family: var(--wa-font-family-semibold);
                    &.hide-column{
                      display: none;
                    }
                }
            }
            ${media('mobile')`
              display: none;
            `}
        }
        tbody{
          tr{
            ${media('mobile')`
              display: flex;
              flex-direction: column;
            `}
            td{
              ${media('mobile')`
                min-width: 100%;
                border-bottom: none;
                padding: var(--wa-spacing-02);
                box-sizing: border-box;
                font-size: var(--wa-font-size-xs);
                label{
                  font-family: var(--wa-font-family-semibold);
                  margin-right: var(--wa-spacing-02);
                }
              `}
              span{
                &.no-results-text{
                    display: block;
                    font-family: var(--wa-font-family-semibold);
                    margin: var(--wa-spacing-04) var(--wa-spacing-00);
                }
              }
            }
          }
        }
    }
  }
`
