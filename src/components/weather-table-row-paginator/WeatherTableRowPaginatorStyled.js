import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const WeatherTableRowPaginatorStyled = styled.div`
  &{
    align-self: flex-end;
    display: flex;
    gap: var(--wa-spacing-04);
    margin-top: var(--wa-spacing-04);
    button{
        background-color: transparent;
        border: none;
        border-radius: var(--wa-size-border-radius-00);
        outline: none;
        font-size: var(--wa-font-size-md);
        cursor: pointer;
    }
    > span{
        display: flex;
        align-items: center;
        gap: var(--wa-spacing-03);
    }
    ${media('mobile')`
      button, span, select{
        font-size: var(--wa-font-size-xs);
        text-align: center;
      }
    `}
  }
`
