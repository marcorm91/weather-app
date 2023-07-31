import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const WeatherTableStyled = styled.div`
  margin: var(--wa-spacing-04) var(--wa-spacing-00);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--wa-spacing-04);
  ${media('mobile')`
    margin: var(--wa-spacing-05) var(--wa-spacing-00) var(--wa-spacing-00) var(--wa-spacing-00);
  `}
  .table-top__wrapper{
    display: flex;
    align-self: flex-end;
    gap: 32px;
    ${media('mobile')`
      flex-direction: column;
      gap: var(--wa-spacing-04);
      align-self: auto;
      width: 100%;
    `}
    > input{
      min-width: 340px;
    }
  }
  .table__wrapper{
    width: 100%;
    max-height: calc(100vh - 380px);
    overflow: auto;
    ${media('mobile')`
      max-height: calc(100vh - 420px);
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
