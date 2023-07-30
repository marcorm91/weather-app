import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const WeatherTableStyled = styled.div`
  margin: 14px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  ${media('mobile')`
    margin: 24px 0 0 0;
  `}
  .table-top__wrapper{
    display: flex;
    align-self: flex-end;
    gap: 32px;
    ${media('mobile')`
      flex-direction: column;
      gap: 16px;
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
            top: 0;
            background-color: var(--wa-dr-white);
            tr{
                th{
                    border-bottom: 2px solid var(--wa-leadbelcher);
                    padding: 6px 4px;
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
                padding: 4px;
                box-sizing: border-box;
                font-size: 13px;
                label{
                  font-family: var(--wa-font-family-semibold);
                  margin-right: 4px;
                }
              `}
              span{
                &.no-results-text{
                    display: block;
                    font-family: var(--wa-font-family-semibold);
                    font-size: 400;
                    margin: 16px 0;
                }
              }
            }
          }
        }
    }
  }
`
