import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const WeatherHeaderStyled = styled.header`
  height: 50px;
  background-color: var(--wa-deep-blue);
  color: #ffffff;
  padding: var(--wa-spacing-00) var(--wa-spacing-04);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 1px 8px 1px var(--wa-gray);
  margin-bottom: var(--wa-spacing-03);
  .title__wrapper{
    display: flex;
    align-items: center;
    gap: var(--wa-spacing-04);
    user-select: none;
    color: var(--wa-white);
    text-decoration: none;
    > div{
      width: 36px;
      height: 36px;
    }
    > h1{
      font-size: var(--wa-font-size-md);
      margin: var(--wa-spacing-00);
      text-transform: uppercase;
      letter-spacing: 2px;
      ${media('mobile')`
        display: none;
      `}
    }
  }
  .actions__wrapper{
      display: flex;
      align-items: center;
      gap: var(--wa-spacing-04);
      > button{
        display: flex;
        align-items: center;
        background-color: transparent;
        border: none;
        color: var(--wa-white);
        font-size: var(--wa-font-size-3xl);
        cursor: pointer;
      }
  }
`
